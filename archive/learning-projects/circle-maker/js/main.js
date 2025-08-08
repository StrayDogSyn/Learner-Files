class CircleMaker {
  constructor() {
    this.body = document.querySelector('body');
    this.canvasArea = document.getElementById('canvas-area');
    this.circleCount = document.getElementById('circleCount');
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
    this.updateCircleCount();
  }

  attachEventListeners() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    window.addEventListener('resize', () => this.updateDimensions());
    
    // Mouse/touch controls
    this.canvasArea.addEventListener('click', (e) => this.createCircleAtPosition(e));
    this.canvasArea.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.createCircleAtPosition(e.touches[0]);
    });
    
    // Button controls
    document.getElementById('createBtn').addEventListener('click', () => this.createCircle());
    document.getElementById('animateBtn').addEventListener('click', () => this.toggleAnimation());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearCircles());
    
    // Animation controls
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'p') this.toggleAnimation();
      if (e.key.toLowerCase() === 'c') this.clearCircles();
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

  createCircleAtPosition(event) {
    const rect = this.canvasArea.getBoundingClientRect();
    const x = (event.clientX || event.pageX) - rect.left;
    const y = (event.clientY || event.pageY) - rect.top;
    this.createCircle(x, y);
  }

  updateCircleCount() {
    if (this.circleCount) {
      this.circleCount.textContent = this.state.circles.length;
    }
  }

  getRandomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 70; // 70-100% saturation
    const l = Math.floor(Math.random() * 30) + 35; // 35-65% lightness
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  getRandomPosition(x = null, y = null) {
    const size = Math.random() * (this.state.maxSize - this.state.minSize) + this.state.minSize;
    return {
      top: y !== null ? Math.max(0, Math.min(y - size/2, this.dimensions.height - size)) : Math.random() * (this.dimensions.height - size),
      left: x !== null ? Math.max(0, Math.min(x - size/2, this.dimensions.width - size)) : Math.random() * (this.dimensions.width - size),
      size
    };
  }

  createCircle(x = null, y = null) {
    if (this.state.circles.length >= this.state.maxCircles) {
      const oldCircle = this.state.circles.shift();
      oldCircle.element.remove();
    }

    const circle = document.createElement('div');
    const { top, left, size } = this.getRandomPosition(x, y);
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
      cursor: pointer;
    `;

    // Add click to remove functionality
    circle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeCircle(circle);
    });

    this.canvasArea.appendChild(circle);
    
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

    this.updateCircleCount();
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
  removeCircle(circleElement) {
    const index = this.state.circles.findIndex(c => c.element === circleElement);
    if (index !== -1) {
      circleElement.style.opacity = '0';
      circleElement.style.transform = 'scale(0)';
      setTimeout(() => {
        circleElement.remove();
        this.state.circles.splice(index, 1);
        this.updateCircleCount();
      }, 500);
    }
  }

  toggleAnimation() {
    this.state.isAnimating = !this.state.isAnimating;
    const animateBtn = document.getElementById('animateBtn');
    const icon = animateBtn.querySelector('i');
    
    if (this.state.isAnimating) {
      icon.className = 'fa fa-pause me-1';
      animateBtn.classList.add('btn-success');
      animateBtn.classList.remove('btn-warning');
    } else {
      icon.className = 'fa fa-play me-1';
      animateBtn.classList.add('btn-warning');
      animateBtn.classList.remove('btn-success');
    }
  }

  clearCircles() {
    this.state.circles.forEach(circle => {
      circle.element.style.opacity = '0';
      circle.element.style.transform = 'scale(0)';
      setTimeout(() => circle.element.remove(), 500);
    });
    this.state.circles = [];
    this.updateCircleCount();
  }
}

// Initialize CircleMaker
new CircleMaker();

