import { Object3D, BufferGeometry, Material } from 'three';
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: {
        ref?: React.Ref<Object3D>;
        geometry?: BufferGeometry;
        material?: Material;
        [key: string]: unknown;
      };
      primitive: {
        ref?: React.Ref<Object3D>;
        object: Object3D;
        [key: string]: unknown;
      };
    }
  }
}

export {};