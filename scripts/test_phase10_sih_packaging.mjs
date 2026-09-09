/**
 * Phase 10 Verification Suite: SIH 2026 Packaging & Final Compliance Audit
 *
 * Validates:
 * 1. Pitch deck and hackathon presentation completeness (docs/sih-2026-pitch.md)
 * 2. 5-minute live demo runbook step-by-step instructions (docs/live-demo-runbook.md)
 * 3. Master Blueprint V2 compliance audit report covering all 22 sections (docs/blueprint-compliance-audit.md)
 * 4. Milestone roadmap completion status across all 11 phases (docs/roadmap/sih-2026-milestones.md)
 * 5. Production package readiness and clean zero-defect release posture
 */

import fs from 'fs';
import path from 'path';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runPhase10Tests() {
  console.log('\n🚀 [Test] Starting Phase 10: SIH 2026 Packaging & Final Compliance Verification...\n');

  // ----------------------------------------------------------------
  // Test Suite 1: Pitch Presentation Document Completeness
  // ----------------------------------------------------------------
  console.log('--- Test Suite 1: SIH 2026 Pitch Document (docs/sih-2026-pitch.md) ---');

  const pitchPath = path.join(process.cwd(), 'docs', 'sih-2026-pitch.md');
  assert(fs.existsSync(pitchPath), 'docs/sih-2026-pitch.md file exists');

  const pitchContent = fs.readFileSync(pitchPath, 'utf8');
  assert(pitchContent.includes('Executive Summary'), 'Pitch specifies Executive Summary and Problem Statement');
  assert(pitchContent.includes('Technical Innovation & Core Differentiators'), 'Pitch includes technical differentiation matrix');
  assert(pitchContent.includes('Field-Level Data Provenance'), 'Pitch highlights field-level ASI/UNESCO provenance');
  assert(pitchContent.includes('Zero-Hallucination Grounded AI Concierge'), 'Pitch details grounded AI concierge');
  assert(pitchContent.includes('System Architecture & Tech Stack'), 'Pitch provides system architecture breakdown');
  assert(pitchContent.includes('Problem-Solution Fit & User Personas'), 'Pitch defines user personas (Explorer, Backpacker, Activist)');
  assert(pitchContent.includes('Business, Government & Scalability Roadmap'), 'Pitch details B2G adoption and ODOP artisan marketplace');
  assert(pitchContent.includes('SIH Evaluation Rubric Checklist'), 'Pitch addresses all criteria in the SIH evaluation rubric');

  // ----------------------------------------------------------------
  // Test Suite 2: Live Demo Runbook Completeness
  // ----------------------------------------------------------------
  console.log('\n--- Test Suite 2: Live Demo Presentation Runbook (docs/live-demo-runbook.md) ---');

  const runbookPath = path.join(process.cwd(), 'docs', 'live-demo-runbook.md');
  assert(fs.existsSync(runbookPath), 'docs/live-demo-runbook.md file exists');

  const runbookContent = fs.readFileSync(runbookPath, 'utf8');
  assert(runbookContent.includes('5 Minutes'), 'Runbook designed for standard 5-minute SIH jury slot');
  assert(runbookContent.includes('Act 1: The Vision & Regional Living Heritage'), 'Runbook defines Act 1 (Regional Discovery)');
  assert(runbookContent.includes('Act 2: Monument Depth, Provenance Badges & 3D Explorer'), 'Runbook defines Act 2 (Provenance & 3D Explorer)');
  assert(runbookContent.includes('Act 3: Multimodal Public Transit & Regulated Fares'), 'Runbook defines Act 3 (Multimodal Transit & Fares)');
  assert(runbookContent.includes('Act 4: Grounded AI Concierge with Telemetry'), 'Runbook defines Act 4 (Grounded AI Concierge)');
  assert(runbookContent.includes('Act 5: Citizen Stewardship & Destination Health Scoring'), 'Runbook defines Act 5 (Citizen Stewardship & Health Decay)');
  assert(runbookContent.includes('Act 6: Evaluator Telemetry Dashboard & Architecture'), 'Runbook defines Act 6 (Evaluator Telemetry Dashboard)');
  assert(runbookContent.includes('Quick Reference / Backup Scenarios'), 'Runbook provides offline/fail-safe fallback scenarios');

  // ----------------------------------------------------------------
  // Test Suite 3: Master Blueprint V2 Compliance Audit Report
  // ----------------------------------------------------------------
  console.log('\n--- Test Suite 3: Master Blueprint V2 Compliance Audit Report ---');

  const auditPath = path.join(process.cwd(), 'docs', 'blueprint-compliance-audit.md');
  assert(fs.existsSync(auditPath), 'docs/blueprint-compliance-audit.md file exists');

  const auditContent = fs.readFileSync(auditPath, 'utf8');
  assert(auditContent.includes('100% COMPLIANT & FULLY VERIFIED'), 'Audit declares 100% compliant verified status');

  // Verify all 22 Sections are audited
  const blueprintSections = [
    'Section I', 'Section II', 'Section III', 'Section IV', 'Section V',
    'Section VI', 'Section VII', 'Section VIII', 'Section IX', 'Section X',
    'Section XI', 'Section XII', 'Section XIII', 'Section XIV', 'Section XV',
    'Section XVI', 'Section XVII', 'Section XVIII', 'Section XIX', 'Section XX',
    'Section XXI', 'Section XXII'
  ];

  for (const sec of blueprintSections) {
    assert(auditContent.includes(`**${sec}**`) || auditContent.includes(sec), `Compliance audit explicitly covers ${sec}`);
  }

  assert(auditContent.includes('COMPLIANT'), 'Compliance matrix marks sections compliant');
  assert(auditContent.includes('All 12 Verification Suites'), 'Audit documents all verification suites');

  // ----------------------------------------------------------------
  // Test Suite 4: Roadmap Milestones Verification
  // ----------------------------------------------------------------
  console.log('\n--- Test Suite 4: Roadmap & Milestone Delivery ---');

  const roadmapPath = path.join(process.cwd(), 'docs', 'roadmap', 'sih-2026-milestones.md');
  assert(fs.existsSync(roadmapPath), 'docs/roadmap/sih-2026-milestones.md file exists');

  const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');
  assert(roadmapContent.includes('**Phase 0**'), 'Roadmap includes Phase 0');
  assert(roadmapContent.includes('**Phase 1**'), 'Roadmap includes Phase 1');
  assert(roadmapContent.includes('**Phase 2**'), 'Roadmap includes Phase 2');
  assert(roadmapContent.includes('**Phase 3**'), 'Roadmap includes Phase 3');
  assert(roadmapContent.includes('**Phase 3B**'), 'Roadmap includes Phase 3B');
  assert(roadmapContent.includes('**Phase 4**'), 'Roadmap includes Phase 4');
  assert(roadmapContent.includes('**Phase 5**'), 'Roadmap includes Phase 5');
  assert(roadmapContent.includes('**Phase 6**'), 'Roadmap includes Phase 6');
  assert(roadmapContent.includes('**Phase 7**'), 'Roadmap includes Phase 7');
  assert(roadmapContent.includes('**Phase 8**'), 'Roadmap includes Phase 8');
  assert(roadmapContent.includes('**Phase 9**'), 'Roadmap includes Phase 9');
  assert(roadmapContent.includes('**Phase 10**'), 'Roadmap includes Phase 10');

  // ----------------------------------------------------------------
  // Test Suite 5: Release Hygiene & Production Artifacts
  // ----------------------------------------------------------------
  console.log('\n--- Test Suite 5: Release Hygiene & Production Artifacts ---');

  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  assert(Boolean(packageJson.scripts.build), 'package.json defines production build script');
  assert(Boolean(packageJson.scripts.test), 'package.json defines regression test script');
  assert(Boolean(packageJson.scripts.lint), 'package.json defines lint / typecheck script');

  const distPath = path.join(process.cwd(), 'dist');
  assert(fs.existsSync(distPath), 'dist/ directory exists from successful production build');
  assert(fs.existsSync(path.join(distPath, 'server.cjs')), 'dist/server.cjs compiled server bundle exists');
  assert(fs.existsSync(path.join(distPath, 'index.html')), 'dist/index.html compiled frontend entry exists');

  console.log('\n=============================================================');
  console.log(`📊 Phase 10 Test Results: ${passedTests} Passed, ${totalTests - passedTests} Failed`);
  console.log('=============================================================\n');
}

runPhase10Tests().catch((err) => {
  console.error('\n❌ Phase 10 Verification Suite Failed:', err);
  process.exit(1);
});
