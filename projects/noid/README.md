# Return of the Noid - Marvel Character Quiz Game

A fun Marvel character guessing game that tests your knowledge of Marvel superheroes and villains!

## 🎮 Game Features

- **Marvel Character Quiz**: Guess Marvel characters from their images
- **Multiple Choice Questions**: 4 options per question
- **Real-time Feedback**: Visual feedback for correct/incorrect answers
- **Score Tracking**: See how well you know your Marvel characters
- **Responsive Design**: Works on desktop and mobile devices
- **Marvel API Integration**: Fresh character data from Marvel's official database

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
├── index.html              # Main game file
├── js/
│   ├── main.js            # Game logic and flow
│   ├── marvelApi.js       # Marvel API integration
│   ├── config.template.js # Configuration template
│   └── config.js          # Your API configuration (git-ignored)
├── css/
│   ├── styles.css         # Game styling
│   └── marvel-quiz.css    # Quiz-specific styles
├── assets/
│   └── cdn/               # Local CDN resources
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## 🎯 How to Play

1. **Start Game**: Click "Start Game" to begin
2. **Enter Name**: Go through the name entry process (part of the original game's charm!)
3. **Answer Questions**: Look at the Marvel character image and choose the correct name
4. **Get Feedback**: See if you're right or wrong immediately
5. **View Score**: Check your final score and try to beat it!

## 🛠️ Technical Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Bootstrap 5 + Custom CSS
- **API**: Marvel Comics API
- **Dependencies**: jQuery, CryptoJS for API authentication

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

## 🎨 Game Screenshots

The game features:

- Welcome screen with game branding
- Name entry challenges (original "Noid" style)
- Marvel character image quiz
- Score display with emoji feedback
- Responsive design for all devices

## 📧 Support

If you encounter issues:

1. Check that your API keys are correctly configured
2. Verify your internet connection for Marvel API access
3. Check browser console for error messages
4. The game will fallback to local data if API fails

---

Enjoy testing your Marvel knowledge! 🦸‍♂️🦸‍♀️
