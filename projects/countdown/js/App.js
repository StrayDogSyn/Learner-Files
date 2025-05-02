class CountdownTimer {
  constructor(targetDate) {
    this.validateTargetDate(targetDate);
    this.targetDate = new Date(targetDate).getTime();
    this.interval = null;
    
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
      this.elements.second.firstElementChild,
      this.elements.minute,
      this.elements.minute.firstElementChild,
      this.elements.hour,
      this.elements.hour.firstElementChild,
      this.elements.day,
      this.elements.day.firstElementChild
    ];

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
    document.addEventListener('DOMContentLoaded', () => {
      this.startCountdown();
      this.startAnimation();
    });

    // Handle visibility change to prevent animation desyncs
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
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
  }

  updateCounters(unit, value) {
    const formattedValue = value < 10 ? `0${value}` : value;
    this.elements.counters[unit].forEach(el => {
      if (el.innerText !== formattedValue) {
        el.innerText = formattedValue;
        this.triggerAnimation(el);
      }
    });
  }

  handleCountdownEnd() {
    clearInterval(this.interval);
    this.updateDisplay({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    
    // Trigger final animation
    this.animationElements.forEach(el => {
      this.activateElement(el);
    });

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('countdownComplete'));
  }

  startAnimation() {
    this.animationInterval = setInterval(() => {
      this.resetAnimations();
      this.updateAnimations();
    }, 1000);
  }

  pauseAnimations() {
    clearInterval(this.animationInterval);
  }

  resumeAnimations() {
    this.startAnimation();
  }

  resetAnimations() {
    this.animationElements.forEach(el => {
      el.classList.remove("active");
    });
  }

  updateAnimations() {
    const { seconds, minutes, hours } = this.elements.counters;
    
    if (seconds[0].innerText !== "00") {
      this.activateElement(this.elements.second);
    }

    if (seconds[0].innerText === "00") {
      this.activateElement(this.elements.minute);
    }

    if (minutes[0].innerText === "00" && seconds[0].innerText === "00") {
      this.activateElement(this.elements.hour);
    }

    if (hours[0].innerText === "00" && 
        minutes[0].innerText === "00" && 
        seconds[0].innerText === "00") {
      this.activateElement(this.elements.day);
    }
  }

  activateElement(element) {
    if (!element) return;
    
    element.classList.add("active");
    if (element.firstElementChild) {
      element.firstElementChild.classList.add("active");
    }
  }

  triggerAnimation(element) {
    element.classList.add('flip');
    setTimeout(() => {
      element.classList.remove('flip');
    }, 300);
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
