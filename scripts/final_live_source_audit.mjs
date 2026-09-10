import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();

// UNESCO site mapping: ID -> recognized designation keywords/aliases
const UNESCO_RECOGNIZED_ALIASES = {
  '252': ['taj mahal'],
  '255': ['fatehpur sikri'],
  '233': ['qutb minar', 'qutub minar'],
  '231': ['red fort'],
  '232': ['humayun'],
  '944': ['mountain railways', 'kalka', 'shimla'],
  '247': ['hill forts of rajasthan', 'amber', 'amer', 'jaisalmer'],
  '922': ['rani-ki-vav', 'rani ki vav'],
  '1101': ['champaner-pavagadh', 'champaner'],
  '242': ['ajanta'],
  '243': ['ellora'],
  '945': ['chhatrapati shivaji', 'victoria terminus', 'csmt'],
  '234': ['churches and convents of goa', 'bom jesus', 'old goa'],
  '241': ['hampi', 'vijayanagara'],
  '239': ['pattadakal'],
  '1670': ['sacred ensembles of the hoysalas', 'hoysalas', 'belur', 'halebidu', 'somnathpura', 'chennakeshava', 'keshava'],
  '250': ['great living chola temples', 'chola', 'brihadisvara', 'thanjavur'],
  '249': ['mahabalipuram', 'mamallapuram', 'shore temple', 'pancha rathas'],
  '1570': ['kakatiya rudreshwara', 'ramappa'],
  '240': ['khajuraho'],
  '524': ['buddhist monuments at sanchi', 'sanchi', 'great stupa'],
  '246': ['sun temple', 'konârak', 'konark'],
  '1056': ['mahabodhi', 'bodh gaya'],
  '1502': ['nalanda mahavihara', 'nalanda'],
  '337': ['kaziranga'],
  '1406': ['great himalayan national park', 'ghnp'],
  '1338': ['jantar mantar'],
  '251': ['agra fort'],
  '335': ['nanda devi', 'valley of flowers'],
  '1513': ['khangchendzonga', 'kanchenjunga'],
  '5893': ['apatani cultural landscape', 'apatani', 'ziro'],
  '6055': ['cold desert cultural landscape', 'cold desert', 'tabo', 'spiti']
};

