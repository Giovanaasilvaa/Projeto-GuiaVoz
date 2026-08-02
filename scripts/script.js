document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     CONFIGURAÇÕES INICIAIS
  ========================================== */

  const root = document.documentElement;
  const body = document.body;
  const ariaStatus = document.getElementById("ariaStatus");

  function announce(message) {
    if (!ariaStatus) return;
    ariaStatus.textContent = "";
    setTimeout(() => {
      ariaStatus.textContent = message;
    }, 100);
  }

  /* ==========================================
     TAMANHO DA FONTE (A+ / A-)
  ========================================== */

  const btnInc = document.getElementById("fontInc");
  const btnDec = document.getElementById("fontDec");

  const MIN_FONT = 14;
  const MAX_FONT = 20;
  const DEFAULT_FONT = 16;

  const savedFont = localStorage.getItem("gv_font");

  if (savedFont) {
    root.style.setProperty("--base-font-size", savedFont);
  } else {
    root.style.setProperty("--base-font-size", DEFAULT_FONT + "px");
  }

  function currentFont() {
    return parseFloat(
      getComputedStyle(root)
        .getPropertyValue("--base-font-size")
    );
  }

  function setFont(size) {

    size = Math.max(MIN_FONT, Math.min(MAX_FONT, size));

    root.style.setProperty(
      "--base-font-size",
      size + "px"
    );

    localStorage.setItem(
      "gv_font",
      size + "px"
    );

    announce("Fonte alterada para " + size + " pixels");
  }

  btnInc?.addEventListener("click", () => {
    setFont(currentFont() + 1);
  });

  btnDec?.addEventListener("click", () => {
    setFont(currentFont() - 1);
  });

  /* ==========================================
     TEMA ESCURO
  ========================================== */

  const themeButton =
    document.getElementById("themeToggle");

  function applyTheme(theme) {

    if (theme === "dark") {

      body.classList.add("dark");

      themeButton.innerHTML = "☀️";

      themeButton.title = "Tema claro";

      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#081512");

    } else {

      body.classList.remove("dark");

      themeButton.innerHTML = "🌙";

      themeButton.title = "Tema escuro";

      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", "#1b8a5a");
    }
  }

  const storedTheme =
    localStorage.getItem("gv_theme");

  if (storedTheme) {

    applyTheme(storedTheme);

  } else {

    if (
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
    ) {

      applyTheme("dark");

    } else {

      applyTheme("light");

    }
  }

  themeButton?.addEventListener("click", () => {

    if (body.classList.contains("dark")) {

      applyTheme("light");
      localStorage.setItem("gv_theme", "light");
      announce("Tema claro ativado");

    } else {

      applyTheme("dark");
      localStorage.setItem("gv_theme", "dark");
      announce("Tema escuro ativado");

    }

  });

  /* ==========================================
     MENU MOBILE
  ========================================== */

  const menuButton =
    document.getElementById("menuButton");

  const menu =
    document.getElementById("mainMenu");

  const overlay =
    document.getElementById("menuOverlay");

  function openMenu() {

    menu.classList.add("active");
    overlay.classList.add("active");

    menuButton.classList.add("active");

    body.classList.add("menu-open");

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

  }

  function closeMenu() {

    menu.classList.remove("active");
    overlay.classList.remove("active");

    menuButton.classList.remove("active");

    body.classList.remove("menu-open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

  }

  menuButton?.addEventListener("click", () => {

    if (menu.classList.contains("active")) {

      closeMenu();

    } else {

      openMenu();

    }

  });

  overlay?.addEventListener(
    "click",
    closeMenu
  );

  menu
    ?.querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });
  /* ==========================================
     CABEÇALHO AO ROLAR
  ========================================== */

  const topbar =
    document.getElementById("topbar");

  function updateTopbar() {

    if (!topbar) return;

    topbar.classList.toggle(
      "scrolled",
      window.scrollY > 20
    );

  }

  updateTopbar();

  window.addEventListener(
    "scroll",
    updateTopbar,
    { passive: true }
  );

  /* ==========================================
     DESTACAR ITEM ATIVO DO MENU
  ========================================== */

  const sections =
    document.querySelectorAll(
      "main section[id]"
    );

  const menuLinks =
    document.querySelectorAll(
      '.main-nav a[href^="#"]'
    );

  function setActiveMenuLink(sectionId) {

    menuLinks.forEach(link => {

      const isActive =
        link.getAttribute("href") ===
        `#${sectionId}`;

      link.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {

        link.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );

      }

    });

  }

  if (
    "IntersectionObserver" in window &&
    sections.length > 0
  ) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          const visibleSection =
            entries
              .filter(entry =>
                entry.isIntersecting
              )
              .sort(
                (first, second) =>
                  second.intersectionRatio -
                  first.intersectionRatio
              )[0];

          if (
            visibleSection &&
            visibleSection.target.id
          ) {

            setActiveMenuLink(
              visibleSection.target.id
            );

          }

        },
        {
          rootMargin:
            "-30% 0px -58% 0px",

          threshold:
            [0.05, 0.2, 0.45]
        }
      );

    sections.forEach(section => {

      sectionObserver.observe(section);

    });

  }

  /* ==========================================
     ROLAGEM SUAVE
  ========================================== */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  document
    .querySelectorAll(
      'a[href^="#"]:not([href="#"])'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const targetId =
            link.getAttribute("href");

          if (!targetId) return;

          const target =
            document.querySelector(
              targetId
            );

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior:
              prefersReducedMotion
                ? "auto"
                : "smooth",

            block: "start"
          });

          history.replaceState(
            null,
            "",
            targetId
          );

        }
      );

    });

  /* ==========================================
     ANIMAÇÕES AO ROLAR
  ========================================== */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );

  if (
    !prefersReducedMotion &&
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.08,
          rootMargin:
            "0px 0px -30px 0px"
        }
      );

    revealElements.forEach(
      element => {

        revealObserver.observe(
          element
        );

      }
    );

  } else {

    revealElements.forEach(
      element => {

        element.classList.add(
          "visible"
        );

      }
    );

  }

  /*
   * Os elementos do Hero precisam aparecer
   * imediatamente, sem esperar a rolagem.
   */

  document
    .querySelectorAll(
      ".hero .reveal"
    )
    .forEach(element => {

      element.classList.add(
        "visible"
      );

    });

  /* ==========================================
     LINK "PULAR PARA O CONTEÚDO"
  ========================================== */

  const skipLink =
    document.querySelector(
      ".skip-link"
    );

  const mainContent =
    document.getElementById(
      "conteudo"
    );

  skipLink?.addEventListener(
    "click",
    event => {

      if (!mainContent) return;

      event.preventDefault();

      mainContent.setAttribute(
        "tabindex",
        "-1"
      );

      mainContent.focus();

      mainContent.addEventListener(
        "blur",
        () => {

          mainContent.removeAttribute(
            "tabindex"
          );

        },
        { once: true }
      );

    }
  );

  /* ==========================================
     SEÇÃO DE CONTEÚDOS / BLOG
  ========================================== */

  const blogDetails = document.querySelectorAll(
  ".blog-card details"
);

