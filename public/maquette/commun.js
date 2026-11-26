// Boucle muette : démarre seule sauf si le visiteur a demandé « mouvement réduit » ; un bouton la met en pause.
const boucle = document.querySelector('.boucle');
const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
const bPause = document.querySelector('.pause');
if (boucle) {
  const maj = () => {
    if (!bPause) return;
    bPause.dataset.etat = boucle.paused ? 'pause' : 'lecture';
    bPause.setAttribute('aria-label', boucle.paused ? 'Play the loop' : 'Pause the loop');
  };
  boucle.addEventListener('play', maj);
  boucle.addEventListener('pause', maj);
  if (!reduit) boucle.play().catch(maj);
  maj();
  bPause?.addEventListener('click', () => (boucle.paused ? boucle.play() : boucle.pause()));
}

// La séance : le film complet, avec le son, par-dessus la page.
const seance = document.createElement('div');
seance.className = 'seance';
seance.setAttribute('role', 'dialog');
seance.setAttribute('aria-modal', 'true');
seance.setAttribute('aria-label', 'HAL01');
seance.innerHTML = '<video playsinline controls preload="none" poster="/media/hal01-affiche-v1.jpg"></video>' +
                   '<button class="fermer" type="button">Close</button>';
document.body.append(seance);
const film = seance.querySelector('video');
const bFermer = seance.querySelector('.fermer');
let retour = null;

function ouvrir() {
  retour = document.activeElement;
  if (!film.getAttribute('src')) film.src = '/media/hal01-film-v1.mp4';
  boucle?.pause();
  seance.classList.add('ouverte');
  film.currentTime = 0;
  film.play().catch(() => {});
  bFermer.focus();
}
function fermer() {
  film.pause();
  seance.classList.remove('ouverte');
  if (boucle && !reduit) boucle.play().catch(() => {});
  retour?.focus();
}
document.querySelectorAll('[data-film]').forEach((b) => b.addEventListener('click', ouvrir));
bFermer.addEventListener('click', fermer);
addEventListener('keydown', (e) => { if (e.key === 'Escape' && seance.classList.contains('ouverte')) fermer(); });
