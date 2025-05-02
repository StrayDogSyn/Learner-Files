class CircleMaker {
  constructor() {
    this.body = document.querySelector('body');
    this.dimensions = {
      height: window.innerHeight,
      width: window.innerWidth
    };
    
    this.state = {
      circles: [],
      isAnimating: false,
      maxCircles: 100,
      minSize: 20,
      maxSize: 100,
      animationSpeed: 2000
    };
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.setupAnimationFrame();
  }

  attachEventListeners() {
    window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    window.addEventListener('resize', () => this.updateDimensions());
    
    // Touch support
    window.addEventListener('touchstart', () => this.createCircle());
    
    // Animation controls
    document.addEventListener('keydown', (e) => {
      if (e.key === 'p') this.toggleAnimation();
      if (e.key === 'c') this.clearCircles();
    });
  }

  setupAnimationFrame() {
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  updateDimensions() {
    this.dimensions = {
      height: window.innerHeight,
      width: window.innerWidth
    };
  }

  handleKeyPress(event) {
    const validKeys = ['Space', ' ', 'Enter'];
    if (validKeys.includes(event.key)) {
      event.preventDefault();
      this.createCircle();
    }
  }

  getRandomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 70; // 70-100% saturation
    const l = Math.floor(Math.random() * 30) + 35; // 35-65% lightness
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  getRandomPosition() {
    const size = Math.random() * (this.state.maxSize - this.state.minSize) + this.state.minSize;
    return {
      top: Math.random() * (this.dimensions.height - size),
      left: Math.random() * (this.dimensions.width - size),
      size
    };
  }

  createCircle() {
    if (this.state.circles.length >= this.state.maxCircles) {
      this.state.circles.shift();
    }

    const circle = document.createElement('div');
    const { top, left, size } = this.getRandomPosition();
    const color = this.getRandomColor();

    circle.className = 'circle';
    circle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      top: ${top}px;
      left: ${left}px;
      background-color: ${color};
      border-radius: 50%;
      opacity: 0;
      transform: scale(0);
      transition: all 0.5s ease-out;
    `;

    this.body.appendChild(circle);
    
    // Force reflow
    circle.offsetHeight;
    
    // Animate in
    circle.style.opacity = '0.8';
    circle.style.transform = 'scale(1)';

    // Store circle data
    this.state.circles.push({
      element: circle,
      position: { top, left },
      size,
      color,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      }
    });
  }

  animate() {
    if (this.state.isAnimating) {
      this.state.circles.forEach(circle => {
        const { element, position, velocity, size } = circle;
        
        position.left += velocity.x;
        position.top += velocity.y;

        // Bounce off walls
        if (position.left <= 0 || position.left >= this.dimensions.width - size) {
          velocity.x *= -1;
        }
        if (position.top <= 0 || position.top >= this.dimensions.height - size) {
          velocity.y *= -1;
        }

        element.style.left = `${position.left}px`;
        element.style.top = `${position.top}px`;
      });
    }
    
    requestAnimationFrame(this.animate);
  }

  toggleAnimation() {
    this.state.isAnimating = !this.state.isAnimating;
  }

  clearCircles() {
    this.state.circles.forEach(circle => {
      circle.element.remove();
    });
    this.state.circles = [];
  }
}

// Initialize CircleMaker
new CircleMaker();

