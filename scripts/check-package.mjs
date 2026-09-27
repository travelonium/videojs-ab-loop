import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
for (const entry of [pkg.main, pkg.module, pkg.browser, pkg.style]) await access(entry);
const require = createRequire(import.meta.url);
const cjs = require('../dist/videojs-ab-loop.cjs');
assert.equal(cjs.ABLoop.VERSION, pkg.version);
require('video.js').deregisterPlugin('abLoop');
const esm = await import('../dist/videojs-ab-loop.es.js');
assert.equal(esm.default.VERSION, pkg.version);
const css = await readFile(pkg.style, 'utf8');
for (const [, asset] of css.matchAll(/url\(["']?(\.\/[^)"']+)["']?\)/g)) {
    await access(`dist/${asset}`);
}
// Verify that a plain script registers against the browser's Video.js instance.
const dom = new JSDOM('<!doctype html>', { runScripts: 'outside-only', url: 'http://localhost/' });
try {
    dom.window.eval(await readFile(require.resolve('video.js/dist/video.js'), 'utf8'));
    dom.window.eval(await readFile(pkg.browser, 'utf8'));
    assert.equal(dom.window.videojs.getPlugin('abLoop').VERSION, pkg.version);
} finally {
    dom.window.close();
}
console.log('ES module, CommonJS, browser registration, version and CSS assets verified.');
