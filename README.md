# ⚡ Synapse Link — Advanced Canvas Game

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-0a0a1a?style=for-the-badge&logo=github&logoColor=white)](https://mrchandrayee.github.io/synapse-link/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**Synapse Link** — An advanced **HTML5 Canvas browser game** featuring neon visuals, real-time shooting mechanics, progressive levels, health system, and score tracking. Pure JavaScript — no frameworks, no libraries.

---

## 🎮 Gameplay

- 🕹️ **Move** — Move your mouse to control the player
- 🔫 **Shoot** — Click to fire at incoming enemies
- 📊 **Score** — Earn points by destroying enemies
- 🏆 **Levels** — Difficulty increases as you progress
- ❤️ **Health** — Manage your signal strength to survive
- 💀 **Game Over** — "Connection Lost" when health hits zero

---

## ✨ Features

- 🎨 **Neon dark theme** with glowing visual effects
- 📐 **Full-screen canvas** — scales to any screen size
- 🔄 **Animated HUD** — live score, level & health bar
- 🚀 **Progressive difficulty** — enemies scale with levels
- 🖥️ **Smooth 60fps** game loop with `requestAnimationFrame`
- 📱 **Responsive canvas** — resizes on window change
- ⚡ **Zero dependencies** — pure HTML, CSS & JavaScript

---

## 🚀 Live Demo

👉 **[https://mrchandrayee.github.io/synapse-link/](https://mrchandrayee.github.io/synapse-link/)**

---

## 🛠️ Run Locally

```bash
open index.html
```

---

## 📁 Project Structure

```
synapse-link/
├── index.html   # Game UI, HUD, menus & canvas
├── style.css    # Neon dark theme & layout
├── game.js      # Game engine — player, enemies, shooting, levels
└── README.md
```

---

## 💻 Tech Highlights

```javascript
// 60fps game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // update + draw player, enemies, bullets
  animationId = requestAnimationFrame(gameLoop);
}

// Responsive canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
```

---

## 🏷️ Topics

`canvas-game` `html5-game` `javascript-game` `browser-game` `html-css-js` `frontend` `game-development` `neon`

---

## 👨‍💻 Author

**mrchandrayee** · [GitHub](https://github.com/mrchandrayee) · [Profile](https://github.com/mrchandrayee/mrchandrayee)

## 📄 License

[MIT License](./LICENSE)
