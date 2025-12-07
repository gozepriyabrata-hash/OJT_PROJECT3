export class FontLoader {
    constructor() {
        this.currentFont = null;
    }

    async loadFont(fontName, url, strategy = 'block') {
        console.log(`Loading ${fontName} with strategy: ${strategy}`);

        const startTime = performance.now();

        // Cleanup previous font if needed
        if (this.currentFont) {
            document.fonts.delete(this.currentFont);
        }

        const fontFace = new FontFace(fontName, `url(${url})`, {
            display: strategy === 'async' ? 'swap' : strategy
        });

        this.currentFont = fontFace;
        document.fonts.add(fontFace);

        try {
            await fontFace.load();
            const endTime = performance.now();
            console.log('Font loaded successfully');
            return {
                success: true,
                duration: endTime - startTime,
                startTime,
                endTime
            };
        } catch (err) {
            console.error('Font loading failed:', err);
            return {
                success: false,
                error: err
            };
        }
    }
}
