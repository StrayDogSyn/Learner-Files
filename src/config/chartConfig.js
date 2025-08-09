/**
 * Chart.js Configuration
 * Centralized chart configuration and theme management
 */

// Color themes
export const chartThemes = {
  default: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899',
    gray: '#6b7280',
    success: '#059669'
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#34d399',
    accent: '#fbbf24',
    danger: '#f87171',
    purple: '#a78bfa',
    pink: '#f472b6',
    gray: '#9ca3af',
    success: '#10b981'
  },
  corporate: {
    primary: '#1e40af',
    secondary: '#059669',
    accent: '#d97706',
    danger: '#dc2626',
    purple: '#7c3aed',
    pink: '#be185d',
    gray: '#4b5563',
    success: '#047857'
  }
};

// Chart type configurations
export const chartConfigs = {
  line: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.formattedValue;
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280'
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280',
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value;
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2
      }
    }
  },
  
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.formattedValue;
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280',
          maxRotation: 45
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280',
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value;
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false,
      }
    }
  },
  
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const dataset = context.dataset;
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const currentValue = dataset.data[context.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(1);
            return `${context.label}: ${currentValue} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  },
  
  pie: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const dataset = context.dataset;
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const currentValue = dataset.data[context.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  }
};

// Utility functions
export const generateColors = (count, theme = 'default') => {
  const colors = Object.values(chartThemes[theme]);
  const result = [];
  
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
};

export const addAlpha = (color, alpha) => {
  // Convert hex to rgba with alpha
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getResponsiveConfig = (screenSize) => {
  const configs = {
    mobile: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 10
            },
            padding: 15
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 9
            },
            maxRotation: 90
          }
        },
        y: {
          ticks: {
            font: {
              size: 9
            }
          }
        }
      }
    },
    tablet: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 11
            },
            padding: 18
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 10
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: 10
            }
          }
        }
      }
    },
    desktop: {
      // Use default configs
    }
  };
  
  return configs[screenSize] || configs.desktop;
};

// Animation presets
export const animationPresets = {
  smooth: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  fast: {
    duration: 500,
    easing: 'easeOutQuart'
  },
  slow: {
    duration: 2000,
    easing: 'easeInOutCubic'
  },
  bounce: {
    duration: 1500,
    easing: 'easeOutBounce'
  }
};

// Data formatter utilities
export const formatters = {
  number: (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  },
  
  percentage: (value, total) => {
    return ((value / total) * 100).toFixed(1) + '%';
  },
  
  currency: (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  },
  
  date: (value, format = 'short') => {
    const date = new Date(value);
    const options = {
      short: { month: 'short', day: 'numeric' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' }
    };
    
    return date.toLocaleDateString('en-US', options[format]);
  }
};

export default {
  themes: chartThemes,
  configs: chartConfigs,
  generateColors,
  addAlpha,
  getResponsiveConfig,
  animations: animationPresets,
  formatters
};
