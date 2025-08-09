# 🚀 StrayDog Syndications Portfolio

> **AI-Enhanced Full Stack Developer specializing in Justice Reform Technology**

[![Deploy Status](https://github.com/straydogsyn/Learner-Files/actions/workflows/deploy.yml/badge.svg)](https://github.com/straydogsyn/Learner-Files/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-brightgreen)](https://straydogsyn.github.io/Learner-Files/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Claude 4.1](https://img.shields.io/badge/Claude-4.1%20Integration-orange)](https://www.anthropic.com/)

## 🌟 Overview

A cutting-edge portfolio showcasing AI-enhanced full stack development with a specialized focus on justice reform technology. This project demonstrates the integration of modern web technologies with artificial intelligence to create impactful solutions for legal and justice systems.

### 🎯 Mission
Leveraging AI to transform justice systems and create more equitable, transparent, and efficient legal processes.

## ✨ Features

### 🤖 AI Integration
- **Claude 4.1 Integration** - Advanced AI chat assistant with justice reform context
- **Intelligent Code Review** - Automated code analysis and optimization
- **Smart Content Generation** - AI-powered project descriptions and case studies
- **Performance Optimization** - AI-driven performance monitoring and suggestions

### 🏛️ Justice Reform Focus
- **Legal Process Automation** - Streamlining court operations and case management
- **Bias Detection Systems** - ML algorithms to identify and mitigate bias
- **Transparency Tools** - Open data platforms for legal accountability
- **Rehabilitation Support** - AI-driven reentry and support systems

### 🎨 Modern Design
- **Responsive Design** - Mobile-first approach with fluid layouts
- **Glass Morphism Effects** - Modern UI with depth and transparency
- **3D Animations** - Interactive Three.js components
- **Micro-interactions** - Smooth animations and transitions
- **Dark/Light Themes** - Adaptive theming system

### ⚡ Performance
- **Static Site Generation** - Optimized for GitHub Pages deployment
- **Code Splitting** - Lazy loading for optimal performance
- **Image Optimization** - WebP format with responsive sizing
- **SEO Optimized** - Meta tags, Open Graph, and structured data

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 4.0
- **Animations:** Framer Motion
- **3D Graphics:** Three.js + React Three Fiber
- **Icons:** Lucide React

#### Backend & APIs
- **API Routes:** Next.js serverless functions
- **AI Integration:** Claude 4.1 API
- **Data Management:** Static JSON + GitHub API
- **Authentication:** NextAuth.js (optional)

#### Development & Deployment
- **Build Tool:** Next.js built-in
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint + Prettier
- **CI/CD:** GitHub Actions
- **Deployment:** GitHub Pages
- **Monitoring:** Performance analytics

### Project Structure

```
portfolio-nextjs/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/                # API endpoints
│   │   │   ├── 📁 chat/           # Claude AI integration
│   │   │   ├── 📁 contact/        # Contact form handler
│   │   │   └── 📁 github/         # GitHub API integration
│   │   ├── 📁 about/              # About page
│   │   ├── 📁 projects/           # Projects showcase
│   │   ├── 📁 case-studies/       # Justice reform case studies
│   │   ├── 📁 contact/            # Contact page
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Homepage
│   ├── 📁 components/             # Reusable UI components
│   │   ├── 📁 atoms/              # Basic UI elements
│   │   ├── 📁 molecules/          # Composite components
│   │   ├── 📁 organisms/          # Complex components
│   │   ├── 📁 templates/          # Page templates
│   │   ├── 📁 ui/                 # UI component library
│   │   ├── 📁 effects/            # Visual effects
│   │   ├── 📁 showcase/           # Feature showcases
│   │   └── 📁 providers/          # Context providers
│   ├── 📁 data/                   # Static data files
│   │   ├── projects.ts            # Project information
│   │   └── case-studies.ts        # Justice reform cases
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 lib/                    # Utility libraries
│   ├── 📁 providers/              # Context providers
│   └── 📁 types/                  # TypeScript definitions
├── 📁 public/                     # Static assets
├── 📁 __tests__/                  # Test files
├── 📄 .env.example                # Environment variables template
├── 📄 jest.config.js              # Jest configuration
├── 📄 next.config.ts              # Next.js configuration
├── 📄 tailwind.config.js          # Tailwind CSS configuration
└── 📄 tsconfig.json               # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22.x or later
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/straydogsyn/Learner-Files.git
   cd Learner-Files/portfolio-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Required for AI features
   CLAUDE_API_KEY=your_claude_api_key_here
   
   # Required for GitHub integration
   GITHUB_TOKEN=your_github_token_here
   NEXT_PUBLIC_GITHUB_USERNAME=your_username
   
   # Optional analytics
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Quality Assurance
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run check        # Run lint + tests

# Deployment
npm run export       # Build static export
npm run deploy       # Build and prepare for deployment
npm run deploy:github # Deploy to GitHub Pages
```

### Testing

The project uses Jest and React Testing Library for comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **TypeScript** - Type safety and better developer experience
- **Husky** - Git hooks for pre-commit checks

## 🌐 Deployment

### GitHub Pages (Recommended)

The portfolio is automatically deployed to GitHub Pages using GitHub Actions:

1. **Automatic Deployment**
   - Push to `main` branch triggers deployment
   - Quality checks (linting, testing) run first
   - Build optimization and deployment to GitHub Pages

2. **Manual Deployment**
   ```bash
   npm run deploy:github
   ```

3. **Live URL**
   - [https://straydogsyn.github.io/Learner-Files/](https://straydogsyn.github.io/Learner-Files/)

### Alternative Deployments

- **Vercel:** Connect GitHub repository for automatic deployments
- **Netlify:** Drag and drop the `out/` folder after running `npm run build`
- **AWS S3:** Upload static files to S3 bucket with CloudFront

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options:

#### Required
- `CLAUDE_API_KEY` - Claude AI API key for chat functionality
- `GITHUB_TOKEN` - GitHub personal access token for repository data

#### Optional
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics tracking ID
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking
- `EMAIL_SERVICE_API_KEY` - Email service for contact forms

### Customization

#### Branding
Update the following files to customize branding:
- `src/app/layout.tsx` - Site metadata and title
- `src/data/projects.ts` - Project information
- `src/data/case-studies.ts` - Case study content
- `public/` - Favicon and static assets

#### Styling
- `tailwind.config.js` - Tailwind CSS configuration
- `src/app/globals.css` - Global styles and CSS variables
- `src/components/ui/` - UI component styling

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new components
- Use semantic commit messages
- Ensure accessibility compliance
- Maintain responsive design principles

## 📊 Performance

### Lighthouse Scores
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

### Optimization Features
- Static site generation for fast loading
- Image optimization with WebP format
- Code splitting and lazy loading
- Efficient bundle size management
- Service worker for offline functionality

## 🔒 Security

- Environment variables for sensitive data
- API rate limiting implementation
- Input validation and sanitization
- HTTPS enforcement
- Content Security Policy headers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Anthropic** - For Claude AI integration
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For deployment and hosting solutions
- **Justice Reform Community** - For inspiration and guidance

## 📞 Contact

- **Portfolio:** [https://straydogsyn.github.io/Learner-Files/](https://straydogsyn.github.io/Learner-Files/)
- **GitHub:** [@straydogsyn](https://github.com/straydogsyn)
- **Email:** contact@straydogsyn.com

---

**Built with ❤️ and AI to transform justice systems through technology**
