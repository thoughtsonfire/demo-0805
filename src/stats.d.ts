import * as Stats from 'stats'
declare module 'stats.js' {
    export default class Stats {
      domElement: HTMLElement;
      setMode(mode: number): void;
      begin(): void;
      end(): void;
      update():void;
    }
  }