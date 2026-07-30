document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  const ariaStatus = document.getElementById('ariaStatus');

  /*
   * =========================================================
   * PREFERÊNCIAS DE ACESSIBILIDADE
   * =========================================================
   */

  const savedFontSize = localStorage.getItem('gv_font');

  if (savedFontSize) {
    root.style.setProperty('--base-font-size', savedFontSize);
  }

  const announce = (message) => {
    if (!ariaStatus) return;

    ariaStatus.textContent = '';

    window.setTimeout(() => {
      ariaStatus.textContent = message;
    }, 100);
  };

  /*
   * =========================================================
   * CONTROLE DO TAMANHO DA FONTE
   * =========================================================
   */

  const fontIncreaseButton = document.getElementById('fontInc');
  const fontDecreaseButton = document.getElementById('fontDec');

  const getCurrentFontSize = () => {
    const value = getComputedStyle(root)
      .getPropertyValue('--base-font-size')
      .trim();

    const parsedValue = parseFloat(value);

    return Number.isNaN(parsedValue) ? 16 : parsedValue;
  };

  const setFontSize = (size) => {
    const minimumSize = 14;
    const maximumSize = 22;
    const newSize = Math.min(maximumSize, Math.max(minimumSize, size));
    const formattedSize = `${newSize}px`;

    root.style.setProperty('--base-font-size', formattedSize);
    localStorage.setItem('gv_font', formattedSize);

    announce(`Tamanho da fonte alterado para ${newSize} pixels.`);
  };

  fontIncreaseButton?.addEventListener('click', () => {
    setFontSize(getCurrentFontSize() + 1);
  });

  fontDecreaseButton?.addEventListener('click', () => {
    setFontSize(getCurrentFontSize() - 1);
  });

  /*
   * =========================================================
   * MENU MOBILE
   * =========================================================
   */

  const navToggle = document.getElementById('nav-toggle');
  const navToggleLabel = document.querySelector('.nav-toggle-label');
  const menu = document.getElementById('menu');
  const overlay = document.querySelector('.overlay');

  const isMobileMenuOpen = () => {
    return Boolean(navToggle?.checked);
  };

  const updateMobileMenu = () => {
    if (!navToggle) return;

    const isOpen = navToggle.checked;

    navToggle.setAttribute('aria-expanded', String(isOpen));

    if (navToggleLabel) {
      navToggleLabel.setAttribute(
        'aria-label',
        isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
      );
    }

    if (overlay) {
      overlay.setAttribute('aria-hidden', String(!isOpen));
    }

    body.classList.toggle('menu-open', isOpen);

    announce(isOpen ? 'Menu aberto.' : 'Menu fechado.');
  };

  const closeMobileMenu = () => {
    if (!navToggle || !navToggle.checked) return;

    navToggle.checked = false;
    updateMobileMenu();
  };

  if (navToggle && menu) {
    navToggle.setAttribute('aria-expanded', 'false');

    navToggleLabel?.setAttribute('role', 'button');
    navToggleLabel?.setAttribute('tabindex', '0');
    navToggleLabel?.setAttribute('aria-controls', 'menu');
    navToggleLabel?.setAttribute(
      'aria-label',
      'Abrir menu de navegação'
    );

    navToggle.addEventListener('change', updateMobileMenu);

    navToggleLabel?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      navToggle.checked = !navToggle.checked;
      updateMobileMenu();
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    overlay?.addEventListener('click', closeMobileMenu);

    document.addEventListener('click', (event) => {
      if (!isMobileMenuOpen()) return;

      const clickedInsideMenu = menu.contains(event.target);
      const clickedToggle = navToggleLabel?.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMobileMenu();
      }
    });
  }

  /*
   * =========================================================
   * LINK "PULAR PARA O CONTEÚDO"
   * =========================================================
   */

  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('conteudo');

  skipLink?.addEventListener('click', (event) => {
    if (!mainContent) return;

    event.preventDefault();

    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();

    mainContent.addEventListener(
      'blur',
      () => {
        mainContent.removeAttribute('tabindex');
      },
      { once: true }
    );
  });

  /*
   * =========================================================
   * CABEÇALHO AO ROLAR A PÁGINA
   * =========================================================
   */

  const topbar = document.querySelector('.topbar');

  const updateHeaderOnScroll = () => {
    if (!topbar) return;

    topbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  updateHeaderOnScroll();

  window.addEventListener('scroll', updateHeaderOnScroll, {
    passive: true
  });

  /*
   * =========================================================
   * ROLAGEM SUAVE
   * =========================================================
   */

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  document
    .querySelectorAll('a[href^="#"]:not([href="#"])')
    .forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');

        if (!targetId) return;

        const targetElement = document.querySelector(targetId);

        if (!targetElement) return;

        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });

        history.replaceState(null, '', targetId);
      });
    });

  /*
   * =========================================================
   * DESTACAR ITEM ATIVO DO MENU
   * =========================================================
   */

  const sections = document.querySelectorAll(
    'main section[id]'
  );

  const menuLinks = document.querySelectorAll(
    '.menu a[href^="#"]'
  );

  const setActiveMenuLink = (sectionId) => {
    menuLinks.forEach((link) => {
      const isActive =
        link.getAttribute('href') === `#${sectionId}`;

      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio -
              firstEntry.intersectionRatio
          );

        const currentSection = visibleSections[0];

        if (currentSection?.target?.id) {
          setActiveMenuLink(currentSection.target.id);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.05, 0.25, 0.5, 0.75]
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
/*
 * =========================================================
 * ANIMAÇÕES AO ROLAR
 * =========================================================
 */

const revealElements = document.querySelectorAll('.reveal');

if (
  !prefersReducedMotion &&
  'IntersectionObserver' in window
) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add('visible');
  });
}

