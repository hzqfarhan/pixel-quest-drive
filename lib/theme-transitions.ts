// ═══════════════════════════════════════════════════════
// THEME TRANSITIONS — Cinematic Day/Night Swap
// ═══════════════════════════════════════════════════════

export async function triggerThemeTransition(goingNight: boolean): Promise<void> {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      transition: opacity 0.3s ease;
      opacity: 0;
      background: ${goingNight
        ? 'radial-gradient(ellipse at center, #1a1a40 0%, #0d0d22 100%)'
        : 'radial-gradient(ellipse at center, #FFE066 0%, #FFB74D 100%)'};
    `;
    document.body.appendChild(overlay);

    // Flash in
    requestAnimationFrame(() => {
      overlay.style.opacity = goingNight ? '0.55' : '0.40';
    });

    setTimeout(() => {
      // Fade out
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 350);
    }, 280);
  });
}
