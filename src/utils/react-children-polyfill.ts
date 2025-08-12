// Custom React Children polyfill to avoid bundling issues
export function toArray(children: React.ReactNode): React.ReactElement[] {
  const result: React.ReactElement[] = [];
  
  const addChild = (child: any) => {
    if (child == null || typeof child === 'boolean') {
      return;
    }
    if (Array.isArray(child)) {
      child.forEach(addChild);
    } else {
      result.push(child);
    }
  };
  
  addChild(children);
  return result;
}

export function map(
  children: React.ReactNode,
  fn: (child: React.ReactElement, index: number) => React.ReactNode
): React.ReactNode[] {
  return toArray(children).map(fn);
}

export function count(children: React.ReactNode): number {
  return toArray(children).length;
}

export function forEach(
  children: React.ReactNode,
  fn: (child: React.ReactElement, index: number) => void
): void {
  toArray(children).forEach(fn);
}

export function only(children: React.ReactNode): React.ReactElement {
  const childArray = toArray(children);
  if (childArray.length !== 1) {
    throw new Error('React.Children.only expected to receive a single React element child.');
  }
  return childArray[0];
}

// Export as default object to mimic React.Children API
const ReactChildrenPolyfill = {
  toArray,
  map,
  count,
  forEach,
  only
};

export default ReactChildrenPolyfill;