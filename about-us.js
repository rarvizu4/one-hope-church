(() => {
  'use strict';
  const dictionary = {
    skip:'Saltar al contenido',back:'VOLVER AL INICIO',eyebrow:'CONOCE NUESTRA IGLESIA',title:'SOBRE <em>NOSOTROS.</em>',
    introLead:'One Hope Church / Iglesia Una Esperanza es una familia de fe bilingüe y centrada en Cristo, ubicada en Spring, Texas.',
    introBody:'Nos reunimos para adorar a Jesús, crecer en el conocimiento de la Palabra de Dios y caminar juntos en la fe. Nuestro deseo es dar la bienvenida a personas de todas las edades y trasfondos y ver vidas transformadas por Su Palabra.',
    valueOne:'FIRMES EN LA PALABRA',valueTwo:'CRECIENDO JUNTOS',valueThree:'VIVIENDO EN ESPERANZA',join:'ACOMPÁÑANOS ESTE DOMINGO',
    storyKicker:'UN TESTIMONIO DE LA FIDELIDAD DE DIOS',storyTitle:'NUESTRA <em>HISTORIA.</em>',
    storySubtitle:'De un llamado en 2017 a tener un hogar propio para nuestra iglesia.',
    storyOneTitle:'UN LLAMADO Y UN COMIENZO',
    storyOne:'En 2017, Dios puso en el corazón del pastor Misael Rodarte el llamado de comenzar una iglesia. Con unas cuantas familias que compartieron ese llamado, nació Iglesia Una Esperanza. Comenzamos rentando un lugar donde podíamos reunirnos, adorar y crecer juntos.',
    storyTwoTitle:'DIOS ABRE UNA PUERTA INESPERADA',
    storyTwo:'En 2021, Dios nos dio una oportunidad extraordinaria. La iglesia que era dueña del edificio nos ofreció vender toda la propiedad por tan solo $20,000. Lo que parecía fuera de nuestro alcance se hizo posible.',
    today:'HOY',storyThreeTitle:'UN HOGAR PROPIO PARA NUESTRA IGLESIA',
    storyThree:'Nuestra familia de fe ahorró e hizo ese pago, lo que permitió que Iglesia Una Esperanza adquiriera la propiedad, sin renta y sin hipoteca. Para nosotros, este edificio es mucho más que cuatro paredes. Es un testimonio de la provisión de Dios, de la fe de unas cuantas familias y de la esperanza de lo que Él seguirá haciendo.',
    storyClosing:'Lo que comenzó con un llamado se convirtió en un hogar.',
    galleryEyebrow:'ANTES Y AHORA / NUESTRO PRIMER HOGAR',galleryTitle:'NUESTROS COMIENZOS',
    gallerySubtitle:'Fotografías del santuario antes de su transformación.',
    joinKicker:'TU HISTORIA TAMBIÉN TIENE LUGAR AQUÍ.',joinHeadline:'HAY LUGAR<br>PARA <em>TI.</em>',joinCta:'ADORAR CON NOSOTROS',
    footer:'SPRING, TEXAS · UNA IGLESIA. UNA FAMILIA. UNA ESPERANZA.',footerBack:'VOLVER AL INICIO'
  };
  const originals = new Map();
  document.querySelectorAll('[data-i18n]').forEach(el => originals.set(el, el.innerHTML));
  function setLang(lang) {
    const es = lang === 'es';
    document.documentElement.lang = es ? 'es' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.innerHTML = es ? (dictionary[key] || originals.get(el)) : originals.get(el);
    });
    document.querySelectorAll('.lang-btn').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
    document.querySelector('.gallery-frame')?.setAttribute('aria-label',es ? 'Tres fotografías del santuario antiguo' : 'Three photographs of the old sanctuary');
    document.querySelector('#gallery-prev')?.setAttribute('aria-label',es ? 'Foto anterior del santuario' : 'Previous sanctuary photo');
    document.querySelector('#gallery-next')?.setAttribute('aria-label',es ? 'Siguiente foto del santuario' : 'Next sanctuary photo');
    try {localStorage.setItem('one-hope-language',lang)}catch(_){}
  }
  document.querySelectorAll('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>setLang(btn.dataset.lang)));
  let initialLang='en';
  try {if(localStorage.getItem('one-hope-language')==='es')initialLang='es'}catch(_){}
  setLang(initialLang);
  document.querySelector('#year').textContent = new Date().getFullYear();

  const track = document.querySelector('#gallery-track');
  const frame = document.querySelector('#gallery');
  const slides = [...track.children];
  const dots = [...document.querySelectorAll('.gallery-dot')];
  const counter = document.querySelector('#gallery-counter');
  let selected = 0;
  function show(index){
    selected = (index + slides.length) % slides.length;
    track.style.transform = `translate3d(-${selected * 100}%,0,0)`;
    counter.textContent = String(selected+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
    slides.forEach((slide,i)=>slide.setAttribute('aria-hidden',String(i!==selected)));
    dots.forEach((dot,i)=>{dot.classList.toggle('active',i===selected); if(i===selected)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});
  }
  document.querySelector('#gallery-prev').addEventListener('click',()=>show(selected-1));
  document.querySelector('#gallery-next').addEventListener('click',()=>show(selected+1));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
  frame.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();show(selected-1)}
    if(event.key==='ArrowRight'){event.preventDefault();show(selected+1)}
  });
  let touchStartX=null;
  frame.addEventListener('touchstart',event=>{touchStartX=event.changedTouches[0]?.screenX??null},{passive:true});
  frame.addEventListener('touchend',event=>{
    if(touchStartX===null)return;
    const delta=(event.changedTouches[0]?.screenX??touchStartX)-touchStartX;
    if(Math.abs(delta)>45)show(selected+(delta<0?1:-1));
    touchStartX=null;
  },{passive:true});
  show(0);
})();