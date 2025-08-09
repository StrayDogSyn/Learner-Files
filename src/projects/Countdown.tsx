import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Countdown.css';
import { PerformanceOverlay } from '../components/portfolio/PerformanceOverlay';
import { CaseStudyCard } from '../components/portfolio/CaseStudyCard';
import { FeedbackCollector } from '../components/portfolio/FeedbackCollector';
import { TechnicalChallenge } from '../components/portfolio/TechnicalChallenge';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { getProjectMetrics } from '../data/projectMetrics';
import { getArchitectureById } from '../data/architectureDiagrams';

interface TimeLeft {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate?: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [title, setTitle] = useState("We're almost free at last...");
  const [announcement, setAnnouncement] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const targetDateRef = useRef<number>(0);
  
  // Performance tracking
  const { metrics, startTracking, stopTracking } = usePerformanceMetrics({
    trackingInterval: 1000,
    enableMemoryTracking: true,
    enableUserInteractionTracking: true
  });
  
  // Project data
  const projectData = getProjectMetrics('countdown');
  const architectureData = getArchitectureById('countdown');
  
  // Animation refs for flip effects
  const dayRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  const validateAndSetTargetDate = useCallback((date?: Date) => {
    let target: Date;
    
    if (date) {
      target = new Date(date);
    } else {
      // Default to May 4, 2026
      target = new Date('May 4, 2026 00:00:00');
    }
    
    const targetTime = target.getTime();
    
    if (isNaN(targetTime)) {
      console.warn('Invalid target date provided, using default');
      target = new Date();
      target.setDate(target.getDate() + 100);
    }
    
    if (targetTime < Date.now()) {
      console.warn('Target date is in the past, using a date 100 days from now');
      target = new Date();
      target.setDate(target.getDate() + 100);
    }
    
    targetDateRef.current = target.getTime();
  }, []);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const distance = targetDateRef.current - now;

