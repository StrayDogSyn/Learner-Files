class CountdownTimer {
  constructor(targetDate) {
    this.validateTargetDate(targetDate);
    this.targetDate = new Date(targetDate).getTime();
    this.interval = null;
    this.animationInterval = null;
    
    // Initialize DOM elements
    this.elements = {
      day: document.getElementById("cDay"),
      hour: document.getElementById("cHr"),
      minute: document.getElementById("cMin"),
      second: document.getElementById("cSec"),
      counters: {
        days: document.querySelectorAll(".day"),
        hours: document.querySelectorAll(".hr"),
        minutes: document.querySelectorAll(".min"),
        seconds: document.querySelectorAll(".sec")
      }
    };

    this.animationElements = [
      this.elements.second,
      this.elements.minute,
      this.elements.hour,
      this.elements.day
    ];

    // Add announcement element
    this.announcementElement = document.getElementById('countdown-announcement');

    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.init();
  }

  validateTargetDate(date) {
    const targetTime = new Date(date).getTime();
    if (isNaN(targetTime)) {
      throw new Error('Invalid target date provided');
    }
    if (targetTime < Date.now()) {
      throw new Error('Target date must be in the future');
    }
  }

  init() {
    // Start countdown when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      this.startCountdown();
      this.startAnimation();
    });

    // Handle visibility change to prevent animation desyncs
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.pauseAnimations();
    } else {
      this.resumeAnimations();
    }
  }

  startCountdown() {
    this.updateDisplay(this.calculateTimeLeft());
    this.interval = setInterval(() => {
      const timeLeft = this.calculateTimeLeft();
      
      if (timeLeft.total <= 0) {
        this.handleCountdownEnd();
        return;
      }

      this.updateDisplay(timeLeft);
    }, 1000);
  }

  calculateTimeLeft() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    return {
      total: distance,
      days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
      minutes: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
      seconds: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
    };
  }

  updateDisplay({ days, hours, minutes, seconds }) {
    this.updateCounters('days', days);
    this.updateCounters('hours', hours);
    this.updateCounters('minutes', minutes);
    this.updateCounters('seconds', seconds);

    // Update screen reader announcement
    if (this.announcementElement) {
      this.announceTimeLeft({ days, hours, minutes, seconds });
    }
  }

  announceTimeLeft({ days, hours, minutes, seconds }) {
    const timeLeft = [];
    if (days > 0) timeLeft.push(`${days} days`);
    if (hours > 0) timeLeft.push(`${hours} hours`);
    if (minutes > 0) timeLeft.push(`${minutes} minutes`);
    if (seconds > 0 || timeLeft.length === 0) timeLeft.push(`${seconds} seconds`);

    this.announcementElement.textContent = `Time remaining: ${timeLeft.join(', ')}`;
  }

  updateCounters(unit, value) {
    const formattedValue = value < 10 ? `0${value}` : value;
    this.elements.counters[unit].forEach(el => {
      if (el.innerText !== formattedValue) {
        el.innerText = formattedValue;
        this.triggerFlipAnimation(el);
      }
    });
  }

  handleCountdownEnd() {
    clearInterval(this.interval);
    clearInterval(this.animationInterval);
    
    // Update display to show all zeros
    this.updateDisplay({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    
    // Add expired animation to all blocks
    this.animationElements.forEach(el => {
      el.classList.add('expired');
    });

    // Dispatch event for external handling
    document.dispatchEvent(new CustomEvent('countdownComplete'));

    if (this.announcementElement) {
      this.announcementElement.textContent = 'Countdown complete!';
    }
  }

  startAnimation() {
    // Clear any existing animation interval
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.animationInterval = setInterval(() => {
      this.updateAnimations();
    }, 1000);
  }

  updateAnimations() {
    const timeLeft = this.calculateTimeLeft();
    
    // Remove active state from all elements
    this.animationElements.forEach(el => {
      el.classList.remove('active');
    });

    // Add active state based on time changes
    if (timeLeft.seconds % 60 === 0) this.elements.minute.classList.add('active');
    if (timeLeft.minutes % 60 === 0 && timeLeft.seconds === 0) this.elements.hour.classList.add('active');
    if (timeLeft.hours % 24 === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) this.elements.day.classList.add('active');
    
    // Always animate seconds
    this.elements.second.classList
    .add('active');
  }

  triggerFlipAnimation(element) {
    const block = element.closest('.block');
    if (block) {
      block.classList.remove('flip');
      // Force reflow
      void block.offsetWidth;
      block.classList.add('flip');
    }
  }

  pauseAnimations() {
    clearInterval(this.animationInterval);
  }

  resumeAnimations() {
    this.startAnimation();
  }

  destroy() {
    clearInterval(this.interval);
    clearInterval(this.animationInterval);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CountdownTimer;
}
