// Shared Component Library
// This library provides consistent components across all platforms
// (Web, Mobile, Desktop, CLI)

// Re-export shared libraries
export * from '../types';
export * from '../api';
export * from '../store';
export * from '../theme';
export * from '../utils';

// Base Components
export { default as Button } from './base/Button';
export { default as Input } from './base/Input';
export { default as Card } from './base/Card';
export { default as Modal } from './base/Modal';
export { default as Loading } from './base/Loading';
export { default as Avatar } from './base/Avatar';
export { default as Badge } from './base/Badge';
export { default as Tooltip } from './base/Tooltip';
export { default as Dropdown } from './base/Dropdown';
export { default as Tabs } from './base/Tabs';
export { default as Accordion } from './base/Accordion';
export { default as Slider } from './base/Slider';
export { default as Switch } from './base/Switch';
export { default as Checkbox } from './base/Checkbox';
export { default as Radio } from './base/Radio';
export { default as Select } from './base/Select';
export { default as TextArea } from './base/TextArea';
export { default as Progress } from './base/Progress';
export { default as Skeleton } from './base/Skeleton';
export { default as Divider } from './base/Divider';

// Layout Components
export { default as Container } from './layout/Container';
export { default as Grid } from './layout/Grid';
export { default as Flex } from './layout/Flex';
export { default as Stack } from './layout/Stack';
export { default as Spacer } from './layout/Spacer';
export { default as Section } from './layout/Section';
export { default as Header } from './layout/Header';
export { default as Footer } from './layout/Footer';
export { default as Sidebar } from './layout/Sidebar';
export { default as Navigation } from './layout/Navigation';

// Form Components
export { default as Form } from './forms/Form';
export { default as FormField } from './forms/FormField';
export { default as FormGroup } from './forms/FormGroup';
export { default as FormLabel } from './forms/FormLabel';
export { default as FormError } from './forms/FormError';
export { default as FormHelp } from './forms/FormHelp';
export { default as SearchInput } from './forms/SearchInput';
export { default as FileUpload } from './forms/FileUpload';
export { default as DatePicker } from './forms/DatePicker';
export { default as TimePicker } from './forms/TimePicker';
export { default as ColorPicker } from './forms/ColorPicker';
export { default as RangeSlider } from './forms/RangeSlider';
export { default as TagInput } from './forms/TagInput';
export { default as RichTextEditor } from './forms/RichTextEditor';

// Data Display Components
export { default as Table } from './data/Table';
export { default as List } from './data/List';
export { default as Tree } from './data/Tree';
export { default as Timeline } from './data/Timeline';
export { default as Calendar } from './data/Calendar';
export { default as Chart } from './data/Chart';
export { default as Stats } from './data/Stats';
export { default as Metric } from './data/Metric';
export { default as DataGrid } from './data/DataGrid';
export { default as Pagination } from './data/Pagination';
export { default as Filter } from './data/Filter';
export { default as Sort } from './data/Sort';
export { default as Search } from './data/Search';
export { default as Export } from './data/Export';

// Feedback Components
export { default as Alert } from './feedback/Alert';
export { default as Toast } from './feedback/Toast';
export { default as Notification } from './feedback/Notification';
export { default as Confirm } from './feedback/Confirm';
export { default as Empty } from './feedback/Empty';
export { default as Error } from './feedback/Error';
export { default as Success } from './feedback/Success';
export { default as Warning } from './feedback/Warning';
export { default as Info } from './feedback/Info';

// Navigation Components
export { default as Breadcrumb } from './navigation/Breadcrumb';
export { default as Menu } from './navigation/Menu';
export { default as MenuItem } from './navigation/MenuItem';
export { default as Drawer } from './navigation/Drawer';
export { default as Stepper } from './navigation/Stepper';
export { default as Anchor } from './navigation/Anchor';
export { default as Link } from './navigation/Link';
export { default as BackButton } from './navigation/BackButton';

// Media Components
export { default as Image } from './media/Image';
export { default as Video } from './media/Video';
export { default as Audio } from './media/Audio';
export { default as Gallery } from './media/Gallery';
export { default as Carousel } from './media/Carousel';
export { default as Lightbox } from './media/Lightbox';
export { default as ImageCrop } from './media/ImageCrop';
export { default as MediaPlayer } from './media/MediaPlayer';

// Utility Components
export { default as Portal } from './utility/Portal';
export { default as LazyLoad } from './utility/LazyLoad';
export { default as InfiniteScroll } from './utility/InfiniteScroll';
export { default as VirtualList } from './utility/VirtualList';
export { default as Resizable } from './utility/Resizable';
export { default as Draggable } from './utility/Draggable';
export { default as Sortable } from './utility/Sortable';
export { default as Clipboard } from './utility/Clipboard';
export { default as QRCode } from './utility/QRCode';
export { default as Barcode } from './utility/Barcode';
export { default as Print } from './utility/Print';
export { default as Download } from './utility/Download';
export { default as Share } from './utility/Share';
export { default as Fullscreen } from './utility/Fullscreen';
export { default as ThemeProvider } from './utility/ThemeProvider';
export { default as ErrorBoundary } from './utility/ErrorBoundary';

