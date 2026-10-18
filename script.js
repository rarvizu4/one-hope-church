const toggle = document.querySelector('#menu-toggle');
const mobile = document.querySelector('#mobile-nav');
toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  mobile.hidden = isOpen;
});
mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobile.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

// Bilingual homepage: local translations with no paid service or API.
(() => {
  const translations = {
  ".skip-link": "Saltar al contenido",
  ".desktop-nav a[href=\"#about\"]": "Domingos",
  ".desktop-nav a[href=\"#ministries\"]": "Ministerios",
  ".desktop-nav a[href=\"#bible-study\"]": "Jueves",
  ".desktop-nav a[href=\"#announcements\"]": "Eventos",
  ".desktop-nav a[href=\"#watch\"]": "Ver",
  ".desktop-nav a[href=\"#give\"]": "Donar",
  ".mobile-nav a[href=\"#give\"]": "Donar",
  ".header-cta": "PLANEA TU VISITA",
  ".mobile-nav a[href=\"#about\"]": "Domingos",
  ".mobile-nav a[href=\"#ministries\"]": "Ministerios",
  ".mobile-nav a[href=\"#bible-study\"]": "Jueves",
  ".mobile-nav a[href=\"#announcements\"]": "Eventos",
  ".mobile-nav a[href=\"#watch\"]": "Ver",
  ".hero-eyebrow": "BIENVENIDOS A IGLESIA UNA ESPERANZA",
  ".hero h1": "TRANSFORMANDO<br>VIDAS A TRAVÉS<br>DE SU <em>PALABRA</em><span class=\"hero-period\">.</span>",
  ".hero-bottom p": "Comunidad verdadera. Enseñanza bíblica.<br>Una familia de fe arraigada en la esperanza.",
  ".hero-index": "01 / 04",
  ".sunday-feature-kicker": "<span class=\"sunday-feature-line\"></span> ACOMPÁÑANOS / 001",
  ".sunday-feature-tag": "REUNIÓN DOMINICAL",
  ".sunday-feature h2": "DOMINGOS A LAS<br><span>11AM Y 1PM</span><span class=\"sunday-feature-period\">.</span>",
  ".sunday-feature-description": "Cada domingo nos reunimos para adorar a Jesús, escuchar un mensaje de la Palabra de Dios y crecer juntos como familia de fe. Ya sea tu primera visita o si nos has acompañado antes, nos encantaría adorar contigo.",
  ".sunday-feature-welcome": "Acompáñanos en Spring, Texas. Tú y tu familia son bienvenidos.",
  ".sunday-feature-button.primary": "PLANEA TU VISITA",
  ".sunday-feature-button.secondary": "CÓMO LLEGAR",
  ".sunday-feature-media-label": "LOS DOMINGOS EN ONE HOPE",
  ".bible-study-kicker": "<span class=\"bible-study-line\" aria-hidden=\"true\"></span> ACOMPÁÑANOS / 002",
  ".bible-study-tag": "ESTUDIO BÍBLICO",
  ".bible-study-feature h2": "JUEVES A LAS<br><span>7PM</span><span class=\"bible-study-period\">.</span>",
  ".bible-study-description": "Acompáñanos cada jueves por la noche para un tiempo de oración, estudio bíblico y crecimiento en la Palabra de Dios. Fortalece tu fe y recibe ánimo junto a nuestra familia de iglesia.",
  ".bible-study-welcome": "¡Todos son bienvenidos! Trae tu Biblia y acompáñanos.",
  ".bible-study-media-label": "ESTUDIO BÍBLICO LOS JUEVES",
  ".ministries .section-kicker": "<span class=\"kicker-line\"></span> PARA CADA GENERACIÓN / 003",
  ".ministries .section-heading h2": "HAY UN<br>LUGAR PARA <i>TI.</i>",
  ".ministries .section-heading > p": "Nuestros niños descubren más del plan perfecto de redención de Dios, construyen amistades verdaderas, crecen en liderazgo y son preparados para impactar al mundo para Él.",
  ".kids .ministry-number": "EDADES 3–8",
  ".juniors .ministry-number": "EDADES 9–12",
  ".youth .ministry-number": "EDADES 13–18",
  ".kids h3": "UNA ESPERANZA<br>KIDS",
  ".juniors h3": "UNA ESPERANZA<br>JUNIORS",
  ".youth h3": "UNA ESPERANZA<br>YOUTH",
  ".meet .section-kicker": "<span class=\"kicker-line\"></span> CONOCE ONE HOPE / 004",
  ".meet h2": "MÁS QUE UNA<br><em>FAMILIA DE FE.</em>",
  ".meet-copy > p": "Iglesia Una Esperanza es una iglesia bilingüe en Spring, Texas, comprometida con transformar vidas por medio de Su Palabra. Existimos para ayudar a las personas a encontrarse con Jesús, crecer en la fe y construir relaciones duraderas centradas en Cristo.",
  ".meet-points li:nth-child(1)": "Predicación bíblica centrada en Jesús",
  ".meet-points li:nth-child(2)": "Adoración para toda la familia",
  ".meet-points li:nth-child(3)": "Comunidad real para cada generación",
  ".meet .button-dark": "PLANEA TU VISITA ",
  ".announcements h2": "PRÓXIMOS <em>EVENTOS</em><span aria-hidden=\"true\">:</span>",
  ".watch h2": "MIRA EL<br><em>MENSAJE MÁS RECIENTE.</em>",
  ".watch-heading-row > p": "¿No puedes venir en persona? Acompáñanos en línea y ponte al día con nuestros mensajes más recientes y contenido de nuestra iglesia.",
  ".instagram-heading-row h2": "MANTENTE<br><em>CONECTADO.</em>",
  ".instagram-heading-row > p": "Mira lo que está sucediendo durante la semana y mantente al día con nuestros próximos eventos.",
  ".give-kicker": "APOYA LA MISIÓN",
  ".give-strip h2": "FORMAS DE <em>DAR.</em>",
  ".give-caption": "Tu generosidad apoya el ministerio de Iglesia Una Esperanza.",
  ".give-inperson .give-method-eyebrow": "EN PERSONA",
  ".give-inperson-name": "Efectivo / Cheque",
  ".give-card-text": "DONAR CON TARJETA",
  ".location-section > .section-kicker": "<span class=\"kicker-line\"></span> ENCUÉNTRANOS / 006",
  ".location-heading-row h2": "ENCUENTRA<br><em>EL CAMINO.</em>",
  ".location-details p": "Nos encantaría recibirte. Toca el mapa para abrir nuestra ubicación en Google Maps y obtener indicaciones.",
  ".location-directions": "CÓMO LLEGAR",
  ".map-open-label": "ABRIR EN GOOGLE MAPS",
  ".social-connect-eyebrow": "IGLESIA UNA ESPERANZA · SIGUE EN CONTACTO",
  ".social-connect h2": "MANTENTE CONECTADO<span aria-hidden=\"true\">.</span>",
  ".social-connect p": "Mantente cerca de nuestra familia de fe durante la semana.",
  ".footer-top > span": "UNA IGLESIA. UNA FAMILIA. UNA ESPERANZA.",
  ".footer-bottom > span:first-child": "© <span id=\"year\"></span> IGLESIA UNA ESPERANZA",
  ".footer-bottom > a": "VOLVER ARRIBA "
};
  let announcementEvents = [];
  let currentAnnouncementLanguage = 'en';
  function renderAnnouncements(language) {
    const host = document.querySelector('#announcements-list');
    if (!host) return;
    const es = language === 'es';
    host.replaceChildren();
    const upcoming = announcementEvents.filter(event => {
      if (!event.endsAt) return true;
      const expires = new Date(event.endsAt);
      return !Number.isNaN(expires.valueOf()) && expires.getTime() > Date.now();
    }).sort((a, b) => new Date(a.startsAt || 0) - new Date(b.startsAt || 0));
    if (!upcoming.length) {
      const empty = document.createElement('p');
      empty.className = 'announcement-empty';
      empty.textContent = es ? 'No hay próximos eventos anunciados. ¡Vuelve pronto!' : 'No upcoming events have been announced. Check back soon!';
      host.append(empty);
      return;
    }
    upcoming.forEach(event => {
      const card = document.createElement('article');
      card.className = 'announcement-card';
      const photoLink = document.createElement('a');
      photoLink.className = 'announcement-photo';
      photoLink.href = event.flyerUrl || event.image || '#announcements';
      photoLink.target = '_blank';
      photoLink.rel = 'noopener noreferrer';
      photoLink.setAttribute('aria-label', es ? 'Ver el volante del evento' : 'View event flyer');
      const photo = document.createElement('img');
      photo.src = event.image;
      photo.alt = es ? (event.imageAltEs || event.titleEs || 'Volante del evento') : (event.imageAltEn || event.titleEn || 'Event flyer');
      photo.loading = 'lazy';
      photo.decoding = 'async';
      photoLink.append(photo);
      const details = document.createElement('div');
      details.className = 'announcement-details';
      const title = document.createElement('h3');
      title.textContent = es ? (event.titleEs || event.titleEn) : event.titleEn;
      const date = document.createElement('p');
      date.className = 'announcement-date';
      date.textContent = es ? (event.dateEs || event.dateEn) : event.dateEn;
      const description = document.createElement('p');
      description.className = 'announcement-description';
      description.textContent = es ? (event.descriptionEs || event.descriptionEn) : event.descriptionEn;
      details.append(title, date, description);
      if (event.flyerUrl || event.image) {
        const view = document.createElement('a');
        view.className = 'announcement-link';
        view.href = event.flyerUrl || event.image;
        view.target = '_blank';
        view.rel = 'noopener noreferrer';
        view.textContent = es ? 'VER FLYER' : 'VIEW FLYER';
        details.append(view);
      }
      card.append(photoLink, details);
      host.append(card);
    });
  }
  const originals = new Map();
  const nodes = [];
  Object.entries(translations).forEach(([selector, spanish]) => {
    const node = document.querySelector(selector);
    if (!node) { console.warn('Missing translation selector:', selector); return; }
    originals.set(node, node.innerHTML);
    nodes.push([node, spanish]);
  });
  const description = document.querySelector('meta[name="description"]');
  const defaultDescription = description?.content;
  const defaultTitle = document.title;
  const buttons = document.querySelectorAll('.lang-btn');
  function setLanguage(language) {
    currentAnnouncementLanguage = language;
    renderAnnouncements(language);
    const es = language === 'es';
    nodes.forEach(([node, spanish]) => { node.innerHTML = es ? spanish : originals.get(node); });
    document.documentElement.lang = es ? 'es' : 'en';
    document.title = es ? 'Iglesia Una Esperanza | Transformando vidas por Su Palabra' : defaultTitle;
    if (description) description.content = es ? 'Iglesia Una Esperanza: un lugar para pertenecer, crecer en la fe y seguir a Jesús juntos.' : defaultDescription;
    buttons.forEach(btn => {
      const active = btn.dataset.lang === language;
      btn.setAttribute('aria-pressed', String(active));
      btn.classList.toggle('active', active);
    });
    const ministryLabels = {
      kids: es ? 'Conoce Una Esperanza Kids, edades de 3 a 8 años' : 'Learn about One Hope Kids, ages 3 through 8',
      juniors: es ? 'Conoce Una Esperanza Juniors, edades de 9 a 12 años' : 'Learn about One Hope Juniors, ages 9 through 12',
      youth: es ? 'Conoce Una Esperanza Youth, edades de 13 a 18 años' : 'Learn about One Hope Youth, ages 13 through 18'
    };
    Object.entries(ministryLabels).forEach(([name,label]) => document.querySelector('.ministry-card.' + name)?.setAttribute('aria-label',label));
    document.querySelector('.hero-photo')?.setAttribute('aria-label', es ? 'Comunidad reunida para adorar' : 'A community gathered for worship');
    document.querySelector('.photo-band')?.setAttribute('aria-label', es ? 'Nuestra comunidad de fe' : 'Church community');
    document.querySelector('.give-methods')?.setAttribute('aria-label', es ? 'Formas de dar' : 'Giving options');
    document.querySelector('.give-card-link')?.setAttribute('aria-label', es ? 'Donar con tarjeta a través de Square, se abre en otra pestaña' : 'Give by card using Square, opens in a new tab');
    document.querySelector('.give-photo img')?.setAttribute('alt', es ? 'Una bandeja de ofrendas durante un servicio de adoración' : 'A church offering plate being passed during worship');
    document.querySelector('.hero-socials a[href="https://www.youtube.com/@iglesiaunaesperanza4112"]')?.setAttribute('aria-label', es ? 'Visita nuestro canal de YouTube' : 'Visit our YouTube channel');
    try { localStorage.setItem('one-hope-language', language); } catch (_) {}
    document.querySelector('#year').textContent = new Date().getFullYear();
  }
  buttons.forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
  let saved = 'en';
  try { if (localStorage.getItem('one-hope-language') === 'es') saved = 'es'; } catch (_) {}
  setLanguage(saved);
  fetch('announcements.json', { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Could not load announcements');
      return response.json();
    })
    .then(data => {
      announcementEvents = Array.isArray(data) ? data : [];
      renderAnnouncements(currentAnnouncementLanguage);
    })
    .catch(error => {
      console.warn(error);
      const host = document.querySelector('#announcements-list');
      if (host) {
        const p = document.createElement('p');
        p.className = 'announcement-empty';
        p.textContent = currentAnnouncementLanguage === 'es' ? 'No fue posible cargar los anuncios.' : 'Announcements are temporarily unavailable.';
        host.replaceChildren(p);
      }
    });
})();
