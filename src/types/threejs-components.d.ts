/**
 * Typen für den lokal gebündelten Röhren-Effekt.
 *
 * Quelle: npm-Paket `threejs-components@0.0.19`, Datei
 * `build/cursors/tubes1.min.js`. Das Paket liefert keine eigenen Typen mit.
 * Die Datei ist ein eigenständiges ES-Modul (three.js ist darin enthalten)
 * und lädt zur Laufzeit nichts nach – deshalb ist sie ohne CDN einsetzbar.
 *
 * Deklariert ist nur, was diese Website tatsächlich benutzt.
 */
declare module 'threejs-components/build/cursors/tubes1.min.js' {
  /** Farben werden als Hex-Zahl erwartet, nicht als CSS-String. */
  type Hex = number;

  interface TubesOptions {
    count?: number;
    colors?: Hex[];
    minRadius?: number;
    maxRadius?: number;
    minTubularSegments?: number;
    maxTubularSegments?: number;
    material?: { metalness?: number; roughness?: number };
    lights?: { intensity?: number; colors?: Hex[] };
    lerp?: number;
    noise?: number;
  }

  interface TubesConfig {
    bloom?: { threshold?: number; strength?: number; radius?: number } | false;
    tubes?: TubesOptions;
    sleepRadiusX?: number;
    sleepRadiusY?: number;
    sleepTimeScale1?: number;
    sleepTimeScale2?: number;
  }

  /**
   * Die Bibliothek bietet kein öffentliches `start()`/`stop()`. Pausiert wird
   * deshalb, indem `render` und `onBeforeRender` gegen leere Funktionen
   * getauscht werden – beide sind beschreibbare Felder.
   */
  interface ThreeWrapper {
    camera: {
      position: { z: number; set(x: number, y: number, z: number): void };
      lookAt(x: number, y: number, z: number): void;
      updateProjectionMatrix(): void;
    };
    maxPixelRatio: number;
    minPixelRatio: number;
    render: (...args: unknown[]) => void;
    onBeforeRender: (...args: unknown[]) => void;
    isDisposed: boolean;
    resize(): void;
    clear(): void;
    dispose(): void;
  }

  interface TubesScene {
    setColors(colors: Hex[]): void;
    setLightsColors(colors: Hex[]): void;
    setLightsIntensity(value: number): void;
  }

  interface TubesInstance {
    three: ThreeWrapper;
    tubes: TubesScene;
    dispose(): void;
  }

  export default function tubes(canvas: HTMLCanvasElement, config?: TubesConfig): TubesInstance;
}
