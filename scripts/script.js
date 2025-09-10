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
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  if (navToggle && menu) {
    navToggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
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

  // Alto contraste
  const contrastBtn = document.getElementById('contrastToggle');
  contrastBtn?.addEventListener('click', () => {
    const active = body.classList.toggle('hc');
    contrastBtn.setAttribute('aria-pressed', String(active));
    localStorage.setItem('gv_contrast', active ? 'on' : 'off');
    if (status) status.textContent = active ? 'Alto contraste ativado' : 'Alto contraste desativado';
  });

  // Formulário de contato (demonstração)
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = data.get('nome');
    alert(`Obrigado, ${nome || 'pessoa'}! Sua mensagem foi registrada (exemplo).`);
    form.reset();
  });

  // Acessibilidade: respeitar reduz-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('scroll-behavior','auto');
  }
})();


const skipLink = document.querySelector('.skip-link');
const mainContent = document.getElementById('conteudo');

skipLink.addEventListener('click', (e) => {
  e.preventDefault();        // previne scroll padrão
  mainContent.setAttribute('tabindex', '-1'); // permite focar
  mainContent.focus();       // move o foco para o main
});
