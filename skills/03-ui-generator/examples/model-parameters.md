# AI Model Parameters Guide

## Midjourney

**Best for**: High-quality, artistic UI designs
**Strengths**: Excellent aesthetics, good at modern designs

**Parameters**:
```
--ar 16:9          # Aspect ratio
--v 6              # Version 6
--style raw        # For UI mockups (less artistic interpretation)
--q 2              # Quality (1=fast, 2=high quality)
--s 50             # Stylization (0-1000, lower for UI mockups)
```

**Example**:
```
/imagine modern dashboard UI design --ar 16:9 --v 6 --style raw --q 2
```

---

## DALL-E 3

**Best for**: Precise layouts, text rendering
**Strengths**: Good instruction following, clean outputs

**Parameters**:
```json
{
  "size": "1792x1024",      // landscape
  "quality": "hd",          // standard or hd
  "style": "natural"        // natural or vivid
}
```

**Example**:
```python
client.images.generate(
  model="dall-e-3",
  prompt="Clean mobile app login screen",
  size="1024x1792",
  quality="hd",
  style="natural"
)
```

---

## Stable Diffusion

**Best for**: Customizable, local generation
**Strengths**: Fine-tuned control, cost-effective

**Parameters**:
```
steps: 30-50               # More steps = better quality
cfg_scale: 7-9            # How closely to follow prompt
sampler: DPM++ 2M Karras  # Sampling method
size: 1024x768            # Resolution
negative_prompt: "blurry, low quality, distorted"
```

**Example**:
```python
pipe(
  prompt="Professional dashboard interface",
  negative_prompt="blurry, low quality, distorted, pixelated",
  num_inference_steps=40,
  guidance_scale=7.5,
  width=1024,
  height=768
)
```

---

## Adobe Firefly

**Best for**: Commercial use, brand-safe content
**Strengths**: Licensed training data, commercial-friendly

**Parameters**:
```
Content Type: Art, Photo, Graphic
Style: Choose from presets or custom
Aspect Ratio: Square, Portrait, Landscape, Widescreen
```
