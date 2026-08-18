# NEXUS — Biological Engineering

> An animation-driven biotechnology landing page built around the idea of biological signals organizing into living structures.

**Live Demo:** https://nexusbiologicalengineering.netlify.app/
**Repository:** https://github.com/simmo0104/nexus-biological-engineering

---

## Overview

NEXUS is a fictional biotechnology company landing page developed for a **Creative Frontend Developer assessment**.

The goal was to create a premium, animation-driven interface that combines strong visual design with meaningful interaction rather than relying on decorative motion alone.

The central visual concept is a biological system progressing from independent signals into recognizable structures, reaching stability, and then adapting through controlled mutation.

The implementation uses **React, TypeScript, Tailwind CSS, GSAP, and Canvas 2D**.

---

## Assignment Coverage

The project was designed around the requirements of the assessment:

* Hero section with headline, CTA, and animated biotech visual
* About / Innovation section
* Technology / Research section
* Capabilities section
* Statistics / Impact section
* Final CTA
* Smooth scrolling and micro-interactions
* Scroll-triggered animations
* Interactive scientific visualization
* Responsive desktop, tablet, and mobile layouts
* Accessible interaction and reduced-motion support
* Performance-conscious canvas animation

The visual identity was designed independently rather than reproducing the supplied reference websites.

---

## Features

### Biological Visualization

The main technology section contains an interactive canvas visualization with four biological structures:

* Leaf vascular network
* DNA helix
* Cellular structure
* Branching growth pattern

Users can switch between structures while the particle system transitions into the selected formation.

### Six-Phase Animation System

The biological animation follows an explicit lifecycle:

```text
FLOAT
  ↓
ORGANIZE
  ↓
FORM
  ↓
STABILIZE
  ↓
BREATHE
  ↓
MUTATE
  ↓
FLOAT
```

Each phase has a different purpose:

| Phase       | Purpose                                           |
| ----------- | ------------------------------------------------- |
| `float`     | Particles move independently                      |
| `organize`  | Particles begin approaching structural targets    |
| `form`      | The selected structure becomes recognizable       |
| `stabilize` | Particles settle into position                    |
| `breathe`   | The structure receives subtle continuous movement |
| `mutate`    | Particles temporarily deviate from their targets  |

The mutation phase uses per-particle offsets so the structure changes without becoming completely unrecognizable.

---

## Animation & Interaction

### Canvas Animation

The biological system is implemented using Canvas 2D rather than a 3D/WebGL framework.

The animation loop uses:

* `requestAnimationFrame`
* delta-time based updates
* mutable particle state stored in refs
* normalized target coordinates
* explicit animation phases
* canvas resizing and device-pixel-ratio handling

Particle positions are deliberately kept outside React state because they change at frame frequency. This avoids unnecessary React renders while the canvas is being updated.

### Ambient Particle Network

The hero section contains a separate lightweight particle network.

It uses drifting particles and proximity-based connections to create an ambient scientific background without interfering with the primary biological visualization.

Particle density is reduced on smaller screens.

### Scroll Animations

GSAP and ScrollTrigger are used for:

* section reveals
* staggered content entrances
* count-up statistics
* viewport-based animation triggers

Animations are cleaned up through the React GSAP integration to avoid stale ScrollTrigger instances.

---

## Tech Stack

| Technology   | Purpose                                  |
| ------------ | ---------------------------------------- |
| React 18     | UI component architecture                |
| TypeScript   | Static typing                            |
| Vite         | Development and production build tooling |
| Tailwind CSS | Responsive styling                       |
| GSAP         | UI animation and ScrollTrigger           |
| @gsap/react  | GSAP integration with React              |
| Canvas 2D    | Biological particle visualization        |
| Lucide React | Interface icons                          |

### Why Canvas 2D?

The visualization only requires particles, lines, and predefined 2D biological structures.

Canvas 2D provides the required rendering capabilities without introducing the additional complexity of Three.js/WebGL for a problem that does not require 3D rendering.

---

## Architecture

```text
src/
├── components/
│   ├── biological/
│   │   ├── BiologicalFormation.tsx
│   │   ├── BiologicalStructures.ts
│   │   ├── ParticleNetwork.tsx
│   │   └── useBiologicalAnimation.ts
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Technology.tsx
│   │   ├── Capabilities.tsx
│   │   ├── Statistics.tsx
│   │   └── FinalCTA.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── SectionLabel.tsx
│   │   └── Stat.tsx
│   │
│   └── ContactModal.tsx
│
├── data/
│   ├── capabilities.ts
│   └── statistics.ts
│
├── hooks/
│   ├── useMediaQuery.ts
│   └── useReducedMotion.ts
│
├── lib/
│   └── animations.ts
│
├── types/
│   └── biological.ts
│
├── App.tsx
├── index.css
└── main.tsx
```

