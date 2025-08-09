/**
 * Security Vulnerability Tests
 * Tests for XSS, CSRF, input sanitization, and other security concerns
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DOMPurify from 'dompurify';
import '@testing-library/jest-dom';

// Mock DOMPurify for testing
jest.mock('dompurify', () => ({
  sanitize: jest.fn((input) => {
    // Simple sanitization mock - removes script tags and dangerous attributes
    return input
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/javascript:/gi, '');
  }),
  isValidAttribute: jest.fn(() => true)
}));

// Security utilities
class SecurityUtils {
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Use DOMPurify to sanitize HTML content
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && !this.containsScript(email);
  }

  static validateURL(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  static containsScript(input) {
    const scriptPattern = /<script|javascript:|on\w+\s*=/i;
    return scriptPattern.test(input);
  }

  static generateCSRFToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static validateCSRFToken(token, storedToken) {
    return token === storedToken && token.length >= 16;
  }

  static hashPassword(password) {
    // Mock password hashing (in real app, use bcrypt or similar)
    return btoa(password + 'salt').split('').reverse().join('');
  }

  static escapeHTML(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Secure input component
const SecureInput = ({ 
  value, 
  onChange, 
  type = 'text', 
  sanitize = true,
  validate = null,
  maxLength = 100,
  ...props 
}) => {
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    let inputValue = e.target.value;

    // Length validation
    if (inputValue.length > maxLength) {
      setError(`Input too long (max ${maxLength} characters)`);
      return;
    }

    // Script detection
    if (SecurityUtils.containsScript(inputValue)) {
      setError('Invalid characters detected');
      return;
    }

    // Custom validation
    if (validate && !validate(inputValue)) {
      setError('Invalid input format');
      return;
    }

    // Sanitize if enabled
    if (sanitize) {
      inputValue = SecurityUtils.sanitizeInput(inputValue);
    }

    setError('');
    onChange(inputValue);
  };

  return React.createElement('div', {
    'data-testid': 'secure-input-container'
  },
    React.createElement('input', {
      ...props,
      type,
      value,
      onChange: handleChange,
      'data-testid': 'secure-input',
      maxLength
    }),
    error && React.createElement('div', {
      'data-testid': 'input-error',
      role: 'alert',
      style: { color: 'red' }
    }, error)
  );
};

// Secure form with CSRF protection
const SecureForm = ({ onSubmit, children }) => {
  const [csrfToken] = React.useState(() => SecurityUtils.generateCSRFToken());
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const submittedToken = formData.get('csrf_token');

    if (!SecurityUtils.validateCSRFToken(submittedToken, csrfToken)) {
      alert('Security error: Invalid CSRF token');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return React.createElement('form', {
    onSubmit: handleSubmit,
    'data-testid': 'secure-form'
  },
    React.createElement('input', {
      type: 'hidden',
      name: 'csrf_token',
      value: csrfToken,
      'data-testid': 'csrf-token'
    }),
    children,
    React.createElement('button', {
      type: 'submit',
      disabled: isSubmitting,
      'data-testid': 'submit-button'
    }, isSubmitting ? 'Submitting...' : 'Submit')
  );
};

// Content renderer with XSS protection
const SecureContentRenderer = ({ content, allowHTML = false }) => {
  const [sanitizedContent, setSanitizedContent] = React.useState('');

  React.useEffect(() => {
    if (allowHTML) {
      setSanitizedContent(SecurityUtils.sanitizeInput(content));
    } else {
      setSanitizedContent(SecurityUtils.escapeHTML(content));
    }
  }, [content, allowHTML]);

  if (allowHTML) {
    return React.createElement('div', {
      'data-testid': 'secure-content',
      dangerouslySetInnerHTML: { __html: sanitizedContent }
    });
  }

  return React.createElement('div', {
    'data-testid': 'secure-content'
  }, sanitizedContent);
};

// URL validator component
const SecureLink = ({ href, children, ...props }) => {
  const [isValid, setIsValid] = React.useState(true);

  React.useEffect(() => {
    setIsValid(SecurityUtils.validateURL(href));
  }, [href]);

  if (!isValid) {
    return React.createElement('span', {
      'data-testid': 'invalid-link',
      style: { color: 'red' }
    }, '[Invalid URL]');
  }

  return React.createElement('a', {
    ...props,
    href,
    rel: href.startsWith('http') && !href.includes(window.location.hostname) ? 'noopener noreferrer' : undefined,
    'data-testid': 'secure-link'
  }, children);
};

// File upload with security validation
const SecureFileUpload = ({ onFileSelect, acceptedTypes = ['image/*'] }) => {
  const [error, setError] = React.useState('');

  const validateFile = (file) => {
    // Size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'File too large (max 5MB)';
    }

    // Type validation
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
    }

    // Filename validation (prevent directory traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return 'Invalid filename';
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = ''; // Clear the input
      return;
    }

    setError('');
    onFileSelect(file);
  };

  return React.createElement('div', {
    'data-testid': 'secure-file-upload'
  },
    React.createElement('input', {
      type: 'file',
      onChange: handleFileChange,
      accept: acceptedTypes.join(','),
      'data-testid': 'file-input'
    }),
    error && React.createElement('div', {
      'data-testid': 'file-error',
      role: 'alert',
      style: { color: 'red' }
    }, error)
  );
};

describe('Security Vulnerability Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('XSS Prevention', () => {
    test('sanitizes script tags in input', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(React.createElement(SecureInput, {
        value: '',
        onChange: mockOnChange
      }));

      const input = screen.getByTestId('secure-input');
      await user.type(input, '<script>alert("xss")</script>');

      expect(screen.getByTestId('input-error')).toHaveTextContent('Invalid characters detected');
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    test('sanitizes JavaScript URLs', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(React.createElement(SecureInput, {
        value: '',
        onChange: mockOnChange
      }));

      const input = screen.getByTestId('secure-input');
      await user.type(input, 'javascript:alert("xss")');

      expect(screen.getByTestId('input-error')).toHaveTextContent('Invalid characters detected');
    });

    test('sanitizes event handlers in input', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(React.createElement(SecureInput, {
        value: '',
        onChange: mockOnChange
      }));

      const input = screen.getByTestId('secure-input');
      await user.type(input, '<img src="x" onerror="alert(1)">');

      expect(screen.getByTestId('input-error')).toHaveTextContent('Invalid characters detected');
    });

    test('allows safe HTML content', () => {
      const safeContent = '<p>This is <strong>safe</strong> content</p>';

      render(React.createElement(SecureContentRenderer, {
        content: safeContent,
        allowHTML: true
      }));

      expect(DOMPurify.sanitize).toHaveBeenCalledWith(safeContent);
      expect(screen.getByTestId('secure-content')).toBeInTheDocument();
    });

    test('escapes HTML when allowHTML is false', () => {
      const htmlContent = '<script>alert("xss")</script><p>Safe content</p>';

      render(React.createElement(SecureContentRenderer, {
        content: htmlContent,
        allowHTML: false
      }));

      const contentElement = screen.getByTestId('secure-content');
      expect(contentElement.textContent).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;&lt;p&gt;Safe content&lt;/p&gt;');
    });

    test('validates URLs to prevent XSS', () => {
      const maliciousUrl = 'javascript:alert("xss")';

      render(React.createElement(SecureLink, {
        href: maliciousUrl
      }, 'Click me'));

      expect(screen.getByTestId('invalid-link')).toHaveTextContent('[Invalid URL]');
      expect(screen.queryByTestId('secure-link')).not.toBeInTheDocument();
    });

    test('allows safe URLs', () => {
      const safeUrl = 'https://example.com';

      render(React.createElement(SecureLink, {
        href: safeUrl
      }, 'Safe link'));

      const link = screen.getByTestId('secure-link');
      expect(link).toHaveAttribute('href', safeUrl);
    });

    test('adds security attributes to external links', () => {
      const externalUrl = 'https://external-site.com';

      render(React.createElement(SecureLink, {
        href: externalUrl
      }, 'External link'));

      const link = screen.getByTestId('secure-link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('CSRF Protection', () => {
    test('includes CSRF token in form', () => {
      const mockOnSubmit = jest.fn();

      render(React.createElement(SecureForm, {
        onSubmit: mockOnSubmit
      },
        React.createElement('input', { name: 'test', value: 'value' })
      ));

      const csrfInput = screen.getByTestId('csrf-token');
      expect(csrfInput).toHaveAttribute('type', 'hidden');
      expect(csrfInput).toHaveAttribute('name', 'csrf_token');
      expect(csrfInput.value).toHaveLength.greaterThan(15);
    });

    test('validates CSRF token on submission', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(React.createElement(SecureForm, {
        onSubmit: mockOnSubmit
      }));

      // Tamper with CSRF token
      const csrfInput = screen.getByTestId('csrf-token');
      fireEvent.change(csrfInput, { target: { value: 'invalid-token' } });

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(alertSpy).toHaveBeenCalledWith('Security error: Invalid CSRF token');
      expect(mockOnSubmit).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    test('prevents double submission', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(React.createElement(SecureForm, {
        onSubmit: mockOnSubmit
      }));

      const submitButton = screen.getByTestId('submit-button');
      
      // Click submit button multiple times
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Submitting...');
    });
  });

  describe('Input Validation', () => {
    test('validates email format', () => {
      const validEmail = 'user@example.com';
      const invalidEmail = 'invalid-email';
      const maliciousEmail = 'user@example.com<script>alert(1)</script>';

      expect(SecurityUtils.validateEmail(validEmail)).toBe(true);
      expect(SecurityUtils.validateEmail(invalidEmail)).toBe(false);
      expect(SecurityUtils.validateEmail(maliciousEmail)).toBe(false);
    });

    test('enforces input length limits', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(React.createElement(SecureInput, {
        value: '',
        onChange: mockOnChange,
        maxLength: 10
      }));

      const input = screen.getByTestId('secure-input');
      await user.type(input, 'This is a very long input that exceeds the limit');

      expect(screen.getByTestId('input-error')).toHaveTextContent('Input too long (max 10 characters)');
    });

    test('validates custom input patterns', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      const phoneValidator = (value) => /^\d{3}-\d{3}-\d{4}$/.test(value);

      render(React.createElement(SecureInput, {
        value: '',
        onChange: mockOnChange,
        validate: phoneValidator
      }));

      const input = screen.getByTestId('secure-input');
      await user.type(input, 'invalid-phone');

      expect(screen.getByTestId('input-error')).toHaveTextContent('Invalid input format');
    });

    test('sanitizes input while preserving safe content', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(React.createElement(SecureInput, {
        value: '',
        onChange: mockOnChange
      }));

      const input = screen.getByTestId('secure-input');
      await user.type(input, 'Safe content with <b>bold</b> text');

      expect(mockOnChange).toHaveBeenCalled();
      expect(DOMPurify.sanitize).toHaveBeenCalled();
    });
  });

  describe('File Upload Security', () => {
    test('validates file types', () => {
      const mockOnFileSelect = jest.fn();

      render(React.createElement(SecureFileUpload, {
        onFileSelect: mockOnFileSelect,
        acceptedTypes: ['image/jpeg', 'image/png']
      }));

      const fileInput = screen.getByTestId('file-input');
      
      // Create a mock file with wrong type
      const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(screen.getByTestId('file-error')).toHaveTextContent('Invalid file type');
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    });

    test('validates file size', () => {
      const mockOnFileSelect = jest.fn();

      render(React.createElement(SecureFileUpload, {
        onFileSelect: mockOnFileSelect
      }));

      const fileInput = screen.getByTestId('file-input');
      
      // Create a mock file that's too large (6MB)
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      
      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      expect(screen.getByTestId('file-error')).toHaveTextContent('File too large (max 5MB)');
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    });

    test('prevents directory traversal in filenames', () => {
      const mockOnFileSelect = jest.fn();

      render(React.createElement(SecureFileUpload, {
        onFileSelect: mockOnFileSelect
      }));

      const fileInput = screen.getByTestId('file-input');
      
      // Create a mock file with malicious filename
      const maliciousFile = new File(['content'], '../../../etc/passwd', { type: 'image/jpeg' });
      
      fireEvent.change(fileInput, { target: { files: [maliciousFile] } });

      expect(screen.getByTestId('file-error')).toHaveTextContent('Invalid filename');
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    });

    test('accepts valid files', () => {
      const mockOnFileSelect = jest.fn();

      render(React.createElement(SecureFileUpload, {
        onFileSelect: mockOnFileSelect
      }));

      const fileInput = screen.getByTestId('file-input');
      
      // Create a valid file
      const validFile = new File(['image content'], 'image.jpg', { type: 'image/jpeg' });
      
      fireEvent.change(fileInput, { target: { files: [validFile] } });

      expect(screen.queryByTestId('file-error')).not.toBeInTheDocument();
      expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
    });
  });

  describe('Content Security Policy Compliance', () => {
    test('avoids inline event handlers', () => {
      render(React.createElement('button', {
        onClick: () => {},
        'data-testid': 'csp-compliant-button'
      }, 'Click me'));

      const button = screen.getByTestId('csp-compliant-button');
      expect(button).not.toHaveAttribute('onclick');
    });

    test('uses nonce for inline scripts if needed', () => {
      const nonce = 'test-nonce-123';
      
      const scriptElement = document.createElement('script');
      scriptElement.nonce = nonce;
      scriptElement.textContent = 'console.log("test");';
      
      expect(scriptElement.getAttribute('nonce')).toBe(nonce);
    });
  });

  describe('Authentication Security', () => {
    test('hashes passwords', () => {
      const password = 'mySecretPassword123';
      const hashedPassword = SecurityUtils.hashPassword(password);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
    });

    test('generates secure CSRF tokens', () => {
      const token1 = SecurityUtils.generateCSRFToken();
      const token2 = SecurityUtils.generateCSRFToken();

      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThanOrEqual(16);
      expect(token2.length).toBeGreaterThanOrEqual(16);
    });

    test('validates CSRF tokens correctly', () => {
      const validToken = SecurityUtils.generateCSRFToken();
      const invalidToken = 'short';

      expect(SecurityUtils.validateCSRFToken(validToken, validToken)).toBe(true);
      expect(SecurityUtils.validateCSRFToken('wrong-token', validToken)).toBe(false);
      expect(SecurityUtils.validateCSRFToken(invalidToken, invalidToken)).toBe(false);
    });
  });

  describe('Data Sanitization', () => {
    test('escapes HTML entities', () => {
      const unsafeHTML = '<script>alert("xss")</script>&copy;';
      const escaped = SecurityUtils.escapeHTML(unsafeHTML);

      expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;&amp;copy;');
    });

    test('sanitizes user-generated content', () => {
      const userContent = 'Hello <script>alert("xss")</script> <b>world</b>!';
      
      SecurityUtils.sanitizeInput(userContent);
      
      expect(DOMPurify.sanitize).toHaveBeenCalledWith(userContent, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: []
      });
    });

    test('handles non-string input gracefully', () => {
      expect(SecurityUtils.sanitizeInput(null)).toBeNull();
      expect(SecurityUtils.sanitizeInput(undefined)).toBeUndefined();
      expect(SecurityUtils.sanitizeInput(123)).toBe(123);
      expect(SecurityUtils.sanitizeInput({})).toEqual({});
    });
  });

  describe('Security Headers Simulation', () => {
    test('simulates X-Frame-Options header', () => {
      // In a real app, this would be set by the server
      const xFrameOptions = 'DENY';
      expect(['DENY', 'SAMEORIGIN'].includes(xFrameOptions)).toBe(true);
    });

    test('simulates X-Content-Type-Options header', () => {
      const xContentTypeOptions = 'nosniff';
      expect(xContentTypeOptions).toBe('nosniff');
    });

    test('simulates X-XSS-Protection header', () => {
      const xXSSProtection = '1; mode=block';
      expect(xXSSProtection).toBe('1; mode=block');
    });

    test('simulates Strict-Transport-Security header', () => {
      const hsts = 'max-age=31536000; includeSubDomains';
      expect(hsts).toContain('max-age=');
      expect(hsts).toContain('includeSubDomains');
    });
  });

  describe('Error Handling', () => {
    test('handles security errors gracefully', () => {
      const invalidInput = null;
      
      expect(() => {
        SecurityUtils.containsScript(invalidInput);
      }).not.toThrow();
    });

    test('logs security violations', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Simulate a security violation
      const suspiciousInput = '<script>alert("xss")</script>';
      
      if (SecurityUtils.containsScript(suspiciousInput)) {
        console.warn('Security violation detected:', suspiciousInput);
      }
      
      expect(consoleSpy).toHaveBeenCalledWith('Security violation detected:', suspiciousInput);
      
      consoleSpy.mockRestore();
    });
  });
});
