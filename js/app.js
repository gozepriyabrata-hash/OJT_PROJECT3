import { FontLoader } from './font-loader.js';
import { Metrics } from './metrics.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const fontLoader = new FontLoader();
    const metrics = new Metrics();
    const ui = new UI(fontLoader, metrics);

    ui.init();
    
    console.log('Wavefont Optimizer initialized');
});
