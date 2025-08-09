# ProjectGallery Component

A comprehensive, interactive project showcase gallery built with React, TypeScript, and Framer Motion. This component provides an advanced way to display and interact with project portfolios.

## 🚀 Features

### Core Functionality
- **Smart Filtering**: Filter projects by category (Games, Tools, Educational)
- **Advanced Search**: Search across project titles, descriptions, and technologies
- **Multiple View Modes**: Grid, List, Carousel, and Timeline views
- **Sorting Options**: Popular, Recent, Alphabetical, and Custom ordering
- **Interactive Cards**: Hover effects, quick actions, and detailed modals

### Visual Enhancements
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **3D Effects**: Subtle 3D transforms and hover animations
- **Responsive Design**: Optimized for all device sizes
- **Accessibility**: ARIA labels, keyboard navigation, and focus management
- **Dark Mode Support**: Automatic theme detection and styling

### Performance Features
- **Lazy Loading**: Iframe content loads only when needed
- **Optimized Rendering**: Efficient filtering and sorting with useMemo
- **Smooth Scrolling**: Custom scrollbar styling for carousel view
- **Memory Management**: Proper cleanup of event listeners and animations

## 📦 Installation

The component requires the following dependencies (already included in the project):

```json
{
  "framer-motion": "^12.23.12",
  "lucide-react": "^0.511.0",
  "react": "^18.3.1",
  "typescript": "~5.8.3"
}
```

## 🎯 Usage

### Basic Implementation

```tsx
import ProjectGallery from '../components/ProjectGallery';

function App() {
  return (
    <div>
      <h1>My Projects</h1>
      <ProjectGallery />
    </div>
  );
}
```

### With Custom Styling

```tsx
<ProjectGallery className="my-custom-class" />
```

### Integration with Existing Projects

The component automatically imports and uses the projects data from `src/data/projects.ts`. Ensure your project data follows this interface:

```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  version?: string;
  stars?: number;
  forks?: number;
  lastUpdate?: string;
  viewCount?: number;
}
```

## 🎨 View Modes

### 1. Grid View (Default)
- Responsive grid layout with auto-fit columns
- Card-based design with hover effects
- Optimal for showcasing multiple projects

### 2. List View
- Horizontal layout with larger previews
- Detailed information display
- Great for detailed project browsing

### 3. Carousel View
- Horizontal scrolling layout
- Fixed-width cards for consistent presentation
- Smooth scrollbar with custom styling

### 4. Timeline View
- Chronological project arrangement
- Left border indicators for visual flow
- Perfect for showing project evolution

## 🔍 Filtering & Search

### Category Filters
- **All Projects**: Shows all available projects
- **Games**: Projects with game-related technologies
- **Tools**: Utility and calculation projects
- **Educational**: Learning and training platforms

### Search Functionality
- Real-time search across multiple fields
- Searches project titles, descriptions, and technologies
- Case-insensitive matching
- Instant results with debounced input

### Sorting Options
- **Most Popular**: Sorted by star count
- **Recently Updated**: Sorted by last update date
- **Alphabetical**: Sorted by project title
- **Custom Order**: Maintains original project order

## 🎭 Animations & Interactions

### Card Animations
- Staggered entrance animations
- Smooth hover effects with 3D transforms
- Scale and rotation on interaction
- Fade-in overlays with backdrop blur

### Filter Transitions
- Smooth filter button state changes
- Animated count badges
- Responsive layout transitions
- Loading states and skeleton screens

### Modal Interactions
- Smooth modal open/close animations
- Backdrop blur effects
- Responsive modal sizing
- Click-outside-to-close functionality

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile (< 640px)**: Single column, stacked filters
- **Tablet (640px - 768px)**: Two columns, horizontal filters
- **Desktop (> 768px)**: Three columns, full filter bar

### Mobile Optimizations
- Touch-friendly button sizes
- Swipe gestures for carousel view
- Optimized spacing for small screens
- Collapsible filter sections

## ♿ Accessibility Features

### Keyboard Navigation
- Tab navigation through all interactive elements
- Enter/Space key support for buttons
- Escape key to close modals
- Focus indicators for all interactive elements

### Screen Reader Support
- Proper ARIA labels and descriptions
- Semantic HTML structure
- Alt text for project previews
- Status announcements for filter changes

### Motion Preferences
- Respects `prefers-reduced-motion` setting
- Disables animations for users who prefer less motion
- Maintains functionality without animations

## 🎨 Customization

### CSS Variables
The component uses Tailwind CSS classes but can be customized through the CSS file:

```css
/* Custom color scheme */
.project-card {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}

/* Custom animations */
.project-card {
  --animation-duration: 0.5s;
  --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Component Props
Currently supports:
- `className`: Additional CSS classes for styling

Future enhancements could include:
- `theme`: Light/dark theme override
- `defaultView`: Initial view mode
- `defaultSort`: Initial sorting option
- `onProjectSelect`: Callback for project selection

## 🔧 Performance Considerations

### Optimization Strategies
- **Memoized Filtering**: Uses `useMemo` for expensive operations
- **Callback Optimization**: Stable function references with `useCallback`
- **Lazy Loading**: Iframe content loads on demand
- **Efficient Rendering**: Minimal re-renders with proper state management

### Memory Management
- Proper cleanup of animation subscriptions
- Event listener cleanup on unmount
- Optimized state updates
- Efficient array operations

## 🧪 Testing

### Component Testing
The component is designed to be easily testable:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectGallery from './ProjectGallery';

test('renders project gallery', () => {
  render(<ProjectGallery />);
  expect(screen.getByText('All Projects')).toBeInTheDocument();
});

test('filters projects correctly', () => {
  render(<ProjectGallery />);
  const gameFilter = screen.getByText('Games');
  fireEvent.click(gameFilter);
  // Add assertions for filtered results
});
```

### Mock Data
For testing, you can mock the projects data:

```tsx
jest.mock('../data/projects', () => ({
  projects: [
    {
      id: 'test-project',
      title: 'Test Project',
      description: 'A test project',
      technologies: ['React', 'TypeScript'],
      // ... other required fields
    }
  ]
}));
```

## 🚀 Future Enhancements

### Planned Features
- **Advanced Filtering**: Date ranges, technology stacks, project status
- **Project Analytics**: View counts, engagement metrics
- **Export Options**: PDF generation, project sharing
- **Integration APIs**: GitHub, GitLab, external project sources
- **Custom Themes**: User-defined color schemes and layouts

### Performance Improvements
- **Virtual Scrolling**: For large project lists
- **Image Optimization**: WebP support, lazy loading
- **Caching**: Local storage for user preferences
- **Service Worker**: Offline support and caching

## 📚 Dependencies

### Core Dependencies
- **React 18+**: For modern React features and hooks
- **TypeScript**: For type safety and better development experience
- **Framer Motion**: For smooth animations and transitions

### UI Dependencies
- **Lucide React**: For consistent iconography
- **Tailwind CSS**: For utility-first styling
- **CSS Modules**: For component-specific styles

## 🤝 Contributing

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Add proper JSDoc comments

### Testing
- Write unit tests for all new features
- Ensure accessibility compliance
- Test across different devices and browsers
- Maintain good test coverage

## 📄 License

This component is part of the project portfolio and follows the same licensing terms as the main project.

## 🆘 Support

For issues or questions:
1. Check the component documentation
2. Review the demo page for usage examples
3. Examine the source code for implementation details
4. Create an issue with detailed problem description

---

**Built with ❤️ using React, TypeScript, and Framer Motion**