blogDetails.forEach((details) => {
  const summary = details.querySelector("summary");

  summary?.addEventListener("click", () => {
    const wasOpen = details.open;

    blogDetails.forEach((otherDetails) => {
      if (otherDetails !== details) {
        otherDetails.removeAttribute("open");
      }
    });

    /*
     * O navegador alterna o details automaticamente.
     * Quando o cartão clicado estava fechado,
     * os demais já foram fechados.
     */
    if (!wasOpen) {
      window.setTimeout(() => {
        details.scrollIntoView({
          behavior: prefersReducedMotion
            ? "auto"
            : "smooth",
          block: "center"
        });
      }, 180);
    }
  });
});

    /* ==========================================
     CHATBOT
  ========================================== */

  const chatbot =
    document.getElementById("chatbot");

  const chatbotToggle =
    document.getElementById(
      "chatbotToggle"
    );

  const closeChatbotButton =
    document.getElementById(
      "closeChatbot"
    );

  const chatbotMessages =
    document.getElementById(
      "chatbotMessages"
    );

  const questionButtons =
    document.querySelectorAll(
      ".question-btn"
    );

  const responses = {

    1: "O GUIAVOZ é um projeto de tecnologia assistiva que utiliza sensores, Bluetooth Low Energy e um aplicativo para emitir alertas por voz, som e vibração em ambientes internos.",

    2: "O sensor detecta um ponto de atenção, envia a informação ao aplicativo por Bluetooth e o GUIAVOZ apresenta um alerta acessível ao usuário.",

    3: "O projeto é direcionado principalmente a pessoas com deficiência visual, mas seus recursos também podem apoiar pessoas com baixa visão ou mobilidade reduzida.",

    4: "O aplicativo e o site já foram desenvolvidos. A integração e os testes com o protótipo físico serão retomados quando os componentes estiverem disponíveis."

  };

  function chatbotIsOpen() {

    return Boolean(
      chatbot?.classList.contains(
        "active"
      )
    );

  }

  function openChatbot() {

    if (
      !chatbot ||
      !chatbotToggle
    ) {
      return;
    }

    chatbot.classList.add(
      "active"
    );

    body.classList.add(
      "chat-open"
    );

    chatbot.setAttribute(
      "aria-hidden",
      "false"
    );

    chatbotToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    window.setTimeout(
      () => {

        closeChatbotButton?.focus();

      },
      150
    );

    announce(
      "Assistente virtual aberto"
    );

  }

  function closeChatbot() {

    if (
      !chatbot ||
      !chatbotToggle
    ) {
      return;
    }

    chatbot.classList.remove(
      "active"
    );

    body.classList.remove(
      "chat-open"
    );

    chatbot.setAttribute(
      "aria-hidden",
      "true"
    );

    chatbotToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    announce(
      "Assistente virtual fechado"
    );

  }

  chatbotToggle?.addEventListener(
    "click",
    () => {

      if (chatbotIsOpen()) {

        closeChatbot();

      } else {

        openChatbot();

      }

    }
  );

  closeChatbotButton
    ?.addEventListener(
      "click",
      closeChatbot
    );

  /* ==========================================
     ADICIONAR MENSAGENS
  ========================================== */

  function addChatbotMessage(
    text,
    type
  ) {

    if (
      !chatbotMessages ||
      !text
    ) {
      return;
    }

    const message =
      document.createElement(
        "div"
      );

    message.className =
      `message ${type}-message`;

    message.textContent = text;

    chatbotMessages.appendChild(
      message
    );

    chatbotMessages.scrollTop =
      chatbotMessages.scrollHeight;

  }

  /* ==========================================
     INDICADOR "DIGITANDO"
  ========================================== */

  function addTypingIndicator() {

    if (!chatbotMessages) {
      return null;
    }

    const typingMessage =
      document.createElement(
        "div"
      );

    typingMessage.className =
      "message bot-message typing-message";

    typingMessage.setAttribute(
      "aria-label",
      "Assistente está digitando"
    );

    typingMessage.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    chatbotMessages.appendChild(
      typingMessage
    );

    chatbotMessages.scrollTop =
      chatbotMessages.scrollHeight;

    return typingMessage;

  }

  /* ==========================================
     RESPOSTAS DO CHATBOT
  ========================================== */

  questionButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const questionNumber =
            button.getAttribute(
              "data-question"
            );

          const questionText =
            button.textContent?.trim();

          const response =
            responses[
              questionNumber
            ];

          if (
            !questionText ||
            !response
          ) {
            return;
          }

          addChatbotMessage(
            questionText,
            "user"
          );

          button.disabled = true;

          const typingIndicator =
            addTypingIndicator();

          window.setTimeout(
            () => {

              typingIndicator?.remove();

              addChatbotMessage(
                response,
                "bot"
              );

              button.disabled = false;

              button.focus();

              announce(
                "Nova resposta do assistente"
              );

            },
            550
          );

        }
      );

    }
  );

  /* ==========================================
     FECHAR CHATBOT AO CLICAR FORA
  ========================================== */

  document.addEventListener(
    "click",
    event => {

      if (
        !chatbotIsOpen() ||
        !chatbot ||
        !chatbotToggle
      ) {
        return;
      }

      const clickedInsideChatbot =
        chatbot.contains(
          event.target
        );

      const clickedChatbotButton =
        chatbotToggle.contains(
          event.target
        );

      if (
        !clickedInsideChatbot &&
        !clickedChatbotButton
      ) {

        closeChatbot();

      }

    }
  );
    /* ==========================================
     TECLA ESCAPE
  ========================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }

      if (chatbotIsOpen()) {

        closeChatbot();

        chatbotToggle?.focus();

        return;

      }

      if (
        menu?.classList.contains(
          "active"
        )
      ) {

        closeMenu();

        menuButton?.focus();

      }

    }
  );

  /* ==========================================
     VÍDEO DA DEMONSTRAÇÃO
  ========================================== */

  const demoVideo =
    document.querySelector(
      "#demonstracao video"
    );

  demoVideo?.addEventListener(
    "play",
    () => {

      announce(
        "Vídeo de demonstração iniciado"
      );

    }
  );

  demoVideo?.addEventListener(
    "pause",
    () => {

      announce(
        "Vídeo de demonstração pausado"
      );

    }
  );

  demoVideo?.addEventListener(
    "ended",
    () => {

      announce(
        "Vídeo de demonstração finalizado"
      );

    }
  );

  /* ==========================================
     LINKS EXTERNOS
  ========================================== */

  document
    .querySelectorAll(
      'a[target="_blank"]'
    )
    .forEach(link => {

      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );

      const currentLabel =
        link.getAttribute(
          "aria-label"
        ) ||
        link.textContent?.trim();

      if (
        currentLabel &&
        !currentLabel
          .toLowerCase()
          .includes("nova aba")
      ) {

        link.setAttribute(
          "aria-label",
          `${currentLabel} — abre em uma nova aba`
        );

      }

    });

  /* ==========================================
     FECHAR MENU AO REDIMENSIONAR
  ========================================== */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 840 &&
        menu?.classList.contains(
          "active"
        )
      ) {

        closeMenu();

      }

    }
  );

  /* ==========================================
     GARANTIR ELEMENTOS VISÍVEIS
  ========================================== */

  window.setTimeout(
    () => {

      document
        .querySelectorAll(
          ".hero .reveal"
        )
        .forEach(element => {

          element.classList.add(
            "visible"
          );

        });

    },
    100
  );

});
