# Professional Web Development Portfolio ![Portfolio Logo](assets/logos/stray-gear.png)

A comprehensive showcase of web development projects, skills, and technical expertise. This portfolio demonstrates proficiency in modern web technologies and creative problem-solving approaches.

## About This Portfolio

This portfolio represents a collection of web development projects ranging from simple interactive applications to complex multi-page websites. Each project demonstrates various technical skills and design principles.

## Project Structure

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
├── assets/                     # Source assets
│   ├── images/                 # Image assets
│   ├── logos/                  # Logo files
│   ├── lowFi/                  # Low fidelity designs
│   └── screenshots/            # Project screenshots
│       ├── calculator.png
│       ├── compTIA.png
│       ├── knuckle.png
│       ├── quiz.png
│       ├── rps.png
│       └── webpage/            # Website screenshots
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

### Screenshots

![Portfolio Homepage](assets/screenshots/webpage/Screenshot%20(159).png)
*Homepage with project overview and skills showcase*

![Projects Gallery](assets/screenshots/webpage/Screenshot%20(160).png)
*Interactive projects gallery with carousel navigation*

![Knucklebones Game](assets/screenshots/webpage/Screenshot%20(161).png)
*Knucklebones dice game with interactive game board*

![CompTIA Quiz Interface](assets/screenshots/webpage/Screenshot%20(162).png)
*CompTIA certification quiz with multiple choice questions*

![Contact Page](assets/screenshots/webpage/Screenshot%20(163).png)
*Contact form and developer information*

## Featured Projects

- **Interactive Calculator**: A fully functional calculator with responsive design
- **Knucklebones Game**: Interactive web-based implementation of the dice game
- **CompTIA Quiz**: Technical assessment preparation tool
- **Rock Paper Scissors**: Classic game with modern UI
- **Countdown Timer**: Event countdown with visual feedback

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Custom CSS
- **JavaScript Libraries**: Various project-specific libraries
- **Version Control**: Git
- **Build Tools**: npm

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
- Reference shared assets from `assets/` or `public/assets/` as appropriate

## Build and Deployment

The project uses Tailwind CSS for styling. To build the project:

1. Install dependencies: `npm install`
2. Run build process: `npm run build`
3. Deploy the `public` directory to your hosting provider

## Contact and Feedback

Feel free to explore the projects and provide feedback on any aspect of the work presented.

---

&copy; 2025 StrayDog Syndications LLC. All Rights Reserved.
