// React shim to prevent React.Children modification errors
// This creates a protective wrapper around React to prevent external libraries
// from modifying React.Children after React has been optimized/minified

import * as OriginalReact from 'react';

// Create a protective proxy for React that prevents Children modification
const ReactShim = new Proxy(OriginalReact, {
  set(target, prop, value) {
    // Prevent any external modification of React.Children
    if (prop === 'Children') {
      console.warn('Attempted to modify React.Children - blocked by shim');
      return true; // Pretend the assignment succeeded
    }
    // Allow other modifications
    return Reflect.set(target, prop, value);
  },
  get(target, prop) {
    // Return the original value
    return Reflect.get(target, prop);
  }
});

// Export the shimmed React as default
export default ReactShim;

// Also export all named exports from React
export * from 'react';

// Specifically export Children to ensure it's available
export const Children = OriginalReact.Children;
export const createElement = OriginalReact.createElement;
export const Component = OriginalReact.Component;
export const Fragment = OriginalReact.Fragment;
export const useState = OriginalReact.useState;
export const useEffect = OriginalReact.useEffect;
export const useRef = OriginalReact.useRef;
export const useContext = OriginalReact.useContext;
export const createContext = OriginalReact.createContext;
export const isValidElement = OriginalReact.isValidElement;

// Export types
export type { ReactNode, HTMLAttributes } from 'react';