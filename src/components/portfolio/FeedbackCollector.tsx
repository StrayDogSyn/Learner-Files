import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, X, Send } from 'lucide-react';
import { useFeedbackCollection } from '../../hooks/useFeedbackCollection';

interface FeedbackCollectorProps {
  projectName: string;
  className?: string;
}

export const FeedbackCollector: React.FC<FeedbackCollectorProps> = ({ 
  projectName, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  
  const { submitFeedback, isSubmitting } = useFeedbackCollection();

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
    if (starRating >= 4) {
      // For high ratings, just submit without modal
      handleSubmitFeedback(starRating, '');
    } else {
      // For lower ratings, show modal for additional feedback
      setShowModal(true);
    }
  };

  const handleSubmitFeedback = async (finalRating: number, text: string) => {
    try {
      await submitFeedback({
        projectName,
        rating: finalRating,
        feedback: text,
        timestamp: new Date().toISOString()
      });
      
      setShowThankYou(true);
      setShowModal(false);
      setIsOpen(false);
      
      // Reset after showing thank you
      setTimeout(() => {
        setShowThankYou(false);
        setRating(0);
        setFeedback('');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleModalSubmit = () => {
    handleSubmitFeedback(rating, feedback);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="
            relative overflow-hidden rounded-full p-4
            bg-gradient-to-br from-white/20 to-white/5
            backdrop-blur-xl border border-white/20
            shadow-2xl hover:shadow-green-500/20
            transition-all duration-300
            group
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare 
            className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" 
          />
          
          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-green-400/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        {/* Rating Stars */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="
                absolute bottom-16 right-0 p-4 rounded-2xl
                bg-gradient-to-br from-white/20 to-white/5
                backdrop-blur-xl border border-white/20
                shadow-2xl min-w-[200px]
              "
            >
              <p className="text-white/90 text-sm mb-3 font-medium">
                Rate {projectName}
              </p>
              
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/40'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative w-full max-w-md p-6 rounded-3xl
                bg-gradient-to-br from-gray-900/95 to-gray-800/95
                backdrop-blur-xl border border-white/20
                shadow-2xl
              "
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="
                  absolute top-4 right-4 p-2 rounded-full
                  hover:bg-white/10 transition-colors
                "
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Help us improve {projectName}
                </h3>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Feedback Input */}
              <div className="mb-6">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  What could we improve?
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Your feedback helps us make this better..."
                  className="
                    w-full h-24 p-3 rounded-xl resize-none
                    bg-white/10 border border-white/20
                    text-white placeholder-white/50
                    focus:outline-none focus:ring-2 focus:ring-green-400/50
                    transition-all
                  "
                />
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleModalSubmit}
                disabled={isSubmitting}
                className="
                  w-full py-3 px-4 rounded-xl font-medium
                  bg-gradient-to-r from-green-500 to-green-600
                  hover:from-green-400 hover:to-green-500
                  text-white shadow-lg hover:shadow-green-500/25
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thank You Message */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="
              fixed bottom-6 left-6 z-50 p-4 rounded-2xl
              bg-gradient-to-br from-green-500/90 to-green-600/90
              backdrop-blur-xl border border-green-400/30
              shadow-2xl text-white
            "
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              </div>
              <div>
                <p className="font-medium">Thank you!</p>
                <p className="text-sm text-white/80">Your feedback helps us improve</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackCollector;