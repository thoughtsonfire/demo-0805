// 在 src/types/three.d.ts 中补充缺失的类型定义
import * as THREE from 'three';

declare module 'three' {
    interface WebGLRenderer {
      antialias?: boolean;
    }
  }