### Separation of Responsibilities

The biological system is divided into three main concerns:

**`BiologicalStructures.ts`**

Defines the geometry and target coordinates for each biological structure.

**`useBiologicalAnimation.ts`**

Controls particle state, animation phases, interpolation, mutation, and frame updates.

**`BiologicalFormation.tsx`**

Owns the canvas lifecycle, rendering, resizing, and integration with the React component tree.

This separation keeps the geometry, animation logic, and rendering responsibilities independent.

---

## Responsive Design

The layout adapts across desktop, tablet, and mobile breakpoints.

The canvas systems also respond to viewport changes rather than relying on fixed pixel coordinates.

Biological structures use normalized coordinates between `0` and `1`, which are scaled to the current canvas dimensions at render time.

The ambient particle network also reduces its particle count on smaller screens to keep the visual effect lightweight.

---

## Performance

Performance considerations were built into the animation architecture.

* Particle positions are stored in refs rather than React state.
* Animation uses `requestAnimationFrame`.
* Animation loops are cancelled when components unmount.
* Canvas rendering accounts for `devicePixelRatio`.
* `ResizeObserver` handles responsive canvas dimensions.
* GSAP contexts handle animation cleanup.
* Particle density is reduced on smaller screens.
* Biological formation particle counts are capped.

### Production Build

The current Vite production build completes successfully with TypeScript checking:

```text
vite v5.4.21 building for production...

1533 modules transformed

JavaScript: 307.67 kB
Gzip:       105.59 kB

CSS:         19.77 kB
Gzip:         4.87 kB
```

Build command:

```bash
npm run build
```

---

## Accessibility

Accessibility was considered alongside the visual implementation.

* Semantic HTML elements are used throughout the page.
* Interactive controls are keyboard accessible.
* Visible `focus-visible` states are provided.
* Decorative canvas elements are hidden from assistive technologies.
* Sections expose meaningful IDs and accessible relationships.
* `prefers-reduced-motion` is detected.
* Reduced-motion users receive a static biological representation instead of continuous animation.
* Core page content does not depend on the canvas animation to communicate information.

---

## Design Decisions

### Visual Language

The interface uses a dark navy foundation, restrained teal accents, and light typography.

The intent was to create a visual language closer to **scientific instrumentation and research interfaces** than a conventional technology landing page.

### Typography

The interface combines a clean sans-serif typeface for primary content with a monospace treatment for technical labels and metadata.

This creates a distinction between editorial content and technical information.

### Animation as Communication

The animation was designed around a specific concept rather than simply adding motion to the page.

Particles move from:

```text
signal → organization → structure → stability → mutation → adaptation
```

The resulting structures remain recognizable throughout the cycle.

### Normalized Biological Structures

Biological structures are represented using normalized coordinates instead of fixed canvas pixels.

This allows the same structure definitions to scale across different viewport sizes and keeps the geometry independent from the rendering implementation.

### Deliberately Excluded

The project intentionally does not use:

* Three.js / WebGL
* Physics engines
* Redux or global state management
* Heavy animation libraries beyond GSAP
* Mouse-driven interaction for the biological visualization

The goal was to use the smallest set of tools necessary to satisfy the visual and interaction requirements.

---

## Accessibility & Reduced Motion

When a user has enabled reduced motion:

```text
Animated canvas
      ↓
Motion preference detected
      ↓
Animation loop disabled
      ↓
Static biological structure rendered
```

This preserves the visual concept while avoiding continuous motion.

---

## Local Development

### Requirements

* Node.js
* npm

### Installation

```bash
git clone https://github.com/simmo0104/nexus-biological-engineering.git

cd nexus-biological-engineering

npm install
```

### Development

```bash
npm run dev
```

The development server runs at:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Deployment

The production build is deployed on Netlify.

**Live Demo:**
https://amazing-clafoutis-d4311b.netlify.app/

For a manual deployment:

```bash
npm run build
```

Deploy the generated `dist/` directory.

For a connected Git deployment:

```text
Build command: npm run build
Publish directory: dist
```

---

## Project Status

**Completed**

* [x] Responsive landing page
* [x] Biological particle visualization
* [x] Four interactive biological structures
* [x] Six-phase animation lifecycle
* [x] GSAP scroll animations
* [x] Animated statistics
* [x] Responsive canvas rendering
* [x] Reduced-motion support
* [x] Accessibility implementation
* [x] Production build
* [x] Netlify deployment

---

## License

This project was created as a frontend assessment and portfolio project.
