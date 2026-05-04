<p align="center">
  <a href="https://crafterstation.com" target="_blank">
    <img src="https://raw.githubusercontent.com/Railly/crafter-station/main/public/logo.png" height="64">
  </a>
  <br />
  <h1 align="center">zero0agents</h1>
</p>

<div align="center">

[![Built with Crafter Station](https://img.shields.io/badge/built%20with-Crafter%20Station-orange)](https://crafterstation.com)
[![Discord](https://img.shields.io/discord/856971667393609759?logo=discord)](https://discord.gg/NRDWrGnxTU)
[![Twitter](https://img.shields.io/twitter/follow/crafterstation)](https://twitter.com/crafterstation)

</div>

## About

3D Polaroid photo gallery corridor - An immersive 3D tunnel viewer for photos built with React Three Fiber. Navigate through an infinite corridor of polaroid-style photos with smooth controls and cinematic lighting.

## Tech Stack

- **Framework**: Next.js 15
- **3D Engine**: React Three Fiber + Drei
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Linting**: Biome
- **Runtime**: Bun

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Infinite 3D corridor with polaroid-style photo frames
- Scroll to navigate depth, drag to rotate view
- Pinch/wheel zoom support
- Click-to-fly photo selection with modal view
- LOD system for performance optimization
- Mobile touch support
- Cinematic lighting with distance falloff

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run Biome linter |
| `bun format` | Format code with Biome |

## Deployment

Deployed on [Vercel](https://vercel.com)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT
