export class UI {
    constructor(fontLoader, metrics) {
        this.fontLoader = fontLoader;
        this.metrics = metrics;
        this.elements = {};
    }

    init() {
        // Initialize elements here to ensure DOM is ready
        this.elements = {
            fontSelect: document.getElementById('font-select'),
            strategySelect: document.getElementById('strategy-select'),
            reloadBtn: document.getElementById('reload-btn'),
            exportBtn: document.getElementById('export-btn'),
            fontSize: document.getElementById('font-size'),
            fontWeight: document.getElementById('font-weight'),
            sizeVal: document.getElementById('size-val'),
            weightVal: document.getElementById('weight-val'),
            previewCanvas: document.getElementById('preview-canvas'),
            textSample: document.querySelector('.text-sample'),
            subsetLatin: document.getElementById('subset-latin'),
            subsetNumbers: document.getElementById('subset-numbers'),
            subsetSymbols: document.getElementById('subset-symbols'),
            subsetSize: document.getElementById('subset-size'),

            // Tab Elements
            navOptimizer: document.getElementById('nav-optimizer'),
            navPlayground: document.getElementById('nav-playground'),
            navAbout: document.getElementById('nav-about'),
            optimizerControls: document.getElementById('optimizer-controls'),
            playgroundControls: document.getElementById('playground-controls'),
            metricsPanel: document.getElementById('metrics-panel'),

            // Modal Elements
            aboutModal: document.getElementById('about-modal'),
            closeModalBtn: document.getElementById('close-modal'),

            // Overlay Elements
            toggleOverlayBtn: document.getElementById('toggle-overlay'),
            previewOverlay: document.getElementById('preview-overlay'),

            // Custom URL Elements
            customUrlGroup: document.getElementById('custom-url-group'),
            customFontUrl: document.getElementById('custom-font-url'),
            customFontName: document.getElementById('custom-font-name'),

            // Font Comparison Elements
            compareFont1: document.getElementById('compare-font-1'),
            compareFont2: document.getElementById('compare-font-2'),
            compareBtn: document.getElementById('compare-btn'),
            fontComparison: document.getElementById('font-comparison'),
            textSampleSingle: document.getElementById('text-sample-single'),
            compareCol1: document.getElementById('compare-col-1'),
            compareCol2: document.getElementById('compare-col-2'),
            compareLabel1: document.getElementById('compare-label-1'),
            compareLabel2: document.getElementById('compare-label-2')
        };

        // Debug check
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.error(`UI Element not found: ${key}`);
            }
        }

        if (this.elements.reloadBtn) {
            this.elements.reloadBtn.addEventListener('click', () => this.handleReload());
        }

        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', () => this.handleExport());
        }

        // Show/hide custom URL input based on font selection
        if (this.elements.fontSelect) {
            this.elements.fontSelect.addEventListener('change', () => {
                if (this.elements.fontSelect.value === 'Custom') {
                    this.elements.customUrlGroup.classList.remove('hidden');
                } else {
                    this.elements.customUrlGroup.classList.add('hidden');
                }
            });
        }

        // Tab Switching
        if (this.elements.navOptimizer) {
            this.elements.navOptimizer.addEventListener('click', (e) => {
                console.log('Optimizer tab clicked');
                e.preventDefault();
                this.switchTab('optimizer');
            });
        }

        if (this.elements.navPlayground) {
            this.elements.navPlayground.addEventListener('click', (e) => {
                console.log('Playground tab clicked');
                e.preventDefault();
                this.switchTab('playground');
            });
        }

        // About Modal
        if (this.elements.navAbout) {
            this.elements.navAbout.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleModal(true);
            });
        }

        if (this.elements.closeModalBtn) {
            this.elements.closeModalBtn.addEventListener('click', () => {
                this.toggleModal(false);
            });
        }

        // Close on outside click
        if (this.elements.aboutModal) {
            this.elements.aboutModal.addEventListener('click', (e) => {
                if (e.target === this.elements.aboutModal) {
                    this.toggleModal(false);
                }
            });
        }

        if (this.elements.fontSize) {
            this.elements.fontSize.addEventListener('input', (e) => {
                const val = e.target.value;
                if (this.elements.textSample) this.elements.textSample.style.fontSize = `${val}px`;
                if (this.elements.sizeVal) this.elements.sizeVal.textContent = `${val}px`;
            });
        }

        if (this.elements.fontWeight) {
            this.elements.fontWeight.addEventListener('input', (e) => {
                const val = e.target.value;
                if (this.elements.textSample) this.elements.textSample.style.fontWeight = val;
                if (this.elements.weightVal) this.elements.weightVal.textContent = val;
            });
        }

        // Store original text for subset simulation
        this.originalText = "The quick brown fox jumps over the lazy dog. 0123456789 !@#$%^&*() éàüñç";

        // Subset size calculation
        const updateSubsetSize = () => {
            let size = 0;
            if (this.elements.subsetLatin && this.elements.subsetLatin.checked) size += 25;
            if (this.elements.subsetNumbers && this.elements.subsetNumbers.checked) size += 5;
            if (this.elements.subsetSymbols && this.elements.subsetSymbols.checked) size += 3;
            if (this.elements.subsetExtended && this.elements.subsetExtended.checked) size += 15;
            if (this.elements.subsetSize) this.elements.subsetSize.textContent = `${size} KB`;
        };

        // Test Subset Button
        const testSubsetBtn = document.getElementById('test-subset-btn');
        const resetSubsetBtn = document.getElementById('reset-subset-btn');
        const subsetExtended = document.getElementById('subset-extended');
        this.elements.subsetExtended = subsetExtended;

        if (testSubsetBtn) {
            testSubsetBtn.addEventListener('click', () => {
                this.testSubset();
            });
        }

        if (resetSubsetBtn) {
            resetSubsetBtn.addEventListener('click', () => {
                this.resetSubsetText();
            });
        }

        if (this.elements.subsetLatin) this.elements.subsetLatin.addEventListener('change', updateSubsetSize);
        if (this.elements.subsetNumbers) this.elements.subsetNumbers.addEventListener('change', updateSubsetSize);
        if (this.elements.subsetSymbols) this.elements.subsetSymbols.addEventListener('change', updateSubsetSize);
        if (this.elements.subsetExtended) this.elements.subsetExtended.addEventListener('change', updateSubsetSize);

        // Overlay Toggle
        if (this.elements.toggleOverlayBtn) {
            this.elements.toggleOverlayBtn.addEventListener('click', () => {
                this.toggleOverlay();
            });
        }

        // Font Comparison
        if (this.elements.compareBtn) {
            this.elements.compareBtn.addEventListener('click', () => {
                this.compareFonts();
            });
        }

        this.metrics.start();
    }

    async compareFonts() {
        const font1 = this.elements.compareFont1 ? this.elements.compareFont1.value : 'Roboto';
        const font2 = this.elements.compareFont2 ? this.elements.compareFont2.value : 'Lato';

        // Load both fonts
        const fontUrls = {
            // Sans-Serif
            'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;600;700;800;900&display=swap',
            'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
            'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap',
            'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap',
            'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
            'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
            'Nunito': 'https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap',
            'Raleway': 'https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap',
            'Ubuntu': 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap',
            'Outfit': 'https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap',
            // Serif
            'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
            'Merriweather': 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap',
            'Lora': 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap',
            'PT Serif': 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap',
            'Source Serif Pro': 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@200;300;400;600;700;900&display=swap',
            // Display
            'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap',
            'Bebas Neue': 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
            'Anton': 'https://fonts.googleapis.com/css2?family=Anton&display=swap',
            'Abril Fatface': 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap',
            // Monospace
            'Fira Code': 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap',
            'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap',
            'Source Code Pro': 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&display=swap'
        };
        // Get font URLs with fallback
        const fontUrl1 = fontUrls[font1] || `https://fonts.googleapis.com/css2?family=${font1.replace(/ /g, '+')}&display=swap`;
        const fontUrl2 = fontUrls[font2] || `https://fonts.googleapis.com/css2?family=${font2.replace(/ /g, '+')}&display=swap`;

        console.log('Comparing fonts:', font1, font2);
        console.log('Font URLs:', fontUrl1, fontUrl2);

        // Remove existing font links
        const existingLinks = document.querySelectorAll('.compare-font-link');
        existingLinks.forEach(l => l.remove());

        // Add font 1
        const link1 = document.createElement('link');
        link1.classList.add('compare-font-link');
        link1.rel = 'stylesheet';
        link1.href = fontUrl1;
        document.head.appendChild(link1);

        // Add font 2
        const link2 = document.createElement('link');
        link2.classList.add('compare-font-link');
        link2.rel = 'stylesheet';
        link2.href = fontUrl2;
        document.head.appendChild(link2);

        // Wait for fonts to load
        await new Promise(resolve => {
            let loaded = 0;
            const checkLoaded = () => {
                loaded++;
                if (loaded >= 2) resolve();
            };
            link1.onload = checkLoaded;
            link2.onload = checkLoaded;
            link1.onerror = checkLoaded;
            link2.onerror = checkLoaded;
            setTimeout(resolve, 2000); // Fallback timeout
        });

        // Hide single view, show comparison
        if (this.elements.textSampleSingle) this.elements.textSampleSingle.classList.add('hidden');
        if (this.elements.fontComparison) this.elements.fontComparison.classList.remove('hidden');

        // Update labels
        if (this.elements.compareLabel1) this.elements.compareLabel1.textContent = font1;
        if (this.elements.compareLabel2) this.elements.compareLabel2.textContent = font2;

        // Apply fonts with important to override any existing styles
        if (this.elements.compareCol1) {
            this.elements.compareCol1.style.cssText = `font-family: "${font1}", sans-serif !important;`;
        }
        if (this.elements.compareCol2) {
            this.elements.compareCol2.style.cssText = `font-family: "${font2}", sans-serif !important;`;
        }

        console.log('Fonts applied successfully');
    }

    testSubset() {
        let text = this.originalText;

        // Replace excluded characters with tofu (□) to simulate missing glyphs
        if (this.elements.subsetLatin && !this.elements.subsetLatin.checked) {
            text = text.replace(/[a-zA-Z]/g, '□');
        }
        if (this.elements.subsetNumbers && !this.elements.subsetNumbers.checked) {
            text = text.replace(/[0-9]/g, '□');
        }
        if (this.elements.subsetSymbols && !this.elements.subsetSymbols.checked) {
            text = text.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '□');
        }
        if (this.elements.subsetExtended && !this.elements.subsetExtended.checked) {
            text = text.replace(/[éàüñçÉÀÜÑÇ]/g, '□');
        }

        // Update single view
        if (this.elements.textSampleSingle) {
            this.elements.textSampleSingle.innerHTML = `
                <h1>Subset Test Result</h1>
                <p style="font-size: 1.5em; letter-spacing: 0.05em;">${text}</p>
                <p style="margin-top: 1rem; font-size: 0.75em; color: #666;">
                    □ = Missing glyph (not in subset)
                </p>
            `;
        }

        // Update comparison view if visible
        const compareText1 = document.querySelector('#compare-col-1 .compare-text');
        const compareText2 = document.querySelector('#compare-col-2 .compare-text');

        if (compareText1) {
            compareText1.innerHTML = `<h1>Subset Test</h1><p>${text}</p>`;
        }
        if (compareText2) {
            compareText2.innerHTML = `<h1>Subset Test</h1><p>${text}</p>`;
        }
    }

    resetSubsetText() {
        // Reset to original sample text
        if (this.elements.textSampleSingle) {
            this.elements.textSampleSingle.innerHTML = `
                <h1>The quick brown fox jumps over the lazy dog</h1>
                <p>Pack my box with five dozen liquor jugs. Jackdaws love my big sphinx of quartz. The five
                    boxing wizards jump quickly. How vexingly quick daft zebras jump!</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua.</p>
            `;
        }

        // Reset comparison view
        const compareText1 = document.querySelector('#compare-col-1 .compare-text');
        const compareText2 = document.querySelector('#compare-col-2 .compare-text');

        if (compareText1) {
            compareText1.innerHTML = `<h1>The quick brown fox</h1><p>Pack my box with five dozen liquor jugs. Jackdaws love my big sphinx of quartz.</p>`;
        }
        if (compareText2) {
            compareText2.innerHTML = `<h1>The quick brown fox</h1><p>Pack my box with five dozen liquor jugs. Jackdaws love my big sphinx of quartz.</p>`;
        }

        // Reset all checkboxes to checked
        if (this.elements.subsetLatin) this.elements.subsetLatin.checked = true;
        if (this.elements.subsetNumbers) this.elements.subsetNumbers.checked = true;
        if (this.elements.subsetSymbols) this.elements.subsetSymbols.checked = true;
        if (this.elements.subsetExtended) this.elements.subsetExtended.checked = true;

        // Update size
        if (this.elements.subsetSize) this.elements.subsetSize.textContent = '48 KB';
    }

    toggleOverlay() {
        if (!this.elements.previewOverlay) return;

        const isVisible = this.elements.previewOverlay.classList.contains('visible');
        if (isVisible) {
            this.elements.previewOverlay.classList.remove('visible');
            if (this.elements.toggleOverlayBtn) this.elements.toggleOverlayBtn.textContent = 'Show Overlay';
        } else {
            this.elements.previewOverlay.classList.add('visible');
            if (this.elements.toggleOverlayBtn) this.elements.toggleOverlayBtn.textContent = 'Hide Overlay';
        }
    }

    toggleModal(show) {
        if (!this.elements.aboutModal) return;

        if (show) {
            this.elements.aboutModal.classList.remove('hidden');
        } else {
            this.elements.aboutModal.classList.add('hidden');
        }
    }

    switchTab(tabName) {
        console.log(`Switching to tab: ${tabName}`);

        if (!this.elements.navOptimizer || !this.elements.navPlayground ||
            !this.elements.optimizerControls || !this.elements.playgroundControls || !this.elements.metricsPanel) {
            console.error('Missing elements for tab switching');
            return;
        }

        if (tabName === 'optimizer') {
            this.elements.navOptimizer.classList.add('active');
            this.elements.navPlayground.classList.remove('active');

            this.elements.optimizerControls.classList.remove('hidden');
            this.elements.metricsPanel.classList.remove('hidden');
            this.elements.playgroundControls.classList.add('hidden');
        } else if (tabName === 'playground') {
            this.elements.navOptimizer.classList.remove('active');
            this.elements.navPlayground.classList.add('active');

            this.elements.optimizerControls.classList.add('hidden');
            this.elements.metricsPanel.classList.add('hidden');
            this.elements.playgroundControls.classList.remove('hidden');
        }
    }

    handleExport() {
        const fontName = this.elements.fontSelect ? this.elements.fontSelect.value : 'Custom';
        const strategy = this.elements.strategySelect ? this.elements.strategySelect.value : 'block';
        const weight = this.elements.fontWeight ? this.elements.fontWeight.value : '400';

        const css = `
/* Generated by Wavefont Optimizer */
@font-face {
  font-family: '${fontName}';
  src: url('path/to/${fontName.toLowerCase()}.woff2') format('woff2');
  font-display: ${strategy};
  font-weight: ${weight};
  font-style: normal;
}

body {
  font-family: '${fontName}', sans-serif;
}
`;
        // Create a blob and download
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized-fonts.css';
        a.click();
        URL.revokeObjectURL(url);
    }

    async handleReload() {
        if (!this.elements.fontSelect || !this.elements.strategySelect) return;

        const fontName = this.elements.fontSelect.value;
        const strategy = this.elements.strategySelect.value;

        // Reset metrics
        this.metrics.reset();

        // Simulate a reload by clearing and re-applying font
        if (this.elements.textSample) {
            this.elements.textSample.style.fontFamily = 'sans-serif';
            this.elements.textSample.style.visibility = 'visible';
        }

        // Small delay to allow layout to settle
        await new Promise(r => setTimeout(r, 100));

        // Map font names to their Google Fonts URLs
        const fontUrls = {
            // Sans-Serif
            'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
            'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap',
            'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
            'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
            'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap',
            'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
            'Nunito': 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap',
            'Raleway': 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap',
            'Ubuntu': 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap',
            'Outfit': 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap',
            // Serif
            'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
            'Merriweather': 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
            'Lora': 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap',
            'PT Serif': 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap',
            'Source Serif Pro': 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;700&display=swap',
            // Display
            'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap',
            'Bebas Neue': 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
            'Anton': 'https://fonts.googleapis.com/css2?family=Anton&display=swap',
            'Abril Fatface': 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap',
            // Monospace
            'Fira Code': 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap',
            'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
            'Source Code Pro': 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap'
        };

        // Determine font URL and name
        let fontUrl;
        let actualFontName = fontName;

        if (fontName === 'Custom') {
            fontUrl = this.elements.customFontUrl ? this.elements.customFontUrl.value.trim() : '';
            const customName = this.elements.customFontName ? this.elements.customFontName.value.trim() : '';

            if (!fontUrl) {
                alert('Please enter a Google Fonts URL');
                return;
            }

            // Try to extract font name from URL if not provided
            if (customName) {
                actualFontName = customName;
            } else {
                // Extract font name from Google Fonts URL
                const match = fontUrl.match(/family=([^:&]+)/);
                if (match) {
                    actualFontName = match[1].replace(/\+/g, ' ');
                } else {
                    actualFontName = 'CustomFont';
                }
            }

            console.log('Custom font URL:', fontUrl);
            console.log('Custom font name:', actualFontName);
        } else {
            fontUrl = fontUrls[fontName] || fontUrls['Roboto'];
        }

        // Load the actual font via link tag
        const existingLink = document.getElementById('dynamic-font-link');
        if (existingLink) existingLink.remove();

        const link = document.createElement('link');
        link.id = 'dynamic-font-link';
        link.rel = 'stylesheet';
        link.href = fontUrl;
        document.head.appendChild(link);

        // Wait for the font stylesheet to load before proceeding
        await new Promise(resolve => {
            link.onload = resolve;
            link.onerror = resolve;
            setTimeout(resolve, 1000); // Fallback timeout
        });

        // Simulate different loading strategies with visible delays
        // Random load time between 2 and 10 seconds
        const simulatedLoadTime = (Math.floor(Math.random() * 9) + 2) * 1000; // 2000-10000 ms

        switch (strategy) {
            case 'block':
                // FOIT: Hide text until font loads
                if (this.elements.textSample) this.elements.textSample.style.visibility = 'hidden';
                await new Promise(r => setTimeout(r, simulatedLoadTime));
                if (this.elements.textSample) {
                    this.elements.textSample.style.fontFamily = `"${actualFontName}", sans-serif`;
                    this.elements.textSample.style.visibility = 'visible';
                }
                this.metrics.updateMetricsFromLoader({ success: true, duration: simulatedLoadTime }, 'block');
                break;

            case 'swap':
                // FOUT: Show fallback immediately, swap when ready
                if (this.elements.textSample) this.elements.textSample.style.fontFamily = 'Georgia, serif';
                await new Promise(r => setTimeout(r, simulatedLoadTime));
                if (this.elements.textSample) this.elements.textSample.style.fontFamily = `"${actualFontName}", sans-serif`;
                this.metrics.updateMetricsFromLoader({ success: true, duration: simulatedLoadTime }, 'swap');
                break;

            case 'fallback':
                // 1. Block Period (~100ms): Hide text
                if (this.elements.textSample) this.elements.textSample.style.visibility = 'hidden';
                await new Promise(r => setTimeout(r, 100));

                // 2. Swap Period (~3s): Show fallback
                if (this.elements.textSample) {
                    this.elements.textSample.style.visibility = 'visible';
                    this.elements.textSample.style.fontFamily = 'Georgia, serif';
                }

                // Check if font loads within the swap period (3000ms)
                if (simulatedLoadTime < 3000) {
                    // Wait for the remaining load time
                    await new Promise(r => setTimeout(r, simulatedLoadTime - 100));

                    // Swap to target font
                    if (this.elements.textSample) {
                        this.elements.textSample.style.fontFamily = `"${actualFontName}", sans-serif`;
                    }
                    this.metrics.updateMetricsFromLoader({ success: true, duration: simulatedLoadTime }, 'fallback');
                } else {
                    // Font took too long (>3s), stick with fallback
                    // We don't swap even if it eventually loads (for this page view)
                    this.metrics.updateMetricsFromLoader({ success: true, duration: simulatedLoadTime, swapped: false }, 'fallback');
                }
                break;

            case 'optional':
                // Only use font if already cached (simulate: not cached, use fallback)
                if (this.elements.textSample) this.elements.textSample.style.fontFamily = 'Georgia, serif';
                // No swap happens - font is treated as optional
                this.metrics.updateMetricsFromLoader({ success: true, duration: 0 }, 'optional');
                break;

            default:
                if (this.elements.textSample) this.elements.textSample.style.fontFamily = `"${actualFontName}", sans-serif`;
        }

        this.updateTimeline({ duration: strategy === 'block' || strategy === 'swap' ? simulatedLoadTime : (strategy === 'fallback' ? 100 : 0) });
    }

    updateTimeline(result) {
        const timelineViz = document.getElementById('timeline-viz');
        if (!timelineViz) return;

        const duration = result.duration.toFixed(2);
        timelineViz.innerHTML = `
            <div style="padding: 1rem; width: 100%;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>Load Start: 0ms</span>
                    <span>Load End: ${duration}ms</span>
                </div>
                <div style="height: 20px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; overflow: hidden;">
                    <div style="
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: 100%;
                        width: 100%;
                        background: var(--primary-color);
                        animation: loadBar ${duration}ms linear;
                        transform-origin: left;
                    "></div>
                </div>
                <div style="text-align: center; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-secondary);">
                    Total Load Time: ${duration}ms
                </div>
            </div>
        `;
    }
}
