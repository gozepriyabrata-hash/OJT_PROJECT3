export class Metrics {
    constructor() {
        this.observers = [];
        this.metrics = {
            cls: 0,
            fout: 0,
            foit: 0
        };
    }

    start() {
        this.observeLayoutShift();
    }

    observeLayoutShift() {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // For this tool, we want to measure shifts even if triggered by the "Reload" button
                    console.log('Layout Shift:', entry.value, 'Had Input:', entry.hadRecentInput);
                    this.metrics.cls += entry.value;
                    this.updateUI('cls', this.metrics.cls);
                }
            });
            observer.observe({ type: 'layout-shift', buffered: true });
            this.observers.push(observer);
        } catch (e) {
            console.warn('Layout Shift API not supported');
        }
    }

    updateMetricsFromLoader(loaderResult, strategy = 'block') {
        // Approximate FOIT/FOUT based on strategy and duration
        // In a real scenario, we'd use Paint Timing API to be more precise

        if (loaderResult.success) {
            // Clamp values between 1 and 10 seconds
            const clampedDuration = Math.min(10, Math.max(1, Math.round(loaderResult.duration / 1000)));

            // Calculate simulated CLS based on strategy
            // Block: No CLS (text hidden during load)
            // Swap: High CLS (fallback swaps to custom font)
            // Fallback: Medium CLS (may or may not swap)
            // Optional: Low CLS (no swap if not cached)
            let clsValue = 0;
            let foitValue = '0 s';
            let foutValue = '0 s';

            switch (strategy) {
                case 'block':
                    clsValue = 0;
                    foitValue = `${clampedDuration} s`;
                    foutValue = '0 s';
                    break;
                case 'swap':
                    clsValue = Math.floor(Math.random() * 5) + 3; // 3-7 CLS
                    foitValue = '0 s';
                    foutValue = `${clampedDuration} s`;
                    break;
                case 'fallback':
                    clsValue = Math.floor(Math.random() * 3) + 1; // 1-3 CLS
                    foitValue = '0 s';
                    foutValue = '1 s';
                    break;
                case 'optional':
                    clsValue = 0;
                    foitValue = '0 s';
                    foutValue = '0 s';
                    break;
            }

            this.metrics.cls = clsValue;
            this.updateUI('cls', clsValue);
            this.updateUI('foit', foitValue);
            this.updateUI('fout', foutValue);
        }
    }

    updateUI(metric, value) {
        const element = document.getElementById(`${metric}-metric`);
        if (element) {
            element.textContent = typeof value === 'number' ? Math.round(value) : value;
        }
    }

    reset() {
        this.metrics = { cls: 0, fout: 0, foit: 0 };
        this.updateUI('cls', 0);
        this.updateUI('fout', '-- s');
        this.updateUI('foit', '-- s');

        // Disconnect old observers to reset state if needed, but usually we keep observing
        // For CLS, we might want to reset the running total.
    }
}
