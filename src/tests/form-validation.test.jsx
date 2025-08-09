/**
 * Form Validation Tests
 * Tests for contact forms and other form validations
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock contact form component
const ContactForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    }

    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div data-testid="success-message">
        Thank you for your message! I'll get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form">
      <div>
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <div id="name-error" role="alert" data-testid="name-error">
            {errors.name}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <div id="email-error" role="alert" data-testid="email-error">
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="subject">Subject *</label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        {errors.subject && (
          <div id="subject-error" role="alert" data-testid="subject-error">
            {errors.subject}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <div id="message-error" role="alert" data-testid="message-error">
            {errors.message}
          </div>
        )}
      </div>

      {errors.submit && (
        <div role="alert" data-testid="submit-error">
          {errors.submit}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        data-testid="submit-button"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

describe('Form Validation Tests', () => {
  describe('Contact Form', () => {
    test('renders all required form fields', () => {
      render(<ContactForm />);
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    test('shows validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
      expect(screen.getByTestId('subject-error')).toHaveTextContent('Subject is required');
      expect(screen.getByTestId('message-error')).toHaveTextContent('Message is required');
    });

    test('validates email format', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      expect(screen.getByTestId('email-error')).toHaveTextContent('Please enter a valid email');
    });

    test('accepts valid email formats', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
    });

    test('validates minimum length requirements', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      // Name too short
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'A');
      
      // Subject too short
      const subjectInput = screen.getByLabelText(/subject/i);
      await user.type(subjectInput, 'Hi');
      
      // Message too short
      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, 'Hello');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name must be at least 2 characters');
      expect(screen.getByTestId('subject-error')).toHaveTextContent('Subject must be at least 5 characters');
      expect(screen.getByTestId('message-error')).toHaveTextContent('Message must be at least 10 characters');
    });

    test('clears errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      // Trigger validation errors
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      
      // Start typing in name field
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'John');
      
      expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
    });

    test('successfully submits valid form', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      // Fill in valid data
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Should show loading state
      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
      
      // Should show success message after submission
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    test('disables submit button during submission', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      // Fill in valid data
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
    });

    test('handles special characters in form fields', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      await user.type(screen.getByLabelText(/name/i), 'José María');
      await user.type(screen.getByLabelText(/email/i), 'josé@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Testing & Validation');
      await user.type(screen.getByLabelText(/message/i), 'Message with "quotes" and <tags>');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    test('validates maximum length constraints', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const longText = 'a'.repeat(1000);
      
      await user.type(screen.getByLabelText(/name/i), longText);
      await user.type(screen.getByLabelText(/subject/i), longText);
      await user.type(screen.getByLabelText(/message/i), longText);
      
      const nameInput = screen.getByLabelText(/name/i);
      const subjectInput = screen.getByLabelText(/subject/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      // Check if inputs respect maxLength (if implemented)
      expect(nameInput.value.length).toBeLessThanOrEqual(100);
      expect(subjectInput.value.length).toBeLessThanOrEqual(200);
      expect(messageInput.value.length).toBeLessThanOrEqual(2000);
    });
  });

  describe('Form Accessibility', () => {
    test('has proper ARIA attributes', () => {
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      
      expect(nameInput).toHaveAttribute('aria-invalid', 'false');
      expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    });

    test('updates ARIA attributes on validation errors', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    });

    test('error messages have proper role', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      const nameError = screen.getByTestId('name-error');
      expect(nameError).toHaveAttribute('role', 'alert');
    });

    test('form can be navigated with keyboard', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const subjectInput = screen.getByLabelText(/subject/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Tab through form
      await user.tab();
      expect(nameInput).toHaveFocus();
      
      await user.tab();
      expect(emailInput).toHaveFocus();
      
      await user.tab();
      expect(subjectInput).toHaveFocus();
      
      await user.tab();
      expect(messageInput).toHaveFocus();
      
      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Form Performance', () => {
    test('validates form quickly', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const startTime = performance.now();
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      const endTime = performance.now();
      
      // Validation should complete quickly
      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
    });

    test('handles rapid typing without lag', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText(/name/i);
      
      const startTime = performance.now();
      await user.type(nameInput, 'John Doe');
      const endTime = performance.now();
      
      // Typing should be responsive
      expect(endTime - startTime).toBeLessThan(1000);
      expect(nameInput).toHaveValue('John Doe');
    });
  });

  describe('Edge Cases', () => {
    test('handles paste events', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText(/name/i);
      nameInput.focus();
      
      await user.paste('Pasted Name');
      expect(nameInput).toHaveValue('Pasted Name');
    });

    test('handles form reset', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      
      // Simulate form reset
      fireEvent.reset(screen.getByTestId('contact-form'));
      
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });

    test('prevents multiple simultaneous submissions', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      // Fill valid data
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'Test message');
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Click multiple times rapidly
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);
      
      // Should only submit once
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
    });
  });
});
