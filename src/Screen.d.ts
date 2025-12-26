interface ScreenSource {
  id: string;
  name: string;
  thumbnail: NativeImage;
  appIcon: string | null;
  displayId: string;
}

interface ScreenSize {
  width: number;
  height: number;
  scaleFactor: number;
}
