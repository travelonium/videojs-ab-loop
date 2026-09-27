import assert from 'node:assert/strict';
import { readFile, appendFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
assert.ok(process.env.GITHUB_EVENT_PATH, 'Run this script with a GitHub release event.');
const { release } = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
assert.ok(release && !release.draft, 'A published release is required.');
assert.equal(release.tag_name, `v${pkg.version}`, 'Release tag must match package.json (vX.Y.Z).');
assert.equal(lock.version, pkg.version, 'Update package-lock.json for this release.');
assert.equal(lock.packages[''].version, pkg.version, 'Update the lockfile root version.');
assert.equal(release.prerelease, pkg.version.includes('-'),
    'Prerelease versions must be marked as GitHub prereleases; stable versions must not.');
const distTag = release.prerelease ? 'next' : 'latest';
await appendFile(process.env.GITHUB_OUTPUT, `dist_tag=${distTag}\n`);
console.log(`Validated ${pkg.name}@${pkg.version}; publishing to ${distTag}.`);
