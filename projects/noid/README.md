# Marvel Universe Quiz - Enhanced Interactive Experience

An immersive Marvel character identification quiz featuring cutting-edge gameplay mechanics and responsive design!

## 🚀 New Features & Enhancements

### ✨ **Interactive Stat Buttons**

- **"Heroes & Villains" (Character Focus)**: Activate for +5 bonus points per correct answer for 30 seconds (60s cooldown)
- **"80 Years of Stories" (Time Master)**: Gain +10 seconds and slower timer progression for 20 seconds (45s cooldown)
- **Visual Effects**: Dynamic button states with activation animations and cooldown indicators
- **Strategic Gameplay**: Choose the right moment to activate these power-ups for maximum score!

### 📱 **Responsive Single-Viewport Design**

- **Optimized Layout**: Entire application fits within viewport on any device - no scrolling needed!
- **Smart Responsive Breakpoints**: Adaptive design for various screen sizes and orientations
- **Viewport Height Optimization**: Special handling for short screens and landscape orientation
- **Mobile-First Approach**: Seamless experience from phones to desktops

### 🎯 **Enhanced Quiz System**

- **Scalable Question Pools**: Easy: 25, Medium: 50, Hard: 75 questions
- **Improved Accessibility**: Better focus states, keyboard navigation, and screen reader support
- **Performance Optimized**: Faster loading with efficient API handling and fallback data

## 🎮 Game Features

- **Marvel Character Quiz**: Identify Marvel heroes and villains from their official images
- **Interactive Power-ups**: Strategic stat button activations with visual feedback
- **Multiple Difficulty Levels**: Choose your challenge level with varying question counts
- **Real-time Feedback**: Instant visual and audio feedback for answers
- **Advanced Scoring**: Bonus point system with power-up multipliers
- **Responsive Design**: Optimized for all devices and screen sizes
- **Marvel API Integration**: Fresh character data with robust fallback system

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd projects/noid
```

### 2. Configure Marvel API Keys

#### Get Marvel API Keys

1. Visit [Marvel Developer Portal](https://developer.marvel.com/)
2. Create an account and get your API keys
3. You'll receive a **Public Key** and **Private Key**

#### Setup Configuration

1. Copy the config template:

   ```bash
   cp js/config.template.js js/config.js
   ```

2. Edit `js/config.js` and replace the placeholder values:

   ```javascript
   const CONFIG = {
       MARVEL_API: {
           PUBLIC_KEY: 'your_actual_public_key_here',
           PRIVATE_KEY: 'your_actual_private_key_here',
           BASE_URL: 'https://gateway.marvel.com/v1/public'
       }
   };
   ```

### 3. Run the Game

Simply open `index.html` in your web browser!

## 🔒 Security Notes

- **Never commit API keys to version control**
- The `js/config.js` file is git-ignored for security
- The game includes fallback data if API keys aren't configured
- Use environment variables in production deployments

## 📁 Project Structure

```text
noid/
├── index.html                 # Main game interface with enhanced UI
├── js/
│   ├── main.js               # Game initialization and stat button logic
│   ├── quiz-engine.js        # Enhanced quiz logic with power-up system
│   ├── marvelApi.js          # Marvel API integration with extended fallback data
│   ├── config.template.js    # Configuration template
│   └── config.js             # Your API configuration (git-ignored)
├── css/
│   ├── styles.css            # Basic game styling
│   └── marvel-quiz-new.css   # Advanced responsive styles with interactive elements
├── assets/
│   └── cdn/                  # Local CDN resources
├── .gitignore                # Git ignore file
└── README.md                 # This file
```

## 🎯 How to Play

1. **Start Game**: Click "Start Game" and select your difficulty level (Easy/Medium/Hard)
2. **Strategic Power-ups**: Use the interactive stat buttons for bonus advantages:
   - **Heroes & Villains**: Click for +5 bonus points per correct answer (30s duration, 60s cooldown)
   - **80 Years of Stories**: Click for +10 seconds and slower timer (20s duration, 45s cooldown)
3. **Answer Questions**: Look at the Marvel character image and choose the correct name from 4 options
4. **Time Management**: Watch the timer and use power-ups strategically for maximum score
5. **Get Feedback**: See immediate visual feedback for correct/incorrect answers with bonus notifications
6. **View Results**: Check your final score and compare against the maximum possible for your difficulty level

### 💡 Pro Tips

- **Save power-ups** for challenging questions or when you're running low on time
- **Character Focus** is great for difficult character identification sequences
- **Time Master** helps when you need extra seconds to think through tough choices
- **Watch cooldown timers** to plan your power-up usage strategically

## 🛠️ Technical Details

- **Frontend**: Vanilla JavaScript ES6+, HTML5, CSS3 with advanced features
- **Styling**: Custom CSS with CSS Grid, Flexbox, and responsive design patterns
- **API**: Marvel Comics API with enhanced error handling and fallback system
- **Dependencies**: jQuery, CryptoJS for API authentication
- **Features**: Interactive power-up system, viewport-optimized responsive design
- **Performance**: Optimized loading, efficient DOM manipulation, smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Important Notes

- **API Rate Limits**: Marvel API has a 3000 calls/day limit
- **CORS**: The game handles CORS issues gracefully
- **Fallback Data**: Works offline with built-in character data
- **Security**: Keep your API keys secure and never commit them

## 🎨 Game Features & Screenshots

The enhanced game includes:

- **Interactive Welcome Screen**: Modern Marvel-themed design with difficulty selection
- **Strategic Stat Buttons**: "Heroes & Villains" and "80 Years of Stories" power-ups with visual effects
- **Responsive Character Quiz**: Optimized image display that fits any viewport size
- **Advanced Scoring System**: Bonus point notifications and power-up feedback
- **Single-Viewport Design**: Entire game experience without scrolling on any device
- **Accessibility Features**: Keyboard navigation and screen reader compatibility
- **Visual Effects**: Smooth animations, hover states, and activation feedback

## 📧 Support

If you encounter issues:

1. Check that your API keys are correctly configured
2. Verify your internet connection for Marvel API access
3. Check browser console for error messages
4. The game will fallback to local data if API fails

---

Enjoy testing your Marvel knowledge! 🦸‍♂️🦸‍♀️
