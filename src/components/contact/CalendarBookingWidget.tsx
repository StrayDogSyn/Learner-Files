import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface BookingData {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  duration: string;
  meetingType: string;
  notes?: string;
}

interface CalendarBookingWidgetProps {
  onBookingSubmit?: (booking: BookingData) => void;
  className?: string;
  availableHours?: { start: number; end: number };
  excludedDates?: string[];
  timeSlotDuration?: number;
}

const CalendarBookingWidget: React.FC<CalendarBookingWidgetProps> = ({
  onBookingSubmit,
  className = '',
  availableHours = { start: 9, end: 17 },
  excludedDates = [],
  timeSlotDuration = 30
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    duration: '30',
    meetingType: 'consultation',
    notes: ''
  });
  const [step, setStep] = useState<'calendar' | 'time' | 'details' | 'confirmation'>('calendar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const selectedDateObj = new Date(date);
    const today = new Date();
    const isToday = selectedDateObj.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    for (let hour = availableHours.start; hour < availableHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += timeSlotDuration) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotTime = hour + minute / 60;
        
        // Check if slot is in the past for today
        const isPast = isToday && (hour < currentHour || (hour === currentHour && minute <= currentMinute));
        
        // Simulate some booked slots (in real app, this would come from API)
        const isBooked = Math.random() < 0.3;
        
        slots.push({
          id: `${date}-${timeString}`,
          time: timeString,
          available: !isPast && !isBooked
        });
      }
    }

    return slots;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    if (checkDate < today) return false;
    
    // Check if date is a weekend (optional - can be configured)
    const dayOfWeek = checkDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;
    
    // Check if date is in excluded dates
    const dateString = checkDate.toISOString().split('T')[0];
    if (excludedDates.includes(dateString)) return false;
    
    return true;
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateAvailable(date)) return;
    
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setBookingData(prev => ({ ...prev, date: dateString }));
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingData(prev => ({ ...prev, time }));
    setStep('details');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onBookingSubmit?.(bookingData);
      setSubmitStatus('success');
      setStep('confirmation');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const resetBooking = () => {
    setStep('calendar');
    setSelectedDate('');
    setSelectedTime('');
    setBookingData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      duration: '30',
      meetingType: 'consultation',
      notes: ''
    });
    setSubmitStatus('idle');
  };

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const days = getDaysInMonth(currentDate);
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glassmorphic-card p-8 rounded-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Schedule a Consultation
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Book a free consultation to discuss your project needs
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {['calendar', 'time', 'details', 'confirmation'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  step === stepName
                    ? 'bg-blue-600 text-white'
                    : index < ['calendar', 'time', 'details', 'confirmation'].indexOf(step)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {index < ['calendar', 'time', 'details', 'confirmation'].indexOf(step) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                    index < ['calendar', 'time', 'details', 'confirmation'].indexOf(step)
                      ? 'bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Calendar Step */}
          {step === 'calendar' && (
            <motion.div
              key="calendar"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Date
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose an available date for your consultation
                </p>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => (
                  <motion.button
                    key={index}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day || !isDateAvailable(day)}
                    whileHover={day && isDateAvailable(day) ? { scale: 1.05 } : {}}
                    whileTap={day && isDateAvailable(day) ? { scale: 0.95 } : {}}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all duration-200 ${
                      !day
                        ? 'invisible'
                        : !isDateAvailable(day)
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : selectedDate === day.toISOString().split('T')[0]
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    {day?.getDate()}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Time Selection Step */}
          {step === 'time' && (
            <motion.div
              key="time"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Time
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Available time slots for {new Date(selectedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {timeSlots.map(slot => (
                  <motion.button
                    key={slot.id}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    whileHover={slot.available ? { scale: 1.05 } : {}}
                    whileTap={slot.available ? { scale: 0.95 } : {}}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      !slot.available
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : selectedTime === slot.time
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {slot.time}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setStep('calendar')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Calendar
              </button>
            </motion.div>
          )}

          {/* Details Step */}
          {step === 'details' && (
            <motion.div
              key="details"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Your Details
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="inline w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg glassmorphic-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg glassmorphic-input"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg glassmorphic-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="inline w-4 h-4 mr-2" />
                      Duration
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      value={bookingData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg glassmorphic-input"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Type
                  </label>
                  <select
                    id="meetingType"
                    name="meetingType"
                    value={bookingData.meetingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg glassmorphic-input"
                  >
                    <option value="consultation">Free Consultation</option>
                    <option value="project-discussion">Project Discussion</option>
                    <option value="technical-review">Technical Review</option>
                    <option value="follow-up">Follow-up Meeting</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={bookingData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg glassmorphic-input resize-none"
                    placeholder="Tell me about your project or any specific topics you'd like to discuss..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep('time')}
                    className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    ← Back to Time
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Confirmation Step */}
          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your consultation has been scheduled successfully.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Details</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>Date:</strong> {new Date(bookingData.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {bookingData.time}</p>
                  <p><strong>Duration:</strong> {bookingData.duration} minutes</p>
                  <p><strong>Type:</strong> {bookingData.meetingType}</p>
                  <p><strong>Name:</strong> {bookingData.name}</p>
                  <p><strong>Email:</strong> {bookingData.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A calendar invitation and confirmation email will be sent to {bookingData.email}
                </p>
                <button
                  onClick={resetBooking}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Book Another Meeting
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CalendarBookingWidget;