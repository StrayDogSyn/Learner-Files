// Marvel API Configuration - Now loaded from config.js
// Check if config is loaded and has valid keys
const MARVEL_API = (() => {
    if (typeof CONFIG === 'undefined' || !CONFIG.MARVEL_API) {
        console.warn('Marvel API configuration not found. Using fallback data.');
        return {
            PUBLIC_KEY: 'NOT_CONFIGURED',
            PRIVATE_KEY: 'NOT_CONFIGURED',
            BASE_URL: 'https://gateway.marvel.com/v1/public'
        };
    }
    
    const config = CONFIG.MARVEL_API;
    if (config.PUBLIC_KEY === 'YOUR_MARVEL_PUBLIC_KEY_HERE' || 
        config.PRIVATE_KEY === 'YOUR_MARVEL_PRIVATE_KEY_HERE') {
        console.warn('Marvel API keys not configured properly. Using fallback data.');
        return {
            PUBLIC_KEY: 'NOT_CONFIGURED',
            PRIVATE_KEY: 'NOT_CONFIGURED',
            BASE_URL: config.BASE_URL
        };
    }
    
    return config;
})();

// Fallback Marvel characters data for when API is not available
const FALLBACK_CHARACTERS = [
    {
        name: "Spider-Man",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b", extension: "jpg" },
        description: "Your friendly neighborhood Spider-Man"
    },
    {
        name: "Iron Man",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55", extension: "jpg" },
        description: "Genius, billionaire, playboy, philanthropist"
    },
    {
        name: "Captain America",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087", extension: "jpg" },
        description: "The First Avenger"
    },
    {
        name: "Thor",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350", extension: "jpg" },
        description: "God of Thunder"
    },
    {
        name: "Hulk",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0", extension: "jpg" },
        description: "The Incredible Hulk"
    },
    {
        name: "Black Widow",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b", extension: "jpg" },
        description: "Master spy and assassin"
    },
    {
        name: "Hawkeye",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/e/90/50fecaf4f101b", extension: "jpg" },
        description: "Expert marksman"
    },
    {
        name: "Doctor Strange",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe", extension: "jpg" },
        description: "Master of the Mystic Arts"
    },
    {
        name: "Wolverine",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf", extension: "jpg" },
        description: "The best there is at what he does"
    },
    {
        name: "Deadpool",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/90/5261a86cacb99", extension: "jpg" },
        description: "The Merc with a Mouth"
    },
    {
        name: "Captain Marvel",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/80/5269608c1be7a", extension: "jpg" },
        description: "Cosmic-powered hero"
    },
    {
        name: "Scarlet Witch",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/70/5261a7d7498bb", extension: "jpg" },
        description: "Master of chaos magic"
    },
    {
        name: "Vision",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/d0/5261a86657977", extension: "jpg" },
        description: "Synthetic android with Mind Stone"
    },
    {
        name: "Ant-Man",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/e/20/52696868356d0", extension: "jpg" },
        description: "Size-changing hero"
    },
    {
        name: "Wasp",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/5261a85a501fe", extension: "jpg" },
        description: "Flying, shrinking hero"
    },
    {
        name: "Falcon",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/0/40/5261a7e53f827", extension: "jpg" },
        description: "Winged Avenger"
    },
    {
        name: "Winter Soldier",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/d/03/58dd080719806", extension: "jpg" },
        description: "Reformed assassin"
    },
    {
        name: "Black Panther",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/60/5261a80a67e7b", extension: "jpg" },
        description: "King of Wakanda"
    },
    {
        name: "Daredevil",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/d/50/50febb79985ee", extension: "jpg" },
        description: "The Man Without Fear"
    },
    {
        name: "Punisher",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/90/50fec1e49298a", extension: "jpg" },
        description: "Vigilante with a war against crime"
    },
    {
        name: "Ghost Rider",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/80/52696738a2d72", extension: "jpg" },
        description: "Spirit of Vengeance"
    },
    {
        name: "Silver Surfer",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/527bb6490a176", extension: "jpg" },
        description: "Herald of Galactus"
    },
    {
        name: "Fantastic Four",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/60/58dbce634ea70", extension: "jpg" },
        description: "Marvel's First Family"
    },
    {
        name: "Professor X",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/e0/528d3378de525", extension: "jpg" },
        description: "Leader of the X-Men"
    },
    {
        name: "Magneto",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/b0/5261a7e53f827", extension: "jpg" },
        description: "Master of Magnetism"
    },
    {
        name: "Storm",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d", extension: "jpg" },
        description: "Weather-controlling mutant"
    },
    {
        name: "Cyclops",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/70/526547e2d90bc", extension: "jpg" },
        description: "Optic blast-powered X-Men leader"
    },
    {
        name: "Jean Grey",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/1/03/528d33d000749", extension: "jpg" },
        description: "Telepathic and telekinetic mutant"
    },
    {
        name: "Nightcrawler",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/03/526548448d015", extension: "jpg" },
        description: "Teleporting blue mutant"
    },
    {
        name: "Rogue",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/10/5112d84e2166c", extension: "jpg" },
        description: "Power-absorbing mutant"
    }
];

