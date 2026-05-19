/**
 * Utility functions for handling bilingual text (English | Hindi)
 */

/**
 * Get the appropriate language text from a bilingual string
 * Format: "English text | Hindi text"
 * @param {string} text - The bilingual text string
 * @param {string} language - Current language ('en' or 'hi')
 * @returns {string} - The text in the requested language
 */
export const getBilingualText = (text, language = 'en') => {
    if (!text || typeof text !== 'string') return text || '';
    
    // Check if text contains the separator
    if (text.includes(' | ')) {
        const parts = text.split(' | ');
        // English is first (index 0), Hindi is second (index 1)
        return language === 'hi' && parts[1] ? parts[1].trim() : parts[0].trim();
    }
    
    return text;
};

/**
 * Hook-friendly version that can be used with i18n
 * @param {object} i18n - i18next instance
 * @returns {function} - Function to get bilingual text
 */
export const createBilingualGetter = (i18n) => {
    return (text) => getBilingualText(text, i18n.language);
};

export default getBilingualText;
