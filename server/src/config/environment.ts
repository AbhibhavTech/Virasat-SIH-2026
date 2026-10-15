import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const inheritedEnvironment = { ...process.env };

// npm dev/start must run from the repository root. Existing process settings win;
// server/.env retains precedence over root .env, matching the previous DB loader.
// Loading is independent of DATABASE_URL so AI settings are never skipped.
export const environmentFiles = ['server/.env', '.env'].map(file => {
  const resolved = path.resolve(process.cwd(), file);
  const exists = fs.existsSync(resolved);
  if (exists) dotenv.config({ path: resolved, override: false, quiet: true });
  return { path: resolved, exists };
});
const startupEnvironment = { ...process.env };

/** Refresh file-backed settings without mutating process-wide configuration.
 * Inherited process variables and explicit runtime overrides retain priority.
 */
export function readEnvironmentValues(names: string[], sources = environmentFiles): Record<string, string | undefined> {
  const files: Record<string, string> = {};
  for (const file of sources) {
    if (!fs.existsSync(file.path)) continue;
    const parsed = dotenv.parse(fs.readFileSync(file.path));
    for (const [name, value] of Object.entries(parsed)) if (!(name in files)) files[name] = value;
  }
  return Object.fromEntries(names.map(name => [name,
    process.env[name] !== startupEnvironment[name] ? process.env[name]
      : inheritedEnvironment[name] !== undefined ? inheritedEnvironment[name] : files[name],
  ]));
}
