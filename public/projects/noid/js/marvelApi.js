// Marvel API Configuration
const MARVEL_API = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
    PRIVATE_KEY: 'YOUR_PRIVATE_KEY',
    BASE_URL: 'https://gateway.marvel.com/v1/public'
};

class MarvelService {
    constructor() {
        this.characters = [];
        this.questions = [];
    }

    generateHash(timestamp) {
        const hash = CryptoJS.MD5(timestamp + MARVEL_API.PRIVATE_KEY + MARVEL_API.PUBLIC_KEY).toString();
        return hash;
    }

    async fetchCharacters() {
        try {
            const timestamp = new Date().getTime();
            const hash = this.generateHash(timestamp);
            const response = await fetch(
                `${MARVEL_API.BASE_URL}/characters?ts=${timestamp}&apikey=${MARVEL_API.PUBLIC_KEY}&hash=${hash}&limit=50`
            );
            const data = await response.json();
            this.characters = data.data.results;
            return this.characters;
        } catch (error) {
            console.error('Error fetching Marvel characters:', error);
            throw error;
        }
    }

    generateQuestions() {
        this.questions = this.characters.map(character => ({
            name: character.name,
            image: `${character.thumbnail.path}.${character.thumbnail.extension}`,
            description: character.description || 'No description available',
            options: this.generateOptions(character.name)
        }));
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