    return {
      total: distance,
      days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
      minutes: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
      seconds: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
    };
  }, []);

  const announceTimeLeft = useCallback((time: TimeLeft) => {
    const timeLeftArray = [];
    if (time.days > 0) timeLeftArray.push(`${time.days} days`);
    if (time.hours > 0) timeLeftArray.push(`${time.hours} hours`);
    if (time.minutes > 0) timeLeftArray.push(`${time.minutes} minutes`);
    if (time.seconds > 0 || timeLeftArray.length === 0) timeLeftArray.push(`${time.seconds} seconds`);

    setAnnouncement(`Time remaining: ${timeLeftArray.join(', ')}`);
  }, []);

  const triggerFlipAnimation = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      const block = element.closest('.block');
      if (block) {
        block.classList.remove('flip');
        // Force reflow
        void block.getBoundingClientRect();
        block.classList.add('flip');
        
        // Remove flip class after animation completes
        setTimeout(() => {
          block.classList.remove('flip');
        }, 600);
      }
    }
  }, []);

  const updateAnimations = useCallback(() => {
    const time = calculateTimeLeft();
    
    // Apply flip animation
    if (time.seconds % 60 === 0 && minuteRef.current) {
      minuteRef.current.classList.add('active');
    }
    if (time.minutes % 60 === 0 && time.seconds === 0 && hourRef.current) {
      hourRef.current.classList.add('active');
    }
    if (time.hours % 24 === 0 && time.minutes === 0 && time.seconds === 0 && dayRef.current) {
      dayRef.current.classList.add('active');
    }
    
    // Always animate seconds
    if (secondRef.current) {
      secondRef.current.classList.add('active');
    }
    
    // Reset animations after 600ms to prepare for next second
    setTimeout(() => {
      [dayRef, hourRef, minuteRef, secondRef].forEach(ref => {
        if (ref.current) {
          ref.current.classList.remove('active');
        }
      });
    }, 600);
  }, [calculateTimeLeft]);

  const handleCountdownEnd = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    
    setIsExpired(true);
    setTitle("We are free at last!");
    setAnnouncement('Countdown complete!');
    
    // Add expired animation to all blocks
    [dayRef, hourRef, minuteRef, secondRef].forEach(ref => {
      if (ref.current) {
        ref.current.classList.add('expired');
      }
    });
    
    // Dispatch custom event
    const event = new CustomEvent('countdownComplete');
    document.dispatchEvent(event);
  }, []);

  const startCountdown = useCallback(() => {
    const updateTimer = () => {
      const time = calculateTimeLeft();
      
      if (time.total <= 0) {
        handleCountdownEnd();
        return;
      }

      setTimeLeft(time);
      
      // Update screen reader announcement every minute
      if (time.seconds === 0) {
        announceTimeLeft(time);
      }
    };
    
    updateTimer(); // Initial update
    intervalRef.current = setInterval(updateTimer, 1000);
  }, [calculateTimeLeft, handleCountdownEnd, announceTimeLeft]);

  const startAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    animationIntervalRef.current = setInterval(() => {
      updateAnimations();
    }, 1000);
  }, [updateAnimations]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    } else {
      startAnimation();
    }
  }, [startAnimation]);

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [startTracking, stopTracking]);
  
  useEffect(() => {
    validateAndSetTargetDate(targetDate);
    startCountdown();
    startAnimation();
    
    // Handle visibility change to prevent animation desyncs
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [targetDate, validateAndSetTargetDate, startCountdown, startAnimation, handleVisibilityChange]);

  const formatValue = (value: number): string => {
    return value < 10 ? `0${value}` : value.toString();
  };

  const TimeBlock: React.FC<{ value: number; label: string; elementRef: React.RefObject<HTMLDivElement> }> = ({ 
    value, 
    label, 
    elementRef 
  }) => {
    const formattedValue = formatValue(value);
    
    return (
      <div className="time-item">
        <div className="block" aria-label={label}>
          <div className="block-top" ref={elementRef}>
            <h2 aria-hidden="true">{formattedValue}</h2>
          </div>
          <div className="block-bottom">
            <h2 aria-hidden="true">{formattedValue}</h2>
          </div>
          <hr />
        </div>
        <h3>{label}</h3>
      </div>
    );
  };

  return (
    <div className="countdown-container">
      <PerformanceOverlay metrics={metrics} />
      <FeedbackCollector projectName="Countdown Timer" />
      
      {/* Case Study Card - shown when countdown is not expired */}
      {!isExpired && projectData && (
        <div className="case-study-overlay" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, maxWidth: '400px' }}>
          <CaseStudyCard 
            project={projectData}
            className="mb-4"
          />
        </div>
      )}
      
      {/* Technical Challenge Component - shown when countdown is not expired */}
      {!isExpired && architectureData && (
        <div className="case-study-overlay">
          <TechnicalChallenge 
            architecture={architectureData}
            className="mb-4"
          />
        </div>
      )}
      
      <nav className="navbar navbar-expand-lg navbar-dark" role="navigation">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img 
              src="/assets/logos/stray-gear.png" 
              width="40" 
              height="40" 
              className="d-inline-block align-top rounded-circle" 
              alt="StrayDog Logo"
            />
            <h3 className="ms-3 mb-0">
              <i className="fa fa-clock" aria-hidden="true"></i> Countdown Timer
            </h3>
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <i className="fa fa-home" aria-hidden="true"></i> 
                  <span>Home</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/projects">
                  <i className="fa fa-code" aria-hidden="true"></i>
                  <span>Projects</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contacts">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="pad" role="main">
        <h1>{title}</h1>
        <section className="time" aria-label="Countdown Timer">
          <TimeBlock 
            value={timeLeft.days} 
            label="days" 
            elementRef={dayRef}
          />
          <TimeBlock 
            value={timeLeft.hours} 
            label="hours" 
            elementRef={hourRef}
          />
          <TimeBlock 
            value={timeLeft.minutes} 
            label="minutes" 
            elementRef={minuteRef}
          />
          <TimeBlock 
            value={timeLeft.seconds} 
            label="seconds" 
            elementRef={secondRef}
          />
        </section>

        <div className="social" aria-label="Social Links">
          <a href="#" aria-label="Visit our Facebook page">
            <i className="fab fa-facebook-square" aria-hidden="true"></i>
          </a>
          <a href="#" aria-label="Visit our Pinterest page">
            <i className="fab fa-pinterest" aria-hidden="true"></i>
          </a>
          <a href="#" aria-label="Visit our Instagram page">
            <i className="fab fa-instagram" aria-hidden="true"></i>
          </a>
        </div>
      </main>

      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
};

export default Countdown;