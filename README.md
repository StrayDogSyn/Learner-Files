# Web Development Portfolio

A professional web development portfolio showcasing various projects and skills.

## Project Structure

```
root/
├── public/                     # Publicly accessible files
│   ├── index.html              # Main entry point
│   ├── splash.html             # Splash page
│   ├── bio.html                # About me page
│   ├── contacts.html           # Contact information
│   ├── projects.html           # Projects overview
│   ├── resume/                 # Resume section
│   │   ├── index.html
│   │   ├── css/
│   │   └── js/
│   ├── projects/               # Individual projects
│   │   ├── calculator/
│   │   ├── circle-maker/
│   │   ├── compTIA/
│   │   ├── countdown/
│   │   ├── knucklebones/
│   │   ├── navbar/
│   │   ├── noid/
│   │   ├── quiz-ninja2.1/
│   │   ├── rps/
│   │   └── toDoList/
│   └── assets/                 # Shared assets
│       ├── images/
│       ├── logos/
│       ├── lowFi/
│       └── screenshots/
├── src/                        # Source files for development
│   ├── css/                    # Shared styles
│   │   ├── colors.css
│   │   ├── modern.css
│   │   └── styles.css
│   ├── js/                     # Shared scripts
│   │   ├── canvas.js
│   │   └── scripts.js
│   └── components/             # Reusable components
├── config/                     # Configuration files
│   ├── tailwind.config.js
│   └── package.json
└── run/                        # Scripts or executables
```

## Development Guidelines

### Adding New Projects

1. Create a new directory in `public/projects/`
2. Maintain consistent structure within each project:
   - `index.html` - Main entry point
   - `css/` - Project-specific styles
   - `js/` - Project-specific scripts
   - `assets/` (if needed) - Project-specific assets

### Using Shared Resources

- Import shared styles from `src/css/`
- Import shared scripts from `src/js/`
- Reference shared assets from `public/assets/`

## Build and Deployment

The project uses Tailwind CSS for styling. To build the project:

1. Install dependencies: `npm install`
2. Run build process: `npm run build`
3. Deploy the `public` directory to your hosting provider