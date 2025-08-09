# 🌟 StrayDog Syndications - Glassmorphic Portfolio

> A cutting-edge, glassmorphic design portfolio showcasing modern web development expertise and interactive applications.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20View%20Portfolio-brightgreen?style=for-the-badge)](https://straydogsyn.github.io/Learner-Files/)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://github.com/StrayDogSyn/Learner-Files)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

## 🎯 Live Portfolio

**🌐 [View Live Portfolio](https://straydogsyn.github.io/Learner-Files/)**

Experience the full glassmorphic portfolio with interactive features, flagship applications, and modern web technologies.

## ✨ Features

### 🎨 Glassmorphic Design System
- **Frosted Glass Effects**: 8-12px blur with semi-transparent backgrounds
- **Metallic Accents**: Gradient text with shimmer animations
- **Hunter Green Palette**: Professional color scheme with charcoal and metallic tones
- **Typography System**: Orbitron/Audiowide for headings, Inter for body text
- **Responsive Design**: Mobile-first approach with AAA accessibility

### 🚀 Interactive Applications
- **🧮 Advanced Calculator**: Scientific functions with explosion effects
- **🎲 Knucklebones Game**: Strategic dice game with real-time scoring
- **📋 Quiz Master Pro**: Dynamic quiz system with progress tracking
- **⏰ Countdown Timer**: Interactive timer with flip animations
- **📚 CompTIA Trainer**: Certification study materials

### 🛠️ Technical Excellence
- **React 18.3.1** with TypeScript for type safety
- **Vite 6.0.1** for lightning-fast development
- **Framer Motion** for smooth animations
- **React Router** with HashRouter for GitHub Pages
- **Tailwind CSS** with custom glassmorphic utilities
- **Performance Optimized** with code splitting and lazy loading

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Glassmorphic navigation
│   ├── BrandLogo.tsx   # Animated brand logo
│   └── ProjectCard.tsx # Interactive project cards
├── pages/              # Main application pages
│   ├── Home.tsx        # Landing page with hero section
│   ├── Projects.tsx    # Project gallery
│   └── Portfolio.tsx   # Professional showcase
├── projects/           # Flagship applications
│   ├── Calculator.tsx  # Advanced calculator
│   ├── QuizNinja.tsx  # Quiz application
│   └── Knucklebones.tsx # Dice strategy game
├── css/               # Styling system
│   ├── glassmorphic-design-system.css
│   ├── brand-system.css
│   └── hero.css
└── data/              # Application data
    └── projects.ts    # Project configurations
```

### Design System
- **Color Variables**: CSS custom properties for consistent theming
- **Glass Components**: Reusable glassmorphic elements
- **Animation Library**: Framer Motion integration
- **Responsive Utilities**: Mobile-first breakpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/StrayDogSyn/Learner-Files.git
cd Learner-Files

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
```

## 🌐 Deployment

### GitHub Pages (Current)
The portfolio is automatically deployed to GitHub Pages via GitHub Actions:

- **Live URL**: https://straydogsyn.github.io/Learner-Files/
- **Deployment**: Automatic on push to `main` branch
- **Build Process**: Vite build with GitHub Pages optimization

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Alternative Platforms
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder
- **AWS S3**: Upload static files with CloudFront

## 🎨 Customization

### Color Scheme
Modify the glassmorphic color palette in `src/css/glassmorphic-design-system.css`:

```css
:root {
  --charcoal-primary: #2C3E50;
  --hunter-green-primary: #27AE60;
  --metallic-gold: #F1C40F;
  /* Add your custom colors */
}
```

### Typography
Update font configurations in the design system:

```css
.font-heading {
  font-family: 'Orbitron', 'Audiowide', sans-serif;
}

.font-body {
  font-family: 'Inter', 'Source Sans Pro', sans-serif;
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local development:

```env
# GitHub API (optional)
GITHUB_TOKEN=your_github_token
GITHUB_USERNAME=StrayDogSyn

# Analytics (optional)
GOOGLE_ANALYTICS_ID=your_ga_id
```

### Vite Configuration
The project uses optimized Vite configuration for:
- GitHub Pages base path handling
- Code splitting and chunk optimization
- Asset optimization and compression
- Development proxy for API routes

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern glassmorphism trends
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion community
- **Deployment**: GitHub Pages and Actions

## 📞 Contact

**Eric 'Hunter' Petross**
- 🌐 Portfolio: [straydogsyn.github.io/Learner-Files](https://straydogsyn.github.io/Learner-Files/)
- 💼 GitHub: [@StrayDogSyn](https://github.com/StrayDogSyn)
- 📧 Email: [Contact via Portfolio](https://straydogsyn.github.io/Learner-Files/#/contact)

---

<div align="center">
  <strong>Built with ❤️ using React, TypeScript, and Glassmorphic Design</strong>
</div>
