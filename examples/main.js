import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../src/index.js';
import '../src/styles.scss';

const player = videojs('demo', { fluid: true });
const loop = player.abLoop();
const status = document.querySelector('#state');
player.on('loadedmetadata', () => {
    document.querySelector('#range').disabled = false;
    document.querySelector('#repeat').disabled = false;
    status.textContent = 'Ready. Select a range using A–B or the example button.';
});
document.querySelector('#range').addEventListener('click', () => {
    loop.setRange(5, 10);
    status.textContent = 'Range set to 5–10 seconds. Press Play to start.';
});
document.querySelector('#clear').addEventListener('click', () => {
    loop.clear();
    status.textContent = 'A–B range cleared.';
});
document.querySelector('#repeat').addEventListener('click', () => {
    loop.toggleVideoLoop();
    status.textContent = `Full-video repeat ${player.loop() ? 'enabled' : 'disabled'}.`;
});