function cleanString(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getStatusText(code) {
  const map = {
    200: 'OK',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden / Blocked',
    404: 'Not Found',
    418: "I'm a teapot (Bot Blocked)",
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  };
  return map[code] || 'HTTP Error';
}

async function fetchLiveUrl(url) {
  try {
    const { stdout } = await execFileAsync('curl.exe', [
      '-s', '-L',
      '--compressed',
      '--max-time', '20',
      '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      '-H', 'Accept-Language: en-US,en;q=0.9',
      '-w', '\n---HTTP_STATUS:%{http_code}\n---FINAL_URL:%{url_effective}',
      url
    ], { maxBuffer: 10 * 1024 * 1024 });

    const statusMatch = stdout.match(/---HTTP_STATUS:(\d+)/);
    const urlMatch = stdout.match(/---FINAL_URL:(.+)/);
    const titleMatch = stdout.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

    const status = parseInt(statusMatch?.[1] || '0', 10);
    const finalUrl = urlMatch?.[1]?.trim() || url;
    const title = titleMatch?.[1]?.replace(/\s+/g, ' ').trim() || '';

    // Strip HTML tags from body snippet for matching
    const bodyIndex = stdout.indexOf('<body');
    const bodyContent = bodyIndex >= 0 ? stdout.substring(bodyIndex) : stdout;
    const bodyText = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                                .replace(/<[^>]+>/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();

    return {
      status,
      finalUrl,
      title,
      bodySnippet: bodyText.substring(0, 150000),
      rawHtml: stdout.substring(0, 150000)
    };
  } catch (err) {
    return {
      status: 0,
      finalUrl: url,
      title: '',
      bodySnippet: '',
      rawHtml: '',
      error: err.message
    };
  }
}

export async function runFinalSourceAudit(options = { updateDb: true }) {
  console.log('🏛️  VIRASAT — FINAL LIVE SOURCE VALIDATION AUDIT 🏛️');
  console.log('==================================================');

  const dbStorePath = path.join(rootDir, 'data', '.database', 'virasat_store.json');
  const indiaTourismJsonPath = path.join(rootDir, 'data', 'india_tourism_database.json');
  const tsDbPath = path.join(rootDir, 'src', 'data', 'indiaTourismDatabase.ts');

  if (!fs.existsSync(dbStorePath)) {
    throw new Error(`Database store not found at ${dbStorePath}`);
  }

  const dbStore = JSON.parse(fs.readFileSync(dbStorePath, 'utf8'));
  // The baseline candidate set of 62 places for the live audit (Tier 1 & Tier 2 verified candidate places)
  const candidatePlaces = Object.values(dbStore.places).filter(p =>
    p.source_quality === 'place_specific' || p.source_quality === 'official_site' || p.verification_status === 'verified'
  );

  console.log(`Found ${candidatePlaces.length} candidate verified places to audit live.\n`);

  const auditRecords = [];
  let http200Matched = 0;
  let http200Mismatch = 0;
  let httpFailed = 0;

  // Process in small batches of 3 to avoid overwhelming servers or triggering rate-limits
  for (let i = 0; i < candidatePlaces.length; i += 3) {
    const batch = candidatePlaces.slice(i, i + 3);
    const batchResults = await Promise.all(batch.map(async (place) => {
      const city = dbStore.cities[place.city_id];
      const state = dbStore.states[place.state_id] || (city ? dbStore.states[city.state_id] : null);
      const sourceUrl = place.source_url || (place.sources && place.sources[0]?.source_url) || '';

      const live = await fetchLiveUrl(sourceUrl);

      // Validate
      let validationResult = 'PASSED';
      let failureReason = '';
      let failureCategory = '';

      if (live.status !== 200) {
        validationResult = 'FAILED';
        failureCategory = 'http_error';
        failureReason = `HTTP ${live.status} (${getStatusText(live.status)})`;
      } else {
        // HTTP 200 received: validate content/title relevance
        const placeNameClean = cleanString(place.name);
        const titleClean = cleanString(live.title);
        const bodyClean = cleanString(live.bodySnippet);
        const combinedClean = `${titleClean} ${bodyClean}`;

        // Check if UNESCO URL
        const unescoMatch = sourceUrl.match(/\/en\/(?:list|tentativelists)\/(\d+)/i);
        if (unescoMatch) {
          const unescoId = unescoMatch[1];
          const aliases = UNESCO_RECOGNIZED_ALIASES[unescoId] || [];

          let unescoTitleMatched = false;
          for (const alias of aliases) {
            if (titleClean.includes(alias) || bodyClean.includes(alias)) {
              unescoTitleMatched = true;
              break;
            }
          }

          if (!unescoTitleMatched) {
            validationResult = 'FAILED';
            failureCategory = 'content_mismatch';
            failureReason = `UNESCO site title/content mismatch (Page Title: "${live.title || 'No Title'}")`;
          }
        } else if (place.source_quality === 'official_site') {
          // Official site: temple, museum, palace or trust
          // Homepage acceptable only if domain clearly belongs to institution/place
          const isRelevant = combinedClean.includes(cleanString(place.name.split('(')[0])) ||
                            combinedClean.includes(cleanString(place.city_id)) ||
                            (place.name.includes('City Palace') && (combinedClean.includes('mewar') || combinedClean.includes('city palace'))) ||
                            (place.name.includes('Partition') && combinedClean.includes('partition')) ||
                            (place.name.includes('Somnath') && combinedClean.includes('somnath'));

          if (!isRelevant) {
            validationResult = 'FAILED';
            failureCategory = 'content_mismatch';
            failureReason = `Official site does not mention place institution (Page Title: "${live.title}")`;
          }
        } else {
          // Place-specific deep link on State Tourism or District NIC
          // Check for core tokens of place name in title or body
          const cityNameClean = cleanString(city?.name || place.city_id || '');
          const baseNameWithoutCity = cityNameClean ? place.name.replace(new RegExp(cityNameClean, 'gi'), '') : place.name;
          const nameParts = [
            cleanString(place.name),
            cleanString(baseNameWithoutCity),
            ...place.name.split(/[\(\/&,-]/).map(s => cleanString(s))
          ].filter(s => s && s.length > 3);

          const matchedPart = nameParts.some(part => combinedClean.includes(part));

          if (!matchedPart) {
            validationResult = 'FAILED';
            failureCategory = 'content_mismatch';
            failureReason = `Content mismatch: place name not found in title/body (Page Title: "${live.title}")`;
          }
        }
      }

      if (validationResult === 'PASSED') {
        http200Matched++;
      } else if (failureCategory === 'content_mismatch') {
        http200Mismatch++;
      } else {
        httpFailed++;
      }

      const record = {
        place_id: place.id,
        place_name: place.name,
        city: city ? city.name : place.city_id,
        state: state ? state.name : place.state_id,
        source_url: sourceUrl,
        final_resolved_url: live.finalUrl,
        http_status: live.status,
        page_title: live.title,
        source_quality: place.source_quality || 'place_specific',
        validation_result: validationResult,
        audit_note: validationResult === 'PASSED'
          ? `Verified live HTTP 200 on ${new Date().toISOString().split('T')[0]}. Title: "${live.title}"`
          : `[Live Audit Failed ${new Date().toISOString().split('T')[0]}] ${failureReason}`
      };

      const icon = validationResult === 'PASSED' ? '✅' : '❌';
      console.log(`  ${icon} [${record.http_status}] ${record.place_name} — ${validationResult} ${validationResult === 'FAILED' ? `(${failureReason})` : ''}`);

      return record;
    }));

    auditRecords.push(...batchResults);
  }

  const downgradedCount = http200Mismatch + httpFailed;
  const finalVerifiedCount = http200Matched;

  console.log('\n==================================================');
  console.log('LIVE SOURCE AUDIT EXECUTION SUMMARY:');
  console.log(`- Verified before live audit: ${candidatePlaces.length}`);
  console.log(`- HTTP 200 and place-name/content matched: ${http200Matched}`);
  console.log(`- HTTP 200 but content/title mismatch: ${http200Mismatch}`);
  console.log(`- HTTP failed / dead / blocked: ${httpFailed}`);
  console.log(`- Downgraded to needs_review: ${downgradedCount}`);
  console.log(`- Final verified and live: ${finalVerifiedCount}`);
  console.log('==================================================\n');

  // Update Database if requested
  if (options.updateDb) {
    console.log('Applying audit updates to database...');
    const auditMap = new Map();
    for (const r of auditRecords) {
      auditMap.set(r.place_id, r);
    }

    // 1. Update virasat_store.json
    for (const [placeId, rec] of auditMap.entries()) {
      if (dbStore.places[placeId]) {
        const isPassed = rec.validation_result === 'PASSED';
        dbStore.places[placeId].verification_status = isPassed ? 'verified' : 'needs_review';
        dbStore.places[placeId].audit_note = rec.audit_note;
        if (dbStore.places[placeId].sources && dbStore.places[placeId].sources[0]) {
          dbStore.places[placeId].sources[0].verification_status = isPassed ? 'verified' : 'needs_review';
          dbStore.places[placeId].sources[0].evidence_note = rec.audit_note;
        }
      }
    }
    fs.writeFileSync(dbStorePath, JSON.stringify(dbStore, null, 2), 'utf8');
    console.log(`✅ Updated ${dbStorePath}`);

    // 2. Update india_tourism_database.json
    if (fs.existsSync(indiaTourismJsonPath)) {
      const itdb = JSON.parse(fs.readFileSync(indiaTourismJsonPath, 'utf8'));
      for (const s of itdb.states || []) {
        for (const c of s.cities || []) {
          for (const p of c.places || []) {
            if (auditMap.has(p.id)) {
              const rec = auditMap.get(p.id);
              p.verification_status = rec.validation_result === 'PASSED' ? 'verified' : 'needs_review';
              p.audit_note = rec.audit_note;
            }
          }
        }
      }
      fs.writeFileSync(indiaTourismJsonPath, JSON.stringify(itdb, null, 2), 'utf8');
      console.log(`✅ Updated ${indiaTourismJsonPath}`);

      // 3. Sync src/data/indiaTourismDatabase.ts
      const tsContent = `// Autogenerated verified database export\nexport const INDIA_TOURISM_DATABASE = ${JSON.stringify(itdb, null, 2)};\n`;
      fs.writeFileSync(tsDbPath, tsContent, 'utf8');
      console.log(`✅ Synced ${tsDbPath}`);
    }
  }

  // Ensure data/audits directory exists
  const auditsDir = path.join(rootDir, 'data', 'audits');
  if (!fs.existsSync(auditsDir)) {
    fs.mkdirSync(auditsDir, { recursive: true });
  }

  // Write JSON report
  const jsonReportPath = path.join(auditsDir, 'final_live_source_audit.json');
  const reportData = {
    audited_at: new Date().toISOString(),
    metrics: {
      verified_before: candidatePlaces.length,
      http_200_matched: http200Matched,
      http_200_mismatch: http200Mismatch,
      http_failed: httpFailed,
      downgraded_to_needs_review: downgradedCount,
      final_verified_and_live: finalVerifiedCount
    },
    results: auditRecords
  };
  fs.writeFileSync(jsonReportPath, JSON.stringify(reportData, null, 2), 'utf8');
  console.log(`✅ Created JSON audit report: ${jsonReportPath}`);

  // Write CSV report
  const csvReportPath = path.join(auditsDir, 'final_live_source_audit.csv');
  const csvHeader = 'place_id,place_name,city,state,source_url,final_resolved_url,http_status,page_title,source_quality,validation_result,audit_note\n';
  const csvRows = auditRecords.map(r => {
    const esc = (s) => `"${(s || '').toString().replace(/"/g, '""')}"`;
    return [
      esc(r.place_id),
      esc(r.place_name),
      esc(r.city),
      esc(r.state),
      esc(r.source_url),
      esc(r.final_resolved_url),
      r.http_status,
      esc(r.page_title),
      esc(r.source_quality),
      esc(r.validation_result),
      esc(r.audit_note)
    ].join(',');
  }).join('\n');

  fs.writeFileSync(csvReportPath, csvHeader + csvRows, 'utf8');
  console.log(`✅ Created CSV audit report: ${csvReportPath}`);

  return reportData;
}

// If executed directly from command line
if (process.argv[1] && process.argv[1].endsWith('final_live_source_audit.mjs')) {
  runFinalSourceAudit().then(() => {
    console.log('\n🎉 Audit script execution complete.');
  }).catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
}
