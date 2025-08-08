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

// Fallback Marvel characters data with multiple reliable image sources
const FALLBACK_CHARACTERS = [
    {
        name: "Spider-Man",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b", extension: "jpg" },
        description: "Your friendly neighborhood Spider-Man",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/011smp_ons_crd_03.jpg",
            "https://cdn.marvel.com/content/1x/011smp_ons_crd_03.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/9/30/538cd33e15ab7.jpg"
        ]
    },
    {
        name: "Iron Man",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55", extension: "jpg" },
        description: "Genius, billionaire, playboy, philanthropist",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/006irm_ons_crd_03.jpg",
            "https://cdn.marvel.com/content/1x/006irm_ons_crd_03.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/6/a0/55b6a25e654e6.jpg"
        ]
    },
    {
        name: "Captain America",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087", extension: "jpg" },
        description: "The First Avenger",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/004cap_ons_crd_03.jpg",
            "https://cdn.marvel.com/content/1x/004cap_ons_crd_03.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/6/70/50fecaf4f101b.jpg"
        ]
    },
    {
        name: "Thor",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350", extension: "jpg" },
        description: "God of Thunder",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/004tho_ons_crd_03.jpg",
            "https://cdn.marvel.com/content/1x/004tho_ons_crd_03.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02.jpg"
        ]
    },
    {
        name: "Hulk",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0", extension: "jpg" },
        description: "The Incredible Hulk",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/006hul_ons_crd_03.jpg",
            "https://cdn.marvel.com/content/1x/006hul_ons_crd_03.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/e/e0/537bafa34baa9.jpg"
        ]
    },
    {
        name: "Black Widow",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b", extension: "jpg" },
        description: "Master spy and assassin",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/011blw_ons_crd_03.jpg",
            "https://cdn.marvel.com/content/1x/011blw_ons_crd_03.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/6/40/5239a05989760.jpg"
        ]
    },
    {
        name: "Hawkeye",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/e/90/50fecaf4f101b", extension: "jpg" },
        description: "Expert marksman",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/hawkeyeallnew2015004_cov.jpg",
            "https://cdn.marvel.com/content/1x/hawkeyeallnew2015004_cov.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/7/03/5233007a83e76.jpg"
        ]
    },
    {
        name: "Doctor Strange",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe", extension: "jpg" },
        description: "Master of the Mystic Arts",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/009drs_ons_crd_03.jpg",
            "https://cdn.marvel.com/content/1x/009drs_ons_crd_03.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/3/40/5230207a2a040.jpg"
        ]
    },    {
        name: "Wolverine",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf", extension: "jpg" },
        description: "The best there is at what he does",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/wolverine_lob_crd_03.jpg",
            "https://cdn.marvel.com/content/1x/wolverine_lob_crd_03.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/9/00/537bcb1133fd7.jpg"
        ]
    },
    {
        name: "Deadpool",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/90/5261a86cacb99", extension: "jpg" },
        description: "The Merc with a Mouth",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/deadpool40_cov.jpg",
            "https://cdn.marvel.com/content/1x/deadpool40_cov.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/5/c0/537bb6420a9c1.jpg"
        ]
    },
    {
        name: "Captain Marvel",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/80/5269608c1be7a", extension: "jpg" },
        description: "Cosmic-powered hero",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/captainmarvel_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/captainmarvel_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/0/80/5269608c1be7a.jpg"
        ]
    },
    {
        name: "Scarlet Witch",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/70/5261a7d7498bb", extension: "jpg" },
        description: "Master of chaos magic",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/scarletwitch_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/scarletwitch_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/9/70/50fec10633ec2.jpg"
        ]
    },
    {
        name: "Vision",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/d0/5261a86657977", extension: "jpg" },
        description: "Synthetic android with Mind Stone",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/vision_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/vision_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/a/a0/538cd3628adde.jpg"
        ]
    },
    {
        name: "Ant-Man",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/e/20/52696868356d0", extension: "jpg" },
        description: "Size-changing hero",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/antman_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/antman_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/7/c0/53176aa9df48f.jpg"
        ]
    },
    {
        name: "Wasp",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/5261a85a501fe", extension: "jpg" },
        description: "Flying, shrinking hero",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/wasp_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/wasp_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/5/c0/5390dfd5ef165.jpg"
        ]
    },
    {
        name: "Falcon",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/0/40/5261a7e53f827", extension: "jpg" },
        description: "Winged Avenger",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/falcon_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/falcon_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/6/60/5261a80a67e7b.jpg"
        ]
    },
    {
        name: "Winter Soldier",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/d/03/58dd080719806", extension: "jpg" },
        description: "Reformed assassin",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/wintersoldier_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/wintersoldier_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/3/a0/5390c6aa5079f.jpg"
        ]
    },
    {
        name: "Black Panther",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/60/5261a80a67e7b", extension: "jpg" },
        description: "King of Wakanda",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/blackpanther_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/blackpanther_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/1/c0/537ba2bfd6bab.jpg"
        ]
    },    {
        name: "Daredevil",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/d/50/50febb79985ee", extension: "jpg" },
        description: "The Man Without Fear",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/daredevil_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/daredevil_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/c/40/50febb79985ee.jpg"
        ]
    },
    {
        name: "Punisher",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/90/50fec1e49298a", extension: "jpg" },
        description: "Vigilante with a war against crime",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/punisher_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/punisher_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/9/80/537bb8dc4d5fe.jpg"
        ]
    },
    {
        name: "Ghost Rider",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/80/52696738a2d72", extension: "jpg" },
        description: "Spirit of Vengeance",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/ghostrider_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/ghostrider_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/3/50/528d33bb5b842.jpg"
        ]
    },
    {
        name: "Silver Surfer",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/527bb6490a176", extension: "jpg" },
        description: "Herald of Galactus",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/silversurfer_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/silversurfer_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/3/80/52696738a2d72.jpg"
        ]
    },
    {
        name: "Fantastic Four",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/60/58dbce634ea70", extension: "jpg" },
        description: "Marvel's First Family",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/fantasticfour_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/fantasticfour_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/6/60/58dbce634ea70.jpg"
        ]
    },
    {
        name: "Professor X",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/e0/528d3378de525", extension: "jpg" },
        description: "Leader of the X-Men",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/professorx_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/professorx_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/6/a0/5390c1e69c43e.jpg"
        ]
    },
    {
        name: "Magneto",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/b0/5261a7e53f827", extension: "jpg" },
        description: "Master of Magnetism",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/magneto_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/magneto_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537bb6d167bb7.jpg"
        ]
    },
    {
        name: "Storm",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d", extension: "jpg" },
        description: "Weather-controlling mutant",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/storm_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/storm_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/a/40/5269608c1be7a.jpg"
        ]
    },    {
        name: "Cyclops",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/70/526547e2d90bc", extension: "jpg" },
        description: "Optic blast-powered X-Men leader",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/cyclops_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/cyclops_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/9/40/5269608c1be7a.jpg"
        ]
    },
    {
        name: "Jean Grey",
        thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/1/03/528d33d000749", extension: "jpg" },
        description: "Telepathic and telekinetic mutant",
        backup_images: [
            "https://terrigen-cdn-dev.marvel.com/content/prod/1x/jeangrey_lob_crd_01.jpg",
            "https://cdn.marvel.com/content/1x/jeangrey_lob_crd_01.jpg",
            "https://i.annihil.us/u/prod/marvel/i/mg/6/a0/5390c1e69c43e.jpg"
        ]
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
        
        this.questions = shuffledCharacters.slice(0, maxQuestions).map(character => {            // Construct image URL with comprehensive error handling and multiple fallback sources
            let imageUrl = '';
            let fallbackSources = [];
            
            if (character.thumbnail && character.thumbnail.path) {
                // Primary image URL construction
                const extension = character.thumbnail.extension ? `.${character.thumbnail.extension}` : '.jpg';
                imageUrl = `${character.thumbnail.path}${extension}`;
                
                // Replace http with https for better compatibility
                imageUrl = imageUrl.replace('http://', 'https://');
                
                // Build comprehensive fallback list
                fallbackSources = [
                    // Try backup images first if available
                    ...(character.backup_images || []),
                    
                    // Protocol variations
                    imageUrl.replace('https://', 'http://'),
                    
                    // CDN variations
                    imageUrl.replace('i.annihil.us', 'cdn.marvel.com'),
                    imageUrl.replace('i.annihil.us', 'terrigen-cdn-dev.marvel.com'),
                    
                    // Size variations
                    imageUrl.replace('portrait_xlarge', 'standard_fantastic'),
                    imageUrl.replace('portrait_xlarge', 'portrait_incredible'),
                    imageUrl.replace('portrait_xlarge', 'standard_amazing'),
                    imageUrl.replace('portrait_xlarge', 'portrait_medium'),
                    
                    // Path variations
                    imageUrl.replace('/u/prod/marvel/', '/content/prod/1x/'),
                    imageUrl.replace('/u/prod/marvel/', '/content/1x/'),
                    
                    // Final fallback
                    this.createPlaceholderImage(character.name)
                ];
                
                // Remove duplicates and invalid URLs
                fallbackSources = [...new Set(fallbackSources)].filter(url => 
                    url && url.length > 10 && !url.includes('image_not_available')
                );
                
            } else {
                // No image data available, use placeholder
                imageUrl = this.createPlaceholderImage(character.name);
                fallbackSources = [];
            }
            
            console.log(`Generated question for ${character.name} with ${fallbackSources.length} fallback sources`);
            
            return {
                name: character.name,
                image: imageUrl,
                fallbackSources: fallbackSources,
                description: character.description || 'No description available',
                options: this.generateOptions(character.name)
            };
        });
        
        console.log(`Generated ${this.questions.length} questions for the quiz`);
        return this.questions;
    }
    
    createPlaceholderImage(characterName) {
        // Create a base64 encoded SVG placeholder
        const svg = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="url(#grad1)"/>
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#e62429;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#0056a3;stop-opacity:0.8" />
                </linearGradient>
            </defs>
            <text x="100" y="90" text-anchor="middle" fill="#FFF" font-family="Arial, sans-serif" font-size="16" font-weight="bold">MARVEL</text>
            <text x="100" y="110" text-anchor="middle" fill="#FFF" font-family="Arial, sans-serif" font-size="12">CHARACTER</text>
            <text x="100" y="130" text-anchor="middle" fill="#FFD700" font-family="Arial, sans-serif" font-size="10">${characterName}</text>
        </svg>`;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
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