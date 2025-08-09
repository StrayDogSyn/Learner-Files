# Hunter & Cortana | Applied AI Solutions Engineering
## Brand Guidelines & Design System

## 1. Brand Identity

### 1.1 Brand Positioning
**Hunter & Cortana** represents the fusion of human creativity and artificial intelligence in software engineering. Hunter embodies the technical expertise, problem-solving skills, and innovative thinking, while Cortana represents the AI-enhanced capabilities, intelligent automation, and future-forward solutions.

**Brand Promise**: "Transforming Ideas into Intelligent Solutions"

**Core Values**:
- Innovation through AI integration
- Technical excellence and craftsmanship
- Human-centered design approach
- Continuous learning and adaptation
- Professional integrity and reliability

### 1.2 Visual Identity

**Logo Concept**: 
- Primary: "Hunter & Cortana" in Orbitron font with AI circuit pattern integration
- Secondary: "H&C" monogram with geometric AI-inspired elements
- Icon: Stylized neural network node or circuit pattern

**Tagline**: "Applied AI Solutions Engineering"

## 2. Color System

### 2.1 Primary Colors

```css
:root {
  /* Primary Brand Colors */
  --hunter-green: #355E3B;
  --hunter-green-light: #4A7C59;
  --hunter-green-dark: #2A4A2F;
  
  --deep-black: #0D1117;
  --deep-black-light: #161B22;
  --deep-black-dark: #010409;
}
```

