
export interface ImageState {
  original: string | null;
  transformed: string | null;
  isLoading: boolean;
  error: string | null;
}

export type OutfitType = 'suit' | 'dress' | 'casual' | 'tee' | 'coat' | 'knitwear' | 'leather' | 'default';
export type HairstyleType = 'updo' | 'waves' | 'bob' | 'natural' | 'messy_bun' | 'braid' | 'default';
export type BackgroundType = 'berlin' | 'tokyo' | 'ny' | 'paris' | 'studio';
export type CameraAngleType = 'eye_level' | 'low_angle' | 'high_angle' | 'three_quarter' | 'default';
export type ColorPaletteType = 'monochromatic' | 'analogous' | 'complementary' | 'default';
export type ExpressionType = 'natural' | 'smile' | 'serious' | 'smirk' | 'default';

export interface TransformationConfig {
  outfit: OutfitType;
  hairstyle: HairstyleType;
  background: BackgroundType;
  cameraAngle: CameraAngleType;
  colorPalette: ColorPaletteType;
  expression: ExpressionType;
}
