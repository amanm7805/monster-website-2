# Monster Energy Zero Sugar - Cinematic Scroll Experience

An immersive, full-screen, high-performance scroll-driven web experience for **Monster Energy Zero Sugar**. Built with native vanilla web technologies and styled with Tailwind CSS, this website utilizes a high-frequency HTML5 Canvas rendering loop to animate a 3D product sequence fluidly based on user scroll positions.

👉 **Preview the Website**: [Deploy to Vercel in 1-Click](#-deploying-to-vercel)

---

## Key Features

1. **Sub-Frame Canvas Animation Engine**:
   - Asynchronously preloads 228 image frames with an active charging loader.
   - Calculates viewport boundary ratios dynamically to draw and center-crop the frames, matching real Retina/DPR densities.
   - Continuous floating-point targeting eliminates steps and snaps frame snapping strictly during paint ticks, ensuring infinitely fluid scrolling transitions.

2. **Parallax Content Layers**:
   - Visual scroll animation plays seamlessly in a locked background container (`position: fixed`).
   - Glowing title overlays fade out and slide up between `0%` and `30%` of the scroll.
   - Beautiful value grids and footer slide up vertically to overlap the canvas as the animation reaches the final frame.

3. **Event-Delegated Custom Cursor**:
   - A smooth, spring-interpolated cursor follower tracks pointer coordinates.
   - Utilizes advanced document-level event delegation (`mouseover` / `target.closest()`) to dynamically expand the glowing green cursor halo over all nav items, buttons, and links without rebinding overhead.

4. **100% Vercel & Static Hosting Ready**:
   - The project is fully structured as a static frontend app. No complex build pipelines or bundlers are required—it is plug-and-play ready for static edge networks.

---

## Local Development

You can run the local server using Python 3:

```bash
# Launch the smart local server
python3 serve.py
```

Open **[http://localhost:8000](http://localhost:8000)** in your browser. The server automatically escalates ports if `8000` is currently bound.

---

## 🚀 Deploying to Vercel

This repository is optimized for one-click deployment on **Vercel**:

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project**.
3. Import this repository `monster-website-2`.
4. Vercel will automatically detect the static project. Under **Build & Development Settings**, leave everything at default.
5. Click **Deploy**. Your cinematic scrolling site will be live at a global edge domain in less than 30 seconds!

---

## Project Structure

```
├── index.html                  # Core layout structure, loader overlay, and Tailwind grid/footer
├── style.css                   # Layout sheets, canvas wraps, preloader, and cursor follower variables
├── app.js                      # Image sequences preloader, lerp-scroll calculator, and mouse physics
├── serve.py                    # Smart local python 3 web server launcher
├── .gitignore                  # Prevents committing metadata clutter and bulky installers
└── ezgif-6434652fda05ab12-jpg/ # 228-frame image sequence assets
```
