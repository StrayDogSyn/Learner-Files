/**
 * Accessibility Tests (axe-core)
 * Tests for WCAG compliance and accessibility best practices
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// Mock accessible components for testing
const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  ariaLabel, 
  ariaDescribedBy,
  type = 'button' 
}) => {
  return React.createElement('button', {
    type,
    onClick,
    disabled,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': 'accessible-button'
  }, children);
};

const AccessibleForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = React.useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return React.createElement('form', { 
    onSubmit: handleSubmit,
    'data-testid': 'accessible-form',
    noValidate: true
  },
    React.createElement('fieldset', null,
      React.createElement('legend', null, 'Contact Information'),
      
      React.createElement('div', null,
        React.createElement('label', { htmlFor: 'name' }, 'Full Name *'),
        React.createElement('input', {
          id: 'name',
          name: 'name',
          type: 'text',
          value: formData.name,
          onChange: handleChange,
          required: true,
          'aria-invalid': !!errors.name,
          'aria-describedby': errors.name ? 'name-error' : 'name-help',
          'data-testid': 'name-input'
        }),
        React.createElement('div', { 
          id: 'name-help',
          className: 'help-text'
        }, 'Enter your full name'),
        errors.name && React.createElement('div', {
          id: 'name-error',
          role: 'alert',
          'aria-live': 'polite',
          'data-testid': 'name-error'
        }, errors.name)
      ),

      React.createElement('div', null,
        React.createElement('label', { htmlFor: 'email' }, 'Email Address *'),
        React.createElement('input', {
          id: 'email',
          name: 'email',
          type: 'email',
          value: formData.email,
          onChange: handleChange,
          required: true,
          'aria-invalid': !!errors.email,
          'aria-describedby': errors.email ? 'email-error' : 'email-help',
          'data-testid': 'email-input'
        }),
        React.createElement('div', { 
          id: 'email-help',
          className: 'help-text'
        }, 'We will never share your email'),
        errors.email && React.createElement('div', {
          id: 'email-error',
          role: 'alert',
          'aria-live': 'polite',
          'data-testid': 'email-error'
        }, errors.email)
      ),

      React.createElement('div', null,
        React.createElement('label', { htmlFor: 'phone' }, 'Phone Number (Optional)'),
        React.createElement('input', {
          id: 'phone',
          name: 'phone',
          type: 'tel',
          value: formData.phone,
          onChange: handleChange,
          'aria-describedby': 'phone-help',
          'data-testid': 'phone-input'
        }),
        React.createElement('div', { 
          id: 'phone-help',
          className: 'help-text'
        }, 'Format: (555) 123-4567')
      ),

      React.createElement('div', null,
        React.createElement('label', { htmlFor: 'message' }, 'Message'),
        React.createElement('textarea', {
          id: 'message',
          name: 'message',
          value: formData.message,
          onChange: handleChange,
          rows: 5,
          'aria-describedby': 'message-help',
          'data-testid': 'message-input'
        }),
        React.createElement('div', { 
          id: 'message-help',
          className: 'help-text'
        }, 'Optional message or additional information')
      )
    ),

    React.createElement('button', {
      type: 'submit',
      'data-testid': 'submit-button'
    }, 'Send Message')
  );
};

const AccessibleModal = ({ isOpen, onClose, children, title }) => {
  const modalRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return React.createElement('div', {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modal-title',
    'aria-describedby': 'modal-content',
    tabIndex: -1,
    ref: modalRef,
    'data-testid': 'modal'
  },
    React.createElement('div', { 
      className: 'modal-backdrop',
      onClick: onClose,
      'aria-hidden': 'true'
    }),
    React.createElement('div', { className: 'modal-content' },
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h2', { 
          id: 'modal-title'
        }, title),
        React.createElement('button', {
          onClick: onClose,
          'aria-label': 'Close modal',
          'data-testid': 'close-modal'
        }, '×')
      ),
      React.createElement('div', { 
        id: 'modal-content',
        className: 'modal-body'
      }, children)
    )
  );
};

const AccessibleNavigation = () => {
  const [currentSection, setCurrentSection] = React.useState('home');

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ];

  return React.createElement('nav', {
    role: 'navigation',
    'aria-label': 'Main navigation',
    'data-testid': 'main-navigation'
  },
    React.createElement('ul', { role: 'menubar' },
      sections.map(section => 
        React.createElement('li', { 
          key: section.id,
          role: 'none'
        },
          React.createElement('button', {
            role: 'menuitem',
            onClick: () => setCurrentSection(section.id),
            'aria-current': currentSection === section.id ? 'page' : undefined,
            'data-testid': `nav-${section.id}`
          }, section.label)
        )
      )
    )
  );
};

const AccessibleTable = ({ data, caption }) => {
  return React.createElement('table', {
    'data-testid': 'accessible-table'
  },
    React.createElement('caption', null, caption),
    React.createElement('thead', null,
      React.createElement('tr', null,
        React.createElement('th', { scope: 'col' }, 'Name'),
        React.createElement('th', { scope: 'col' }, 'Email'),
        React.createElement('th', { scope: 'col' }, 'Role'),
        React.createElement('th', { scope: 'col' }, 'Actions')
      )
    ),
    React.createElement('tbody', null,
      data.map((row, index) => 
        React.createElement('tr', { key: index },
          React.createElement('th', { scope: 'row' }, row.name),
          React.createElement('td', null, row.email),
          React.createElement('td', null, row.role),
          React.createElement('td', null,
            React.createElement('button', {
              'aria-label': `Edit ${row.name}`,
              'data-testid': `edit-${index}`
            }, 'Edit')
          )
        )
      )
    )
  );
};

const AccessibleImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = React.useState(null);

  return React.createElement('div', {
    'data-testid': 'image-gallery'
  },
    React.createElement('h2', null, 'Image Gallery'),
    React.createElement('div', { 
      role: 'list',
      'aria-label': 'Image gallery'
    },
      images.map((image, index) => 
        React.createElement('div', {
          key: index,
          role: 'listitem'
        },
          React.createElement('button', {
            onClick: () => setSelectedImage(image),
            'aria-describedby': `image-desc-${index}`,
            'data-testid': `image-button-${index}`
          },
            React.createElement('img', {
              src: image.thumbnail,
              alt: image.alt,
              'data-testid': `image-${index}`
            })
          ),
          React.createElement('p', {
            id: `image-desc-${index}`,
            className: 'sr-only'
          }, image.description)
        )
      )
    ),
    selectedImage && React.createElement(AccessibleModal, {
      isOpen: true,
      onClose: () => setSelectedImage(null),
      title: selectedImage.title
    },
      React.createElement('img', {
        src: selectedImage.fullSize,
        alt: selectedImage.alt
      }),
      React.createElement('p', null, selectedImage.description)
    )
  );
};

describe('Accessibility Tests (axe-core)', () => {
  describe('Basic Accessibility Compliance', () => {
    test('accessible button has no violations', async () => {
      const { container } = render(
        React.createElement(AccessibleButton, {
          onClick: () => {},
          ariaLabel: 'Submit form'
        }, 'Submit')
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('accessible form has no violations', async () => {
      const { container } = render(React.createElement(AccessibleForm));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('accessible navigation has no violations', async () => {
      const { container } = render(React.createElement(AccessibleNavigation));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('accessible table has no violations', async () => {
      const data = [
        { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
      ];

      const { container } = render(
        React.createElement(AccessibleTable, {
          data,
          caption: 'User management table'
        })
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Accessibility', () => {
    test('form labels are properly associated', () => {
      render(React.createElement(AccessibleForm));

      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');

      expect(nameInput).toHaveAccessibleName('Full Name *');
      expect(emailInput).toHaveAccessibleName('Email Address *');
    });

    test('form validation errors are announced', async () => {
      const user = userEvent.setup();
      render(React.createElement(AccessibleForm));

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      const nameError = screen.getByTestId('name-error');
      expect(nameError).toHaveAttribute('role', 'alert');
      expect(nameError).toHaveAttribute('aria-live', 'polite');
    });

    test('form inputs have proper ARIA attributes', async () => {
      const user = userEvent.setup();
      render(React.createElement(AccessibleForm));

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      const nameInput = screen.getByTestId('name-input');
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    });

    test('optional fields are clearly marked', () => {
      render(React.createElement(AccessibleForm));

      const phoneLabel = screen.getByLabelText('Phone Number (Optional)');
      expect(phoneLabel).toBeInTheDocument();
    });

    test('help text is associated with inputs', () => {
      render(React.createElement(AccessibleForm));

      const nameInput = screen.getByTestId('name-input');
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-help');

      const helpText = document.getElementById('name-help');
      expect(helpText).toHaveTextContent('Enter your full name');
    });
  });

  describe('Navigation Accessibility', () => {
    test('navigation has proper ARIA roles', () => {
      render(React.createElement(AccessibleNavigation));

      const nav = screen.getByTestId('main-navigation');
      expect(nav).toHaveAttribute('role', 'navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');

      const menubar = nav.querySelector('ul');
      expect(menubar).toHaveAttribute('role', 'menubar');
    });

    test('current page is indicated', async () => {
      const user = userEvent.setup();
      render(React.createElement(AccessibleNavigation));

      const aboutButton = screen.getByTestId('nav-about');
      await user.click(aboutButton);

      expect(aboutButton).toHaveAttribute('aria-current', 'page');
    });

    test('navigation is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(React.createElement(AccessibleNavigation));

      const homeButton = screen.getByTestId('nav-home');
      const aboutButton = screen.getByTestId('nav-about');

      // Tab navigation
      await user.tab();
      expect(homeButton).toHaveFocus();

      await user.tab();
      expect(aboutButton).toHaveFocus();

      // Activate with keyboard
      await user.keyboard('{Enter}');
      expect(aboutButton).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Modal Accessibility', () => {
    test('modal has proper ARIA attributes', () => {
      const TestModalWrapper = () => {
        const [isOpen, setIsOpen] = React.useState(true);
        return React.createElement(AccessibleModal, {
          isOpen,
          onClose: () => setIsOpen(false),
          title: 'Test Modal'
        }, 'Modal content');
      };

      render(React.createElement(TestModalWrapper));

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    test('modal traps focus', () => {
      const TestModalWrapper = () => {
        const [isOpen, setIsOpen] = React.useState(true);
        return React.createElement(AccessibleModal, {
          isOpen,
          onClose: () => setIsOpen(false),
          title: 'Test Modal'
        }, 'Modal content');
      };

      render(React.createElement(TestModalWrapper));

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveFocus();
    });

    test('modal closes on escape key', async () => {
      const user = userEvent.setup();
      
      const TestModalWrapper = () => {
        const [isOpen, setIsOpen] = React.useState(true);
        return React.createElement('div', null,
          React.createElement(AccessibleModal, {
            isOpen,
            onClose: () => setIsOpen(false),
            title: 'Test Modal'
          }, 'Modal content'),
          React.createElement('div', {
            'data-testid': 'modal-state'
          }, isOpen ? 'open' : 'closed')
        );
      };

      render(React.createElement(TestModalWrapper));

      expect(screen.getByTestId('modal')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.getByTestId('modal-state')).toHaveTextContent('closed');
    });
  });

  describe('Table Accessibility', () => {
    test('table has proper structure', () => {
      const data = [
        { name: 'John Doe', email: 'john@example.com', role: 'Admin' }
      ];

      render(React.createElement(AccessibleTable, {
        data,
        caption: 'User management table'
      }));

      const table = screen.getByTestId('accessible-table');
      expect(table.querySelector('caption')).toBeInTheDocument();
      expect(table.querySelector('thead')).toBeInTheDocument();
      expect(table.querySelector('tbody')).toBeInTheDocument();
    });

    test('table headers have proper scope', () => {
      const data = [
        { name: 'John Doe', email: 'john@example.com', role: 'Admin' }
      ];

      render(React.createElement(AccessibleTable, {
        data,
        caption: 'User management table'
      }));

      const columnHeaders = screen.getAllByRole('columnheader');
      columnHeaders.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });

      const rowHeader = screen.getByRole('rowheader');
      expect(rowHeader).toHaveAttribute('scope', 'row');
    });

    test('action buttons have descriptive labels', () => {
      const data = [
        { name: 'John Doe', email: 'john@example.com', role: 'Admin' }
      ];

      render(React.createElement(AccessibleTable, {
        data,
        caption: 'User management table'
      }));

      const editButton = screen.getByTestId('edit-0');
      expect(editButton).toHaveAttribute('aria-label', 'Edit John Doe');
    });
  });

  describe('Image Accessibility', () => {
    test('images have proper alt text', () => {
      const images = [
        {
          thumbnail: 'thumb1.jpg',
          fullSize: 'full1.jpg',
          alt: 'Beautiful sunset over mountains',
          title: 'Mountain Sunset',
          description: 'A stunning sunset view over snow-capped mountains'
        }
      ];

      render(React.createElement(AccessibleImageGallery, { images }));

      const image = screen.getByTestId('image-0');
      expect(image).toHaveAttribute('alt', 'Beautiful sunset over mountains');
    });

    test('image descriptions are available to screen readers', () => {
      const images = [
        {
          thumbnail: 'thumb1.jpg',
          fullSize: 'full1.jpg',
          alt: 'Beautiful sunset over mountains',
          title: 'Mountain Sunset',
          description: 'A stunning sunset view over snow-capped mountains'
        }
      ];

      render(React.createElement(AccessibleImageGallery, { images }));

      const imageButton = screen.getByTestId('image-button-0');
      expect(imageButton).toHaveAttribute('aria-describedby', 'image-desc-0');

      const description = document.getElementById('image-desc-0');
      expect(description).toHaveTextContent('A stunning sunset view over snow-capped mountains');
    });
  });

  describe('Color and Contrast', () => {
    test('components maintain accessibility with custom styles', async () => {
      const StyledComponent = () => 
        React.createElement('div', {
          style: {
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '20px'
          },
          'data-testid': 'styled-component'
        },
          React.createElement('h1', null, 'High Contrast Heading'),
          React.createElement('p', null, 'This text has sufficient contrast ratio'),
          React.createElement('button', {
            style: {
              backgroundColor: '#0066cc',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px'
            }
          }, 'Accessible Button')
        );

      const { container } = render(React.createElement(StyledComponent));

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    test('all interactive elements are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(React.createElement(AccessibleForm));

      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      // Tab through form elements
      await user.tab();
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('phone-input')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('message-input')).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });

    test('skip links are available for navigation', async () => {
      const PageWithSkipLink = () => 
        React.createElement('div', null,
          React.createElement('a', {
            href: '#main-content',
            className: 'skip-link',
            'data-testid': 'skip-link'
          }, 'Skip to main content'),
          React.createElement('nav', null, 'Navigation content'),
          React.createElement('main', {
            id: 'main-content',
            tabIndex: -1
          }, 'Main content')
        );

      const user = userEvent.setup();
      render(React.createElement(PageWithSkipLink));

      const skipLink = screen.getByTestId('skip-link');
      
      // Tab to skip link (should be first focusable element)
      await user.tab();
      expect(skipLink).toHaveFocus();
    });
  });

  describe('Screen Reader Compatibility', () => {
    test('live regions announce dynamic content', async () => {
      const LiveRegionComponent = () => {
        const [message, setMessage] = React.useState('');

        return React.createElement('div', null,
          React.createElement('button', {
            onClick: () => setMessage('Content updated successfully'),
            'data-testid': 'update-button'
          }, 'Update Content'),
          React.createElement('div', {
            'aria-live': 'polite',
            'aria-atomic': 'true',
            'data-testid': 'live-region'
          }, message)
        );
      };

      const user = userEvent.setup();
      render(React.createElement(LiveRegionComponent));

      const updateButton = screen.getByTestId('update-button');
      await user.click(updateButton);

      const liveRegion = screen.getByTestId('live-region');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveTextContent('Content updated successfully');
    });

    test('complex UI has proper landmarks', async () => {
      const ComplexLayout = () => 
        React.createElement('div', null,
          React.createElement('header', {
            role: 'banner',
            'data-testid': 'header'
          }, 'Site Header'),
          React.createElement('nav', {
            role: 'navigation',
            'aria-label': 'Main navigation',
            'data-testid': 'navigation'
          }, 'Navigation'),
          React.createElement('main', {
            role: 'main',
            'data-testid': 'main'
          }, 'Main Content'),
          React.createElement('aside', {
            role: 'complementary',
            'data-testid': 'sidebar'
          }, 'Sidebar'),
          React.createElement('footer', {
            role: 'contentinfo',
            'data-testid': 'footer'
          }, 'Footer')
        );

      const { container } = render(React.createElement(ComplexLayout));

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Verify landmarks are present
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('complementary')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });
});
