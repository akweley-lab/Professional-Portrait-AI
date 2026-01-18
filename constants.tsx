
export const APP_TITLE = "Professional Persona AI";
export const APP_SUBTITLE = "Elevate your professional identity with high-fidelity AI portrait transformation.";

export const OUTFIT_DESCRIPTIONS: Record<string, string> = {
  suit: "a high-end, perfectly tailored charcoal or navy business suit with a crisp white professional shirt",
  dress: "a sophisticated, structured professional power dress in a solid elegant tone with a modern silhouette",
  casual: "a smart-casual modern blazer over a premium silk or knit top, looking contemporary and approachable",
  tee: "a premium well-fitted minimalist high-quality t-shirt and clean dark-wash jeans, creating a polished 'tech-creative' casual look",
  coat: "a formal, high-end tailored executive wool coat in a neutral tone, layered over professional attire",
  knitwear: "a premium, high-quality cashmere or fine-knit turtleneck, looking intelligent, soft, and approachable",
  leather: "a sleek, modern, high-quality professional leather jacket, projecting a creative and bold modern leadership style",
  default: "high-end tailored blazer or structured professional wear"
};

export const EXPRESSION_DESCRIPTIONS: Record<string, string> = {
  natural: "a natural, calm, and neutral professional facial expression",
  smile: "a warm, genuine, and approachable smile with a friendly professional spark in the eyes",
  serious: "a serious, focused, and analytical expression, projecting determination and deep expertise",
  smirk: "a subtle, confident smirk, projecting intelligence, wit, and self-assured leadership",
  default: "a polished, natural professional expression"
};

export const HAIRSTYLE_DESCRIPTIONS: Record<string, string> = {
  updo: "a polished, elegant professional updo, looking modern and clean",
  waves: "soft, loose professional waves with a healthy editorial sheen and natural flow",
  bob: "a sleek, sharp professional bob with minimalist clean lines",
  natural: "beautifully styled natural hair texture with professional definition and shine",
  messy_bun: "a chic, effortless but professional messy bun, looking soft, voluminous, and modern with a few loose tendrils",
  braid: "a sophisticated, loose side braid or intricate crown braid, looking elegant, feminine, and professionally styled",
  default: "a polished, professional hairstyle that complements the face"
};

export const BACKGROUND_DESCRIPTIONS: Record<string, string> = {
  berlin: "Set in Berlin with clean urban lines, modern glass architecture, and minimalist European design.",
  tokyo: "Set in Tokyo with a breathtaking view of the Shinjuku skyline, featuring modern skyscrapers and a high-tech global urban atmosphere.",
  ny: "Set in the New York Financial District, featuring classic granite architecture and the iconic energy of Wall Street with a shallow depth of field.",
  paris: "Set on a chic Parisian cafe terrace with elegant classic architecture and soft, warm European morning light in the background.",
  studio: "Set in a high-end professional photography studio with a clean, solid minimalist backdrop and perfect professional softbox lighting."
};

export const CAMERA_ANGLE_DESCRIPTIONS: Record<string, string> = {
  eye_level: "captured at eye-level, direct and engaging perspective",
  low_angle: "captured from a slightly lower angle to project confidence and subtle authority",
  high_angle: "captured from a slightly higher angle for a friendly and approachable look",
  three_quarter: "three-quarter view perspective for a dynamic and professional profile",
  default: "captured at eye-level"
};

export const COLOR_PALETTE_DESCRIPTIONS: Record<string, string> = {
  monochromatic: "a minimalist monochromatic palette focusing on subtle tonal shifts for a high-fashion, cohesive professional aesthetic",
  analogous: "a balanced analogous palette using closely related professional hues for a smooth, sophisticated visual flow",
  complementary: "a bold complementary palette utilizing sophisticated contrasting accents to make the subject pop against the environment",
  default: "a professional and balanced color palette"
};

export const getTransformationPrompt = (
  outfit: string, 
  hairstyle: string, 
  background: string, 
  cameraAngle: string, 
  colorPalette: string,
  expression: string
) => {
  const outfitDesc = OUTFIT_DESCRIPTIONS[outfit] || OUTFIT_DESCRIPTIONS.default;
  const hairDesc = HAIRSTYLE_DESCRIPTIONS[hairstyle] || HAIRSTYLE_DESCRIPTIONS.default;
  const bgDesc = BACKGROUND_DESCRIPTIONS[background] || BACKGROUND_DESCRIPTIONS.berlin;
  const angleDesc = CAMERA_ANGLE_DESCRIPTIONS[cameraAngle] || CAMERA_ANGLE_DESCRIPTIONS.default;
  const colorDesc = COLOR_PALETTE_DESCRIPTIONS[colorPalette] || COLOR_PALETTE_DESCRIPTIONS.default;
  const exprDesc = EXPRESSION_DESCRIPTIONS[expression] || EXPRESSION_DESCRIPTIONS.default;

  return `Using the provided image as the primary reference, preserve the person’s facial features, skin tone, body structure, and identity with 100% accuracy.

Transform the image into a polished, high-end professional portrait with a confident, globally relevant presence.

Facial Presence: The subject must have ${exprDesc}. Maintain absolute likeness to the original face.
Overall Aesthetic: ${colorDesc}.
Style: modern, intelligent, calm authority, high-fidelity professional render.
Outfit: ${outfitDesc} suitable for an international professional context.
Hairstyle: ${hairDesc}, projecting a sophisticated and polished energy with feminine style.
Lighting: natural, soft, cinematic daylight or professional studio lighting depending on the location, with clean contrast and editorial quality.
Image quality: ultra-realistic, 8k resolution, editorial-grade photography.
Camera: ${angleDesc}, shallow depth of field, sharp focus on subject, subtle professional background blur (bokeh).
Background: ${bgDesc}
Mood: confident, thoughtful, globally connected, trustworthy, and analytical.

Strictly do not alter facial identity or exaggerate features. No distortion. Preserve all unique facial characteristics of the person in the original photo including eye shape, nose structure, and mouth proportions.`;
};
