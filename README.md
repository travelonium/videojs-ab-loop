# Video.js A–B Loop

Select two points on the **existing Video.js progress bar** and repeat the range between them. Includes a separate full-video repeat button, touch input, keyboard selection, and a small JavaScript API.

Built for **Video.js 8.21+ (8.x)**. No React dependency. MIT licensed.

## Features

- A and B markers and a highlighted range on the main timeline.
- Click or tap to select endpoints in either order.
- Keyboard selection using the standard seek bar.
- Full-video repeat with a matching, vertically centered icon.
- Thumbnail hover events remain available during range selection.
- Independent state for multiple players; listeners and timers are cleaned up on disposal.
- Source changes clear the A–B range. Full-video repeat persists until disabled.

## Install

Once published to npm:

```sh
npm install video.js @travelonium/videojs-ab-loop
```

Before npm publication, build and install a tarball from this repository:

```sh
npm ci
npm run check
npm pack
# In your application:
npm install /path/to/travelonium-videojs-ab-loop-1.0.0.tgz
```

### With a bundler

```js
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@travelonium/videojs-ab-loop';
import '@travelonium/videojs-ab-loop/dist/videojs-ab-loop.css';

const player = videojs('my-video', { controls: true });
const loop = player.abLoop();
```

```html
<video id="my-video" class="video-js" controls preload="auto" playsinline>
  <source src="movie.mp4" type="video/mp4">
</video>
```

You can also initialize through Video.js options:

```js
const player = videojs('my-video', {
  controls: true,
  plugins: { abLoop: {} }
});
const loop = player.abLoop();
```

### With script tags

Run `npm run build`, then copy **all files in `dist/`** to your site's `vendor/ab-loop/` directory. The CSS uses the two adjacent SVG files. Video.js must load first.

```html
<link rel="stylesheet" href="https://vjs.zencdn.net/8.21.0/video-js.css">
<link rel="stylesheet" href="vendor/ab-loop/videojs-ab-loop.css">
<script src="https://vjs.zencdn.net/8.21.0/video.min.js"></script>
<script src="vendor/ab-loop/videojs-ab-loop.js"></script>

<video id="my-video" class="video-js" controls playsinline>
  <source src="movie.mp4" type="video/mp4">
</video>
<script>
  const player = videojs('my-video');
  player.abLoop();
</script>
```

## Controls

1. Press **A–B** in the control bar.
2. Click or tap the progress bar to mark A, then B. Reverse selections are sorted automatically. The two points must be at least 0.1 seconds apart.
3. Playback repeats the highlighted range. If the video was paused, press Play to begin.
4. Press **A–B** again to clear the loop or cancel an incomplete selection.

The adjacent repeat icon toggles full-video looping. Yellow indicates an enabled control. Enabling full-video repeat clears the A–B range; starting A–B selection disables full-video repeat.

To change a range, clear it and select two new points. Markers are not draggable.

### Keyboard

Activate the A–B button with the keyboard; focus moves to the progress bar. Use the seek bar's arrow keys to seek and press **Enter** or **Space** to mark each endpoint. Press **Escape** while focused on the progress bar to clear or cancel. Button labels and selection instructions are exposed to assistive technology.

## API

`player.abLoop()` returns the same plugin instance on repeated calls. Initialize after constructing the player; DOM setup waits for player readiness. Range-setting requires a ready player and loaded metadata with a finite duration.

```js
const loop = player.abLoop();

player.on('loadedmetadata', () => {
  loop.setRange(10, 15); // Activates the loop and seeks to A; preserves pause state.
  console.log(loop.getRange()); // { start: 10, end: 15 }
});

// Later, in response to user input:
loop.clear();
```

| Method | Behavior |
| --- | --- |
| `setRange(start, end)` | Sets an active range in seconds and returns the plugin. Requires `0 <= start < end <= duration` and at least 0.1 seconds between points. Invalid ranges throw `RangeError`; missing readiness/duration throws `Error`. |
| `getRange()` | Returns a new `{ start, end }` object for the active range, otherwise `null`. |
| `toggle()` | Starts A–B selection, or clears/cancels the current range. Does nothing when the seek bar or finite duration is unavailable. |
| `clear()` | Clears A–B markers and returns to normal seeking. Does not change full-video repeat. |
| `toggleVideoLoop()` | Toggles Video.js full-video looping, clearing A–B selection when enabled. Does nothing without a finite duration. |
| `dispose()` | Removes this plugin's controls, listeners and timer. Player disposal calls it automatically. Full-video repeat remains a player setting. |

The plugin also exports its `ABLoop` class as both a named and default export. CommonJS consumers can use `require('@travelonium/videojs-ab-loop')`. Loading the module registers the plugin automatically; avoid loading a second plugin under the same `abLoop` name.

## Playback and compatibility

- Requires the standard Video.js control bar, progress control and seek bar. Controls are disabled for unknown, zero or infinite duration. Native fullscreen controls do not display custom plugin buttons.
- Tested with Video.js 8.21.0 and simulated media playback. Actual playback timing varies by browser, codec and source. Video.js 9 is outside the supported peer range.
- The plugin seeks to A using `currentTime()` at B, checking playback every 30 ms and on media events. **Looping is not gapless or sample-accurate.** Buffered data may be reused, but the plugin does not pin a range in memory or prevent streaming buffer eviction. Seeking can show a spinner or require more data.
- Seeking outside an active range returns to A. Clear the range to seek freely. Playback rate and pause state are preserved when selecting a range.
- Hover thumbnail plugins can receive normal mouse movement; this plugin does not hide their previews. Styles or event interception in other plugins can still affect compatibility.

## Demo and development

Requires Node.js 22.13+, 24, or 26+ and npm.

```sh
npm ci
npm run dev       # Opens /examples/ with the Video.js sample video
npm run check     # Lint, component tests, build, distribution smoke checks
npm pack --dry-run
```

The demo loads sample media from `vjs.zencdn.net` and needs internet access. You can replace its source in `examples/index.html` with your own video.

Source lives in `src/`; `npm run build` produces ES module, CommonJS, browser UMD, CSS, SVG assets and JavaScript source maps in `dist/`. Video.js is a peer dependency and is not bundled. `dist/` is generated and excluded from Git, but included in npm tarballs.

See [RELEASING.md](RELEASING.md) for the release checklist and [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance.

## Background and license

Developed by Travelonium for Arcadeia and extracted as a standalone plugin. The [@youon/videojs-abloop package](https://www.npmjs.com/package/@youon/videojs-abloop) inspired the organization of the usage and API documentation; this package has its own implementation and API.

[MIT](LICENSE) © 2026 Travelonium.
