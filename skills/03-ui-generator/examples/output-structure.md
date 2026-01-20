# Output Structure Guide

## Recommended Folder Structure

```
ui-mockups/
├── [component-name]/
│   ├── v1-variation-1.png
│   ├── v1-variation-2.png
│   ├── v1-variation-3.png
│   ├── v1-variation-4.png
│   ├── final-selected.png
│   └── generation-params.json
├── [screen-name]/
│   ├── desktop-view.png
│   ├── tablet-view.png
│   ├── mobile-view.png
│   └── generation-params.json
└── README.md
```

## File Naming Convention

**Format**: `[type]-[name]-[variant]-[version].[ext]`

**Examples**:
- `screen-login-ios-v1.png`
- `component-button-hover-v2.png`
- `page-dashboard-desktop-v3.png`

## Generation Parameters File

Save generation settings for reproducibility:

```json
{
  "component": "dashboard",
  "model": "midjourney",
  "prompt": "Modern web application dashboard...",
  "negative_prompt": "blurry, low quality...",
  "parameters": {
    "aspect_ratio": "16:9",
    "version": "6",
    "style": "raw",
    "quality": "2"
  },
  "variations": 4,
  "selected": "v1-variation-2.png",
  "timestamp": "2024-01-18T10:30:00Z"
}
```

## Export Formats

**PNG**: Best for UI mockups with transparency
- Use for: Components, screens with transparency
- Settings: 24-bit color, transparent background

**JPG**: Smaller file size, no transparency
- Use for: Full-page mockups, presentations
- Settings: 90-95% quality

**SVG**: Vector format (if applicable)
- Use for: Icons, simple components
- Note: Not all AI models support SVG output

**WebP**: Modern format, good compression
- Use for: Web presentations, documentation
- Settings: 85-90% quality

## Quality Checklist

Before finalizing outputs, verify:

- [ ] Layout matches requirements
- [ ] Colors are consistent with brand
- [ ] Typography is readable
- [ ] Spacing and alignment are correct
- [ ] Interactive elements are clearly visible
- [ ] Responsive considerations are addressed
- [ ] Accessibility standards are met
- [ ] No visual artifacts or distortions
- [ ] Text is legible (if applicable)
- [ ] Proper file naming and organization
