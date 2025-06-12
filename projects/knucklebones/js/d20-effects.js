// Special effects for Knucklebones d20 rolls
// Adds explosion/fumble and critical/celebration effects

export function showD20FumbleEffect(target) {
    const effect = document.createElement('div');
    effect.className = 'd20-fumble-effect';
    effect.innerHTML = `💥<span class="fumble-text">FUMBLE!</span>`;
    target.appendChild(effect);
    setTimeout(() => effect.remove(), 1200);
}

export function showD20CritEffect(target) {
    const effect = document.createElement('div');
    effect.className = 'd20-crit-effect';
    effect.innerHTML = `🎉<span class="crit-text">CRITICAL!</span>✨`;
    target.appendChild(effect);
    setTimeout(() => effect.remove(), 1200);
}