/* Garante que os elementos do hero apareçam imediatamente */
document
  .querySelectorAll('.hero .reveal')
  .forEach((element) => {
    element.classList.add('visible');
  });


  /*
   * =========================================================
   * CHATBOT
   * =========================================================
   */

  const chatbot = document.getElementById('chatbot');
  const chatbotToggle = document.getElementById('chatbotToggle');
  const closeChatbotButton =
    document.getElementById('closeChatbot');
  const chatbotMessages =
    document.getElementById('chatbotMessages');
  const questionButtons =
    document.querySelectorAll('.question-btn');

  const chatbotResponses = {
    1: 'O GUIAVOZ é um projeto de acessibilidade que auxilia pessoas com deficiência visual durante a locomoção. O sistema utiliza sensores, comunicação Bluetooth e um aplicativo para emitir alertas por voz, som e vibração.',

    2: 'O sistema funciona em quatro etapas: o sensor identifica um obstáculo ou ponto importante, envia os dados por Bluetooth, o aplicativo recebe as informações e apresenta um alerta acessível ao usuário.',

    3: 'O GUIAVOZ foi desenvolvido principalmente para pessoas com deficiência visual. Ele também pode ajudar idosos, pessoas com baixa visão e usuários que precisem de orientação em ambientes internos.',

    4: 'O GUIAVOZ é um projeto acadêmico em desenvolvimento. Atualmente, o aplicativo e o protótipo estão sendo preparados para testes e demonstrações em ambientes como faculdades, hospitais e espaços públicos.'
  };

  let chatbotLastFocusedElement = null;
  let chatbotResponseTimeout = null;

  const isChatbotOpen = () => {
    return Boolean(chatbot?.classList.contains('active'));
  };

  const openChatbot = () => {
    if (!chatbot || !chatbotToggle) return;

    chatbotLastFocusedElement = document.activeElement;

    chatbot.classList.add('active');
    chatbotToggle.setAttribute('aria-expanded', 'true');
    chatbot.setAttribute('aria-hidden', 'false');

    window.setTimeout(() => {
      closeChatbotButton?.focus();
    }, 200);

    announce('Assistente do GUIAVOZ aberto.');
  };

  const closeChatbot = () => {
    if (!chatbot || !chatbotToggle) return;

    chatbot.classList.remove('active');
    chatbotToggle.setAttribute('aria-expanded', 'false');
    chatbot.setAttribute('aria-hidden', 'true');

    if (chatbotResponseTimeout) {
      clearTimeout(chatbotResponseTimeout);
      chatbotResponseTimeout = null;
    }

    if (
      chatbotLastFocusedElement instanceof HTMLElement
    ) {
      chatbotLastFocusedElement.focus();
    }

    announce('Assistente do GUIAVOZ fechado.');
  };

  const toggleChatbot = () => {
    if (isChatbotOpen()) {
      closeChatbot();
    } else {
      openChatbot();
    }
  };

  const addChatbotMessage = (text, type) => {
    if (!chatbotMessages || !text) return;

    const message = document.createElement('div');

    message.className = `message ${type}-message`;
    message.textContent = text;

    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop =
      chatbotMessages.scrollHeight;
  };

  const addTypingIndicator = () => {
    if (!chatbotMessages) return null;

    const typingIndicator = document.createElement('div');

    typingIndicator.className =
      'message bot-message typing-message';

    typingIndicator.setAttribute(
      'aria-label',
      'Assistente está digitando'
    );

    typingIndicator.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    chatbotMessages.appendChild(typingIndicator);
    chatbotMessages.scrollTop =
      chatbotMessages.scrollHeight;

    return typingIndicator;
  };

  if (chatbot && chatbotToggle) {
    chatbotToggle.setAttribute('aria-expanded', 'false');
    chatbotToggle.setAttribute('aria-controls', 'chatbot');
    chatbot.setAttribute('aria-hidden', 'true');

    chatbotToggle.addEventListener('click', toggleChatbot);

    closeChatbotButton?.addEventListener(
      'click',
      closeChatbot
    );

    questionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const questionNumber =
          button.getAttribute('data-question');

        const questionText =
          button.textContent?.trim();

        const response =
          chatbotResponses[questionNumber];

        if (!questionText || !response) return;

        addChatbotMessage(questionText, 'user');

        button.disabled = true;

        const typingIndicator = addTypingIndicator();

        chatbotResponseTimeout = window.setTimeout(() => {
          typingIndicator?.remove();

          addChatbotMessage(response, 'bot');

          button.disabled = false;
          button.focus();

          chatbotResponseTimeout = null;

          announce('Nova resposta do assistente.');
        }, 600);
      });
    });

    document.addEventListener('click', (event) => {
      if (!isChatbotOpen()) return;

      const clickedInsideChatbot =
        chatbot.contains(event.target);

      const clickedToggle =
        chatbotToggle.contains(event.target);

      if (!clickedInsideChatbot && !clickedToggle) {
        closeChatbot();
      }
    });
  }

  /*
   * =========================================================
   * TECLA ESC
   * =========================================================
   */

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (isChatbotOpen()) {
      closeChatbot();
      return;
    }

    if (isMobileMenuOpen()) {
      closeMobileMenu();
      navToggleLabel?.focus();
    }
  });

  /*
   * =========================================================
   * VÍDEO DA DEMONSTRAÇÃO
   * =========================================================
   */

  const demonstrationVideo =
    document.querySelector('#galeria video');

  demonstrationVideo?.addEventListener('play', () => {
    announce('Vídeo de demonstração iniciado.');
  });

  demonstrationVideo?.addEventListener('pause', () => {
    announce('Vídeo de demonstração pausado.');
  });

  /*
   * =========================================================
   * LINKS EXTERNOS
   * =========================================================
   */

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach((link) => {
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }

      const currentLabel =
        link.getAttribute('aria-label') ||
        link.textContent?.trim();

      if (
        currentLabel &&
        !currentLabel.includes('nova aba')
      ) {
        link.setAttribute(
          'aria-label',
          `${currentLabel} — abre em uma nova aba`
        );
      }
    });

  /*
   * =========================================================
   * ANO AUTOMÁTICO NO RODAPÉ
   * =========================================================
   */

  const currentYearElement =
    document.getElementById('currentYear');

  if (currentYearElement) {
    currentYearElement.textContent =
      new Date().getFullYear();
  }
});

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

    themeToggle.textContent="☀️";

}

themeToggle?.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    const dark=document.body.classList.contains("dark");

    themeToggle.textContent=dark?"☀️":"🌙";

    localStorage.setItem("theme",dark?"dark":"light");

});
