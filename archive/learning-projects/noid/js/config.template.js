// Configuration template - Copy to config.js and add your actual keys
// DO NOT commit config.js to version control

const CONFIG = {
    MARVEL_API: {
        PUBLIC_KEY: 'YOUR_MARVEL_PUBLIC_KEY_HERE',
        PRIVATE_KEY: 'YOUR_MARVEL_PRIVATE_KEY_HERE',
        BASE_URL: 'https://gateway.marvel.com/v1/public'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
