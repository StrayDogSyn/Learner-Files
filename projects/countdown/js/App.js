class CountdownTimer {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate).getTime();
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

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.startCountdown();
      this.startAnimation();
    });
  }

  startCountdown() {
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
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
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
      el.innerText = formattedValue;
    });
  }

  handleCountdownEnd() {
    clearInterval(this.interval);
    Object.values(this.elements.counters).forEach(counters => {
      counters.forEach(el => {
        el.innerText = "00";
      });
    });
  }

  startAnimation() {
    setTimeout(() => {
      setInterval(() => {
        // Reset all animations
        this.animationElements.forEach(el => {
          el.classList.remove("active");
        });

        // Apply animations based on current state
        this.updateAnimations();
      }, 1000);
    }, 500);
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
    element.classList.add("active");
    element.firstElementChild.classList.add("active");
  }
}

// Initialize with target date
new CountdownTimer('Sep 30, 2024');
