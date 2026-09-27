# Contributing

Use Node.js 22.13+, 24, or 26+ and run `npm ci`, then `npm run check` before opening a pull request.
Keep changes focused and include behavioral tests for selection, seeking or lifecycle changes.

`npm run dev` opens the example player. For playback changes, manually check desktop
mouse and keyboard input, mobile touch, paused selection, full-video repeat, thumbnail
hover integration, source changes, and disposal. Unit tests simulate the media engine;
they do not prove gapless playback or device compatibility.

Do not commit `node_modules/`, generated `dist/` files or package tarballs. If public APIs
or playback behavior change, update the README and changelog.

Report issues with the browser/version, Video.js version, source type (MP4/HLS/etc.),
loop timestamps, and a minimal reproduction using non-private media where possible.