// Platform-Specific Components
export { default as MobileCard } from './mobile/MobileCard';
export { default as MobileNavigation } from './mobile/MobileNavigation';
export { default as MobileSettings } from './mobile/MobileSettings';
export { default as MobileGameInterface } from './mobile/MobileGameInterface';
export { default as TouchGestureHandler } from './mobile/TouchGestureHandler';
export { default as ResponsiveLayout } from './mobile/ResponsiveLayout';
export { default as MobileDrawer } from './mobile/MobileDrawer';
export { default as MobileContactForm } from './mobile/MobileContactForm';
export { default as MobileProjectGallery } from './mobile/MobileProjectGallery';
export { default as MobileAnalyticsDashboard } from './mobile/MobileAnalyticsDashboard';

// Types and Interfaces
export type { ButtonProps } from './base/Button';
export type { InputProps } from './base/Input';
export type { CardProps } from './base/Card';
export type { ModalProps } from './base/Modal';
export type { LoadingProps } from './base/Loading';
export type { AvatarProps } from './base/Avatar';
export type { BadgeProps } from './base/Badge';
export type { TooltipProps } from './base/Tooltip';
export type { DropdownProps } from './base/Dropdown';
export type { TabsProps } from './base/Tabs';
export type { AccordionProps } from './base/Accordion';
export type { SliderProps } from './base/Slider';
export type { SwitchProps } from './base/Switch';
export type { CheckboxProps } from './base/Checkbox';
export type { RadioProps } from './base/Radio';
export type { SelectProps } from './base/Select';
export type { TextAreaProps } from './base/TextArea';
export type { ProgressProps } from './base/Progress';
export type { SkeletonProps } from './base/Skeleton';
export type { DividerProps } from './base/Divider';

// Layout Types
export type { ContainerProps } from './layout/Container';
export type { GridProps } from './layout/Grid';
export type { FlexProps } from './layout/Flex';
export type { StackProps } from './layout/Stack';
export type { SpacerProps } from './layout/Spacer';
export type { SectionProps } from './layout/Section';
export type { HeaderProps } from './layout/Header';
export type { FooterProps } from './layout/Footer';
export type { SidebarProps } from './layout/Sidebar';
export type { NavigationProps } from './layout/Navigation';

// Form Types
export type { FormProps } from './forms/Form';
export type { FormFieldProps } from './forms/FormField';
export type { FormGroupProps } from './forms/FormGroup';
export type { FormLabelProps } from './forms/FormLabel';
export type { FormErrorProps } from './forms/FormError';
export type { FormHelpProps } from './forms/FormHelp';
export type { SearchInputProps } from './forms/SearchInput';
export type { FileUploadProps } from './forms/FileUpload';
export type { DatePickerProps } from './forms/DatePicker';
export type { TimePickerProps } from './forms/TimePicker';
export type { ColorPickerProps } from './forms/ColorPicker';
export type { RangeSliderProps } from './forms/RangeSlider';
export type { TagInputProps } from './forms/TagInput';
export type { RichTextEditorProps } from './forms/RichTextEditor';

// Data Display Types
export type { TableProps } from './data/Table';
export type { ListProps } from './data/List';
export type { TreeProps } from './data/Tree';
export type { TimelineProps } from './data/Timeline';
export type { CalendarProps } from './data/Calendar';
export type { ChartProps } from './data/Chart';
export type { StatsProps } from './data/Stats';
export type { MetricProps } from './data/Metric';
export type { DataGridProps } from './data/DataGrid';
export type { PaginationProps } from './data/Pagination';
export type { FilterProps } from './data/Filter';
export type { SortProps } from './data/Sort';
export type { SearchProps } from './data/Search';
export type { ExportProps } from './data/Export';

// Feedback Types
export type { AlertProps } from './feedback/Alert';
export type { ToastProps } from './feedback/Toast';
export type { NotificationProps } from './feedback/Notification';
export type { ConfirmProps } from './feedback/Confirm';
export type { EmptyProps } from './feedback/Empty';
export type { ErrorProps } from './feedback/Error';
export type { SuccessProps } from './feedback/Success';
export type { WarningProps } from './feedback/Warning';
export type { InfoProps } from './feedback/Info';

// Navigation Types
export type { BreadcrumbProps } from './navigation/Breadcrumb';
export type { MenuProps } from './navigation/Menu';
export type { MenuItemProps } from './navigation/MenuItem';
export type { DrawerProps } from './navigation/Drawer';
export type { StepperProps } from './navigation/Stepper';
export type { AnchorProps } from './navigation/Anchor';
export type { LinkProps } from './navigation/Link';
export type { BackButtonProps } from './navigation/BackButton';

// Media Types
export type { ImageProps } from './media/Image';
export type { VideoProps } from './media/Video';
export type { AudioProps } from './media/Audio';
export type { GalleryProps } from './media/Gallery';
export type { CarouselProps } from './media/Carousel';
export type { LightboxProps } from './media/Lightbox';
export type { ImageCropProps } from './media/ImageCrop';
export type { MediaPlayerProps } from './media/MediaPlayer';

