# Interactive Skills Matrix Component

A comprehensive, interactive React component for visualizing technical skills, experience levels, and project applications with advanced filtering, sorting, and comparison features.

## 🚀 Features

### ✨ **Core Features**
- **Interactive Hover Effects**: Detailed skill information on hover including descriptions, projects, and certifications
- **Animated Progress Bars**: Beautiful animated progress bars that fill on scroll into view
- **Category Filtering**: Filter skills by category (Frontend, Backend, AI/ML, Tools)
- **Smart Sorting**: Sort by proficiency level, name, or experience with ascending/descending options
- **Skill Comparison**: Compare up to 3 skills side-by-side in a detailed table
- **Export Functionality**: Export as PNG image or JSON data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎯 **Advanced Features**
- **Intersection Observer**: Scroll-triggered animations for better performance
- **Accessibility Support**: Keyboard navigation and screen reader friendly
- **Dark Mode Ready**: Automatic dark mode detection and styling
- **Print Optimization**: Clean print layouts with unnecessary elements hidden
- **High Contrast Support**: Enhanced visibility for accessibility needs
- **Reduced Motion Support**: Respects user's motion preferences

## 📦 Installation

```bash
# Install React and required dependencies
npm install react react-dom

# Optional: For enhanced animations (recommended)
npm install framer-motion

# Optional: For PDF export functionality
npm install html2canvas jspdf
```

## 🛠️ Usage

### Basic Implementation

```jsx
import React from 'react';
import SkillsMatrix from './components/SkillsMatrix';
import './css/skills-matrix.css'; // Import styles

function App() {
  return (
    <div className="App">
      <SkillsMatrix />
    </div>
  );
}

export default App;
```

### Custom Skills Data

```jsx
const customSkills = {
  frontend: [
    {
      name: 'React',
      level: 90,
      experience: '3 years',
      projects: ['Portfolio Website', 'E-commerce Dashboard'],
      description: 'Component-based UI library with hooks and state management',
      certifications: ['React Developer Certification'],
      color: '#61DAFB'
    },
    // Add more skills...
  ],
  // Add more categories...
};

// Pass custom data to component
<SkillsMatrix skills={customSkills} />
```

## 📊 Data Structure

### Skill Object

```typescript
interface Skill {
  name: string;                    // Skill name (e.g., "React")
  level: number;                   // Proficiency level (0-100)
  experience: string;              // Experience duration (e.g., "3 years")
  projects: string[];              // Related project names
  description: string;             // Skill description
  certifications: string[];       // Certification names
  color: string;                   // Hex color for visual identification
}
```

### Skills Categories

```typescript
interface SkillsData {
  frontend: Skill[];               // Frontend technologies
  backend: Skill[];                // Backend technologies
  ai_ml: Skill[];                  // AI/ML technologies
  tools: Skill[];                  // Development tools
  [category: string]: Skill[];     // Custom categories
}
```

## 🎨 Customization

### Styling

The component uses Tailwind CSS classes but can be customized with CSS:

```css
/* Custom progress bar colors */
.skills-matrix .level-excellent {
  background: linear-gradient(135deg, #10B981, #059669);
}

.skills-matrix .level-advanced {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
}

/* Custom hover effects */
.skills-matrix .skill-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Component Props

```jsx
<SkillsMatrix
  skills={customSkills}           // Custom skills data
  defaultCategory="all"           // Default category filter
  defaultSort="level"             // Default sort field
  defaultSortOrder="desc"         // Default sort order
  enableAnimations={true}         // Enable/disable animations
  enableExport={true}             // Enable/disable export features
  enableComparison={true}         // Enable/disable comparison mode
  maxCompareSkills={3}            // Maximum skills for comparison
/>
```

## 🎯 Feature Guide

### 1. Category Filtering

```jsx
// Available categories
const categories = ['all', 'frontend', 'backend', 'ai_ml', 'tools'];

// Filter implementation
const filteredSkills = skills.filter(skill => 
  selectedCategory === 'all' || skill.category === selectedCategory
);
```

### 2. Sorting Options

```jsx
// Sort by proficiency level (default)
skills.sort((a, b) => b.level - a.level);

// Sort by name
skills.sort((a, b) => a.name.localeCompare(b.name));

// Sort by experience
skills.sort((a, b) => parseFloat(b.experience) - parseFloat(a.experience));
```

### 3. Skill Comparison

```jsx
// Enable comparison mode
const [compareMode, setCompareMode] = useState(false);
const [selectedSkills, setSelectedSkills] = useState([]);