**Hunter Green (#355E3B)**
- Primary brand color representing growth, stability, and nature
- Use for: Primary buttons, headers, brand elements
- Accessibility: AAA compliant with white text

**Deep Black (#0D1117)**
- Secondary brand color representing sophistication and technology
- Use for: Backgrounds, text, navigation elements
- Accessibility: AAA compliant with white/light text

### 2.2 Accent Colors

```css
:root {
  /* Accent Colors */
  --electric-blue: #58A6FF;
  --electric-blue-light: #79B8FF;
  --electric-blue-dark: #388BFD;
  
  --ai-purple: #8B5CF6;
  --ai-purple-light: #A78BFA;
  --ai-purple-dark: #7C3AED;
}
```

**Electric Blue (#58A6FF)**
- Interactive elements, links, call-to-action buttons
- Represents technology, trust, and innovation

**AI Purple (#8B5CF6)**
- AI-specific features, chatbot elements, special highlights
- Represents artificial intelligence and futuristic technology

### 2.3 Neutral Colors

```css
:root {
  /* Neutral Palette */
  --gray-50: #F6F8FA;
  --gray-100: #EAEEF2;
  --gray-200: #D0D7DE;
  --gray-300: #AFBAC4;
  --gray-400: #8C959F;
  --gray-500: #6E7781;
  --gray-600: #57606A;
  --gray-700: #424A53;
  --gray-800: #32383F;
  --gray-900: #24292F;
}
```

### 2.4 Semantic Colors

```css
:root {
  /* Semantic Colors */
  --success-green: #238636;
  --warning-yellow: #D1A441;
  --error-red: #DA3633;
  --info-blue: #0969DA;
}
```

## 3. Typography System

### 3.1 Font Families

```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');

:root {
  --font-heading: 'Orbitron', 'Arial Black', sans-serif;
  --font-body: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;
}
```

**Orbitron (Headings)**
- Futuristic, geometric sans-serif
- Use for: Main headings, brand text, hero titles
- Weights: 400 (Regular), 700 (Bold), 900 (Black)

**Inter (Body Text)**
- Clean, readable sans-serif optimized for screens
- Use for: Body text, descriptions, navigation
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

**JetBrains Mono (Code)**
- Monospace font designed for developers
- Use for: Code snippets, technical specifications
- Weights: 300 (Light), 400 (Regular), 500 (Medium)

### 3.2 Typography Scale

```css
:root {
  /* Typography Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
}
```

### 3.3 Typography Components

```css
/* Heading Styles */
.heading-hero {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.heading-section {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.heading-card {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.3;
}

/* Body Text Styles */
.text-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.6;
}

.text-lead {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: 1.7;
}

.text-caption {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.4;
}
```

## 4. Spacing System

### 4.1 Spacing Scale

```css
:root {
  /* Spacing Scale (8px base) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### 4.2 Layout Grid

```css
:root {
  /* Layout Grid */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  
  --grid-gap: var(--space-6);
  --section-padding: var(--space-16);
  --card-padding: var(--space-6);
}
```

## 5. Component Library

### 5.1 Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--hunter-green);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--hunter-green-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(53, 94, 59, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--hunter-green);
  border: 2px solid var(--hunter-green);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--hunter-green);
  color: white;
  transform: translateY(-1px);
}

/* CTA Button */
.btn-cta {
  background: linear-gradient(135deg, var(--electric-blue), var(--ai-purple));
  color: white;
  padding: var(--space-4) var(--space-8);
  border-radius: 0.75rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-lg);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(88, 166, 255, 0.4);
}

.btn-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-cta:hover::before {
  left: 100%;
}
```

### 5.2 Cards

```css
/* Project Card */
.card-project {
  background: white;
  border-radius: 1rem;
  padding: var(--space-6);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card-project:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--hunter-green);
}

.card-project::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--hunter-green), var(--electric-blue));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.card-project:hover::before {
  transform: scaleX(1);
}

/* Feature Card */
.card-feature {
  background: var(--deep-black);
  color: white;
  border-radius: 1rem;
  padding: var(--space-8);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.card-feature::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--ai-purple) 0%, transparent 70%);
  opacity: 0.1;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.1); opacity: 0.2; }
}
```

### 5.3 Navigation

```css
/* Main Navigation */
.nav-main {
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-800);
  padding: var(--space-4) 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-brand {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.nav-link {
  color: var(--gray-300);
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--text-base);
  padding: var(--space-2) var(--space-4);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: white;
  background: rgba(53, 94, 59, 0.2);
}

.nav-link.active {
  color: var(--hunter-green);
  background: rgba(53, 94, 59, 0.1);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: var(--hunter-green);
}
```

## 6. Animation System

### 6.1 Transition Timing

```css
:root {
  /* Animation Timing */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
  --transition-slower: 0.5s ease;
  
  /* Easing Functions */
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 6.2 Keyframe Animations

```css
/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide In Animation */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Typewriter Animation */
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

## 7. Responsive Design

### 7.1 Breakpoints

```css
:root {
  /* Responsive Breakpoints */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}

/* Media Query Mixins */
@media (max-width: 768px) {
  .heading-hero { font-size: var(--text-4xl); }
  .heading-section { font-size: var(--text-2xl); }
  .section-padding { padding: var(--space-8); }
}

@media (max-width: 640px) {
  .heading-hero { font-size: var(--text-3xl); }
  .btn-cta { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
  .card-project { padding: var(--space-4); }
}
```

## 8. Accessibility Guidelines

### 8.1 Color Contrast
- All text must meet WCAG 2.1 AA standards (4.5:1 ratio)
- Interactive elements must have clear focus states
- Color cannot be the only means of conveying information

### 8.2 Focus Management

```css
/* Focus Styles */
.focus-visible {
  outline: 2px solid var(--electric-blue);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--deep-black);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1001;
}

.skip-link:focus {
  top: 6px;
}
```

### 8.3 ARIA Labels
- All interactive elements must have descriptive labels
- Complex components require appropriate ARIA roles
- Screen reader announcements for dynamic content

## 9. Implementation Guidelines

### 9.1 CSS Custom Properties Usage
```css
/* Use semantic naming */
.hero-section {
  background: var(--deep-black);
  color: var(--gray-50);
  padding: var(--section-padding);
}

/* Avoid hardcoded values */
.project-card {
  border-radius: var(--border-radius-lg);
  transition: var(--transition-base);
}
```

### 9.2 Component Consistency
- All components must follow the established design system
- Use consistent spacing and typography scales
- Maintain brand color usage throughout
- Ensure responsive behavior across all components

### 9.3 Performance Considerations
- Optimize font loading with font-display: swap
- Use CSS transforms for animations (GPU acceleration)
- Minimize layout shifts with proper sizing
- Implement progressive enhancement for animations

This brand guidelines document ensures consistent visual identity and user experience across the entire Hunter & Cortana portfolio, providing a solid foundation for the AI-enhanced showcase transformation.