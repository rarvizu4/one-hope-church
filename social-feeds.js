/* Native One Hope Church feeds. Shows Elfsight as fallback until real feed data is available. */
(() => {
  "use strict";

  const repository = "https://raw.githubusercontent.com/rarvizu4/one-hope-church/main/data/";
  const feeds = {
    youtube: { id: "native-youtube-gallery", fallback: ".youtube-gallery", items: [] },
    instagram: { id: "native-instagram-gallery", fallback: ".instagram-gallery", items: [] },
  };

  const language = () => document.documentElement.lang === "es" ? "es" : "en";
  const translate = (en, es) => language() === "es" ? es : en;
  const isHttps = value => {
    try { const url = new URL(value); return url.protocol === "https:" ? url.href : ""; }
    catch (_) { return ""; }
  };
  const formatDate = text => {
    if (!text) return "";
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(language() === "es" ? "es-US" : "en-US", {
      year: "numeric", month: "short", day: "numeric"
    }).format(date);
  };
  function create(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent != null) element.textContent = textContent;
    return element;
  }
  function card(kind, post) {
    const isYouTube = kind === "youtube";
    const id = String(post.id || "");
    if (isYouTube && !/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
    const link = isYouTube ? "https://www.youtube.com/watch?v=" + id : isHttps(post.url);
    const thumbnail = isHttps(post.thumbnail);
    if (!link || !thumbnail) return null;

    const wrapper = create("article", "native-social-card");
    const action = create("a", "native-social-photo");
    action.href = link;
    action.target = "_blank";
    action.rel = "noopener noreferrer";
    action.setAttribute("aria-label", isYouTube
      ? translate("Play video: ", "Reproducir video: ") + (post.title || "Church video")
      : translate("View Instagram post", "Ver publicación de Instagram"));

    const picture = create("img");
    picture.src = thumbnail;
    picture.alt = isYouTube
      ? String(post.title || "YouTube video") 
      : String(post.caption || "One Hope Church Instagram post").slice(0, 130);
    picture.loading = "lazy";
    picture.decoding = "async";
    action.append(picture);

    if (isYouTube) {
      action.addEventListener("click", event => {
        const dialog = document.querySelector("#native-video-dialog");
        const stage = dialog?.querySelector(".native-video-stage");
        if (!dialog?.showModal || !stage) return;
        event.preventDefault();
        stage.replaceChildren();
        const iframe = create("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1";
        iframe.title = String(post.title || "One Hope Church video");
        iframe.loading = "eager";
        iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        stage.append(iframe);
        dialog.showModal();
      });
    }

    wrapper.append(action);
    const copy = create("div", "native-social-copy");
    const title = create("h3", "native-social-title",
      isYouTube ? (post.title || "Church video")
        : String(post.caption || translate("From our church family", "De nuestra familia de fe")));
    copy.append(title);
    const dateText = formatDate(post.published);
    if (dateText) copy.append(create("p", "native-social-date", dateText));
    const outbound = create("a", "native-social-outbound",
      isYouTube ? translate("WATCH VIDEO ", "VER VIDEO ") : translate("VIEW POST ", "VER PUBLICACIÓN "));
    outbound.href = link;
    outbound.target = "_blank";
    outbound.rel = "noopener noreferrer";
    copy.append(outbound);
    wrapper.append(copy);
    return wrapper;
  }

  function render(kind) {
    const config = feeds[kind];
    const target = document.getElementById(config.id);
    const fallback = document.querySelector(config.fallback);
    if (!target || !config.items.length) return;
    const grid = create("div", "native-social-grid");
    const ordered = kind === "youtube"
      ? [...config.items].sort((a, b) => new Date(b.published || 0) - new Date(a.published || 0))
      : config.items;
    ordered.slice(0, kind === "youtube" ? 1 : 8).forEach(post => {
      const element = card(kind, post);
      if (element) grid.append(element);
    });
    if (!grid.children.length) return;
    target.replaceChildren(grid);
    target.hidden = false;
    if (fallback) fallback.hidden = true;
  }

  async function load(kind) {
    const config = feeds[kind];
    try {
      // Source file is public. API credentials remain on GitHub Actions, never in the browser.
      const revision = Math.floor(Date.now() / 300000);
      const response = await fetch(repository + kind + ".json?cache=" + revision,
        {cache: "no-store", mode: "cors"});
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      if (!Array.isArray(payload.items)) throw new Error("Invalid feed");
      if (payload.items.length) {
        config.items = payload.items;
        render(kind);
      }
      // Empty/unavailable custom feeds leave the original Elfsight widgets untouched.
    } catch (error) {
      console.warn("Church " + kind + " feed unavailable; using existing widget.", error);
    }
  }

  const dialog = document.getElementById("native-video-dialog");
  if (dialog) {
    dialog.querySelector(".native-video-close")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => dialog.querySelector(".native-video-stage")?.replaceChildren());
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
  }
  document.querySelectorAll(".lang-btn").forEach(button =>
    button.addEventListener("click", () => {
      for (const kind of Object.keys(feeds)) render(kind);
    })
  );

  for (const kind of Object.keys(feeds)) load(kind);
  window.setInterval(() => { for (const kind of Object.keys(feeds)) load(kind); }, 300000);
})();
