class CircleMaker {
  constructor() {
    this.body = document.querySelector('body');
    this.dimensions = {
      height: window.innerHeight,
      width: window.innerWidth
    };
    
    this.init();
  }

  init() {
    window.addEventListener('keydown', () => this.createCircle());
    window.addEventListener('resize', () => this.updateDimensions());
  }

  updateDimensions() {
    this.dimensions = {
      height: window.innerHeight,
      width: window.innerWidth
    };
  }

  getRandomColor() {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
  }

  getRandomPosition() {
    return {
      top: Math.random() * this.dimensions.height,
      left: Math.random() * this.dimensions.width
    };
  }

  createCircle() {
    const circle = document.createElement('div');
    const { r, g, b } = this.getRandomColor();
    const { top, left } = this.getRandomPosition();
    
    circle.className = 'ball';
    circle.style.cssText = `
      top: ${top}px; 
      left: ${left}px; 
      background-color: rgb(${r}, ${g}, ${b});
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s ease-out;
    `;

    this.body.appendChild(circle);

    // Trigger animation after a brief delay
    requestAnimationFrame(() => {
      circle.style.opacity = '1';
      circle.style.transform = 'scale(1)';
    });

    // Clean up circles after animation to prevent memory leaks
    setTimeout(() => {
      circle.style.opacity = '0';
      circle.style.transform = 'scale(0)';
      
      // Remove from DOM after fade out
      setTimeout(() => circle.remove(), 300);
    }, 2000);
  }
}

// Initialize the CircleMaker
new CircleMaker();

