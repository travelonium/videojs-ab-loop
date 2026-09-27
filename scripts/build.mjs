import { mkdir, copyFile, writeFile, readFile, rm } from 'node:fs/promises';
import { rollup } from 'rollup';
import { compile } from 'sass';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
const bundle = await rollup({ input: 'src/index.js', external: ['video.js'] });
const banner = `/*! ${pkg.name} v${pkg.version} | MIT License | Copyright Travelonium */`;
try {
    for (const [file, format] of [
        ['videojs-ab-loop.es.js', 'es'],
        ['videojs-ab-loop.cjs', 'cjs'],
        ['videojs-ab-loop.js', 'umd'],
    ]) {
        await bundle.write({ file: `dist/${file}`, format, name: 'videojsABLoop',
            globals: { 'video.js': 'videojs' }, exports: 'named', banner, sourcemap: true });
    }
} finally {
    await bundle.close();
}
const css = compile('src/styles.scss', { style: 'compressed' }).css;
await writeFile('dist/videojs-ab-loop.css', `${banner}\n${css}\n`);
for (const icon of ['ab-loop.svg', 'loop.svg']) await copyFile(`src/${icon}`, `dist/${icon}`);
console.error(`Built ${pkg.name}@${pkg.version}`);