// Utility Types
export type { PortalProps } from './utility/Portal';
export type { LazyLoadProps } from './utility/LazyLoad';
export type { InfiniteScrollProps } from './utility/InfiniteScroll';
export type { VirtualListProps } from './utility/VirtualList';
export type { ResizableProps } from './utility/Resizable';
export type { DraggableProps } from './utility/Draggable';
export type { SortableProps } from './utility/Sortable';
export type { ClipboardProps } from './utility/Clipboard';
export type { QRCodeProps } from './utility/QRCode';
export type { BarcodeProps } from './utility/Barcode';
export type { PrintProps } from './utility/Print';
export type { DownloadProps } from './utility/Download';
export type { ShareProps } from './utility/Share';
export type { FullscreenProps } from './utility/Fullscreen';
export type { ThemeProviderProps } from './utility/ThemeProvider';
export type { ErrorBoundaryProps } from './utility/ErrorBoundary';

// Mobile Types
export type { MobileCardProps } from './mobile/MobileCard';
export type { MobileNavigationProps } from './mobile/MobileNavigation';
export type { MobileSettingsProps } from './mobile/MobileSettings';
export type { MobileGameInterfaceProps } from './mobile/MobileGameInterface';
export type { TouchGestureHandlerProps } from './mobile/TouchGestureHandler';
export type { ResponsiveLayoutProps } from './mobile/ResponsiveLayout';
export type { MobileDrawerProps } from './mobile/MobileDrawer';
export type { MobileContactFormProps } from './mobile/MobileContactForm';
export type { MobileProjectGalleryProps } from './mobile/MobileProjectGallery';
export type { MobileAnalyticsDashboardProps } from './mobile/MobileAnalyticsDashboard';

// Common Types and Interfaces
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface StyleProps {
  style?: React.CSSProperties;
  sx?: Record<string, any>;
}

export interface EventProps {
  onClick?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-pressed'?: boolean;
  'aria-current'?: string;
  role?: string;
  tabIndex?: number;
}

export interface ResponsiveProps {
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
  xxl?: any;
}

export interface ThemeProps {
  theme?: 'light' | 'dark' | 'auto';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  background?: string;
  border?: string;
  radius?: string | number;
  shadow?: string;
}

export interface AnimationProps {
  animate?: boolean;
  duration?: number;
  delay?: number;
  easing?: string;
  transition?: string;
}

export interface LoadingState {
  loading?: boolean;
  error?: string | Error | null;
  success?: boolean;
}

export interface PaginationState {
  page?: number;
  pageSize?: number;
  total?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface SortState {
  field?: string;
  direction?: 'asc' | 'desc';
}

export interface FilterState {
  filters?: Record<string, any>;
  search?: string;
}

export interface SelectionState {
  selected?: any[];
  selectedKeys?: Set<string | number>;
  selectionMode?: 'single' | 'multiple' | 'none';
}

// Platform Detection
export interface PlatformInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  platform: 'web' | 'mobile' | 'desktop' | 'cli';
  os: 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';
}

// Theme System
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
    toast: number;
  };
}

// Component Library Configuration
export interface ComponentLibraryConfig {
  theme: Theme;
  platform: PlatformInfo;
  locale: string;
  direction: 'ltr' | 'rtl';
  animations: boolean;
  accessibility: boolean;
  debug: boolean;
}

// Utility Functions
export const createComponent = <T extends ComponentProps>(
  component: React.ComponentType<T>
) => component;

export const withTheme = <T extends ComponentProps>(
  component: React.ComponentType<T>
) => component;

export const withPlatform = <T extends ComponentProps>(
  component: React.ComponentType<T>
) => component;

export const withAccessibility = <T extends ComponentProps>(
  component: React.ComponentType<T>
) => component;

export const withAnimation = <T extends ComponentProps>(
  component: React.ComponentType<T>
) => component;

// Version Information
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();
export const PLATFORM_SUPPORT = {
  web: true,
  mobile: true,
  desktop: true,
  cli: true
};

// Default Export
export default {
  VERSION,
  BUILD_DATE,
  PLATFORM_SUPPORT,
  createComponent,
  withTheme,
  withPlatform,
  withAccessibility,
  withAnimation
};

/**
 * Shared Component Library
 * 
 * This library provides a unified set of components that work across
 * all platforms in the portfolio ecosystem:
 * 
 * - Web (React)
 * - Mobile (React Native/PWA)
 * - Desktop (Electron)
 * - CLI (Node.js)
 * 
 * Features:
 * - Consistent design language
 * - Platform-specific optimizations
 * - Accessibility support
 * - Theme system
 * - Responsive design
 * - Touch gesture support
 * - Animation system
 * - Type safety
 * 
 * Usage:
 * ```typescript
 * import { Button, Card, Modal } from '@shared/components';
 * 
 * function MyComponent() {
 *   return (
 *     <Card>
 *       <Button variant="primary" size="lg">
 *         Click me
 *       </Button>
 *     </Card>
 *   );
 * }
 * ```
 */