// Add skill to comparison (max 3)
const addToComparison = (skill) => {
  if (selectedSkills.length < 3) {
    setSelectedSkills([...selectedSkills, skill]);
  }
};
```

### 4. Export Functionality

```jsx
// Export as JSON
const exportAsJSON = () => {
  const dataStr = JSON.stringify(skills, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  // Download implementation...
};

// Export as image (requires html2canvas)
const exportAsImage = async () => {
  const canvas = await html2canvas(matrixRef.current);
  const link = document.createElement('a');
  link.download = 'skills-matrix.png';
  link.href = canvas.toDataURL();
  link.click();
};
```

## 📱 Responsive Design

The component is fully responsive and adapts to different screen sizes:

```css
/* Mobile (default) */
.skills-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }
}
```

## ♿ Accessibility

The component includes comprehensive accessibility features:

### Keyboard Navigation
- Tab through skill cards
- Enter/Space to select skills in comparison mode
- Arrow keys for dropdown navigation

### Screen Reader Support
```jsx
<div 
  className="skill-card"
  role="button"
  tabIndex={0}
  aria-label={`${skill.name} skill, ${skill.level}% proficiency, ${skill.experience} experience`}
  aria-describedby={`skill-${skill.name}-description`}
>
  {/* Skill content */}
</div>
```

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .skill-card {
    border: 2px solid;
    background: white;
    color: black;
  }
}
```

## 🎭 Animation System

### Scroll-Triggered Animations

```jsx
// Intersection Observer setup
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { threshold: 0.3 }
  );

  if (matrixRef.current) {
    observer.observe(matrixRef.current);
  }

  return () => observer.disconnect();
}, []);
```

### Progress Bar Animation

```css
.progress-bar {
  width: 0%;
  transition: width 1s ease-out;
}

.progress-bar.animate {
  width: var(--skill-level);
}
```

### Staggered Card Animations

```jsx
// Staggered animation delays
<div 
  className="skill-card"
  style={{ 
    animationDelay: `${index * 100}ms`,
    transitionDelay: `${index * 50}ms`
  }}
>
```

## 📊 Performance Optimization

### Virtualization for Large Datasets

```jsx
// For 100+ skills, consider virtualization
import { FixedSizeGrid as Grid } from 'react-window';

const VirtualizedSkillsGrid = ({ skills }) => (
  <Grid
    columnCount={Math.floor(width / 320)}
    columnWidth={320}
    height={600}
    rowCount={Math.ceil(skills.length / columnCount)}
    rowHeight={250}
    itemData={skills}
  >
    {SkillCard}
  </Grid>
);
```

### Memoization

```jsx
// Memoize expensive computations
const sortedSkills = useMemo(() => {
  return getFilteredAndSortedSkills();
}, [selectedCategory, sortBy, sortOrder, skills]);

// Memoize skill cards
const SkillCard = React.memo(({ skill, isSelected, onClick }) => {
  // Component implementation
});
```

## 🧪 Testing

### Unit Tests

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import SkillsMatrix from './SkillsMatrix';

test('filters skills by category', () => {
  render(<SkillsMatrix />);
  
  // Select frontend category
  fireEvent.change(screen.getByLabelText('Category:'), {
    target: { value: 'frontend' }
  });
  
  // Check that only frontend skills are shown
  expect(screen.getByText('React')).toBeInTheDocument();
  expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
});

test('sorts skills by proficiency level', () => {
  render(<SkillsMatrix />);
  
  const skillCards = screen.getAllByTestId('skill-card');
  const firstSkillLevel = skillCards[0].querySelector('.skill-level').textContent;
  
  // Should be sorted by highest level first
  expect(firstSkillLevel).toBe('95%');
});
```

### Integration Tests

```jsx
test('skill comparison functionality', () => {
  render(<SkillsMatrix />);
  
  // Enable comparison mode
  fireEvent.click(screen.getByText('Compare Skills'));
  
  // Select skills
  fireEvent.click(screen.getByText('React'));
  fireEvent.click(screen.getByText('Node.js'));
  
  // Check comparison table appears
  expect(screen.getByText('Skill Comparison')).toBeInTheDocument();
  expect(screen.getByRole('table')).toBeInTheDocument();
});
```

## 🚀 Deployment

### Build Optimization

```bash
# Build for production
npm run build

# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### CDN Assets

```html
<!-- Preload critical CSS -->
<link rel="preload" href="/css/skills-matrix.css" as="style">

<!-- Preload fonts -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

## 🔧 Troubleshooting

### Common Issues

1. **Animations not working**
   ```jsx
   // Check if Intersection Observer is supported
   if ('IntersectionObserver' in window) {
     // Use animations
   } else {
     // Fallback without animations
   }
   ```

2. **Performance issues with many skills**
   ```jsx
   // Implement pagination or virtualization
   const SKILLS_PER_PAGE = 20;
   const paginatedSkills = skills.slice(
     page * SKILLS_PER_PAGE, 
     (page + 1) * SKILLS_PER_PAGE
   );
   ```

3. **Export not working**
   ```jsx
   // Check browser support for canvas
   if (HTMLCanvasElement.prototype.toBlob) {
     // Use canvas export
   } else {
     // Use alternative export method
   }
   ```

## 📚 Examples

Check out the included demo files:
- `src/pages/SkillsMatrixDemo.jsx` - Complete demo page
- `src/components/SkillsMatrix.jsx` - Main component
- `src/css/skills-matrix.css` - Styling and animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - feel free to use in personal and commercial projects.

---

**Ready to showcase your skills with style? 🎨**

The Interactive Skills Matrix component provides everything you need to create an engaging, professional presentation of your technical abilities.
