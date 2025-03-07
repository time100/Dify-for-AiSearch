/// <reference types="vite/client" />

// 声明Node.js相关全局变量和模块
declare const __dirname: string;
declare const __filename: string;

// 声明导入模块
declare module 'path' {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
}