class MarvelService {
    constructor() {
        this.characters = [];
        this.questions = [];
    }

    generateHash(timestamp) {
        const hash = CryptoJS.MD5(timestamp + MARVEL_API.PRIVATE_KEY + MARVEL_API.PUBLIC_KEY).toString();
        return hash;
    }    async fetchCharacters() {
        try {
            // Check if API keys are properly configured
            if (MARVEL_API.PUBLIC_KEY === 'NOT_CONFIGURED') {
                console.log('API keys not configured, using fallback data');
                this.characters = FALLBACK_CHARACTERS;
                return this.characters;
            }
            
            const timestamp = new Date().getTime();
            const hash = this.generateHash(timestamp);
            
            // Fetch characters with images (excluding those without proper thumbnails)
            const response = await fetch(
                `${MARVEL_API.BASE_URL}/characters?ts=${timestamp}&apikey=${MARVEL_API.PUBLIC_KEY}&hash=${hash}&limit=100&offset=${Math.floor(Math.random() * 500)}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.data || !data.data.results) {
                throw new Error('Invalid API response structure');
            }
            
            // Filter characters that have proper images (not the placeholder image)
            this.characters = data.data.results.filter(character => 
                character.thumbnail && 
                character.thumbnail.path && 
                !character.thumbnail.path.includes('image_not_available') &&
                character.name.length > 0
            ).slice(0, 100); // Increased to 100 characters for larger question pools
            
            console.log(`Successfully loaded ${this.characters.length} characters from Marvel API`);
              // If we don't get enough characters from API, supplement with fallback
            if (this.characters.length < 25) {
                console.log('Using fallback characters due to insufficient API results');
                this.characters = [...this.characters, ...FALLBACK_CHARACTERS].slice(0, 25);
            }
            
            return this.characters;
        } catch (error) {
            console.error('Error fetching Marvel characters:', error);
            console.log('Falling back to local character data');
            // Fallback to local data if API fails
            this.characters = FALLBACK_CHARACTERS;
            return this.characters;
        }
    }    generateQuestions(numQuestions = 10) {
        // Ensure we don't request more questions than we have characters
        const maxQuestions = Math.min(numQuestions, this.characters.length);
        
        // Shuffle characters to randomize question order
        const shuffledCharacters = this.shuffleArray([...this.characters]);
        
        this.questions = shuffledCharacters.slice(0, maxQuestions).map(character => ({
            name: character.name,
            image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
            description: character.description || 'No description available',
            options: this.generateOptions(character.name)
        }));
        
        console.log(`Generated ${this.questions.length} questions for the quiz`);
        return this.questions;
    }

    generateOptions(correctName) {
        const options = [correctName];
        while (options.length < 4) {
            const randomChar = this.characters[Math.floor(Math.random() * this.characters.length)];
            if (!options.includes(randomChar.name)) {
                options.push(randomChar.name);
            }
        }
        return this.shuffleArray(options);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}