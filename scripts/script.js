(function(){
  const root = document.documentElement;
  const body = document.body;
  const status = document.getElementById('ariaStatus');

  // Restaurar preferências
  const savedFont = localStorage.getItem('gv_font');
  const savedContrast = localStorage.getItem('gv_contrast');

  if (savedFont) root.style.setProperty('--base-font-size', savedFont);
  if (savedContrast === 'on') {
    body.classList.add('hc');
    const btn = document.getElementById('contrastToggle');
    if (btn) btn.setAttribute('aria-pressed', 'true');
  }

  // Toggle menu mobile
const navToggle = document.getElementById('nav-toggle');
const menu = document.getElementById('menu');
const overlay = document.querySelector('.overlay');

if (navToggle && menu && overlay) {
  const updateMenu = () => {
    const isOpen = navToggle.checked;
    navToggle.setAttribute('aria-expanded', isOpen);
    overlay.style.display = isOpen ? 'block' : 'none';
  };

  // Toggle menu ao clicar no hambúrguer
const navToggle = document.getElementById('nav-toggle');
const menu = document.getElementById('menu');
const overlay = document.querySelector('.overlay');

const updateOverlay = () => {
  overlay.style.display = navToggle.checked ? 'block' : 'none';
};

if (navToggle && menu && overlay) {
  // Toggle do checkbox controla o overlay
  navToggle.addEventListener('change', updateOverlay);

  // Fecha menu ao clicar em qualquer link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.checked = false;
      updateOverlay();
    });
  });

  // Fecha menu ao clicar no overlay
  overlay.addEventListener('click', () => {
    navToggle.checked = false;
    updateOverlay();
  });

  // Fecha menu ao clicar fora do menu e do toggle
  document.addEventListener('click', (e) => {
    if (
      navToggle.checked && 
      !menu.contains(e.target) &&
      e.target !== navToggle &&
      !e.target.closest('.nav-toggle-label') 
    ) {
      navToggle.checked = false;
      updateOverlay();
    }
  });

 
  menu.addEventListener('click', (e) => e.stopPropagation());
  overlay.addEventListener('click', (e) => e.stopPropagation());
}

 
  menu.addEventListener('click', e => e.stopPropagation());
}


  // Controles de fonte
  const clampFont = (px) => Math.max(14, Math.min(22, px));
  const setFont = (px) => {
    const val = clampFont(px) + 'px';
    root.style.setProperty('--base-font-size', val);
    localStorage.setItem('gv_font', val);
    if (status) status.textContent = `Tamanho da fonte: ${val}`;
  };

  document.getElementById('fontInc')?.addEventListener('click', () => {
    const current = parseFloat(getComputedStyle(root).getPropertyValue('--base-font-size'));
    setFont(current + 1);
  });
  document.getElementById('fontDec')?.addEventListener('click', () => {
    const current = parseFloat(getComputedStyle(root).getPropertyValue('--base-font-size'));
    setFont(current - 1);
  });

  // Acessibilidade: respeitar reduz-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('scroll-behavior','auto');
  }
})();


const skipLink = document.querySelector('.skip-link');
const mainContent = document.getElementById('conteudo');

skipLink.addEventListener('click', (e) => {
  e.preventDefault();        
  mainContent.setAttribute('tabindex', '-1'); 
  mainContent.focus();       
});
