// Code commun a toutes les pages : en-tete, recherche, panier, favoris, pied de page
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const euro = n => n == null || isNaN(n) ? "Prix à venir" : n.toFixed(2).replace(".", ",") + " €";
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const src = (id, w, h) => id.startsWith("data:") || id.startsWith("http") ? id : U(id, w, h);
const img = (id, alt, w, h, lazy = true) => `<img src="${src(id, w, h)}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""}>`;
const byId = id => PRODUCTS.find(p => p.id === +id);
const param = k => new URLSearchParams(location.search).get(k);

const ICON = {
  hand: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>`,
  heart: (s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20z"/></svg>`,
  bag: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  user: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.3-7 8-7s7 2.5 8 7"/></svg>`,
  search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  burger: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>`,
  truck: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>`,
  lock: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
  back: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M9 6 4 11l5 5"/><path d="M4 11h11a5 5 0 0 1 0 10h-3"/></svg>`,
  gift: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M3 9h18v4H3zM5 13h14v8H5zM12 9v12"/><path d="M12 9c-2-4-6-4-6-1.5S10 9 12 9zm0 0c2-4 6-4 6-1.5S14 9 12 9z"/></svg>`,
};

// ---------- Stockage (dans le navigateur du visiteur) ----------
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};
const getCart = () => store.get("mw_cart", []).filter(l => byId(l.id));
const setCart = c => { store.set("mw_cart", c); updateCounts(); };
const addToCart = (id, q = 1) => {
  const c = getCart(), l = c.find(x => x.id === +id);
  l ? l.q += q : c.push({ id: +id, q });
  setCart(c);
};
const setQty = (id, q) => setCart(q < 1 ? getCart().filter(l => l.id !== +id) : getCart().map(l => l.id === +id ? { ...l, q } : l));
const cartCount = () => getCart().reduce((a, l) => a + l.q, 0);
const cartSub = () => getCart().reduce((s, l) => s + (byId(l.id).price || 0) * l.q, 0);
const getFavs = () => store.get("mw_favs", []).filter(byId);
const isFav = id => getFavs().includes(+id);
const toggleFav = id => {
  const f = getFavs(), on = !f.includes(+id);
  store.set("mw_favs", on ? [...f, +id] : f.filter(x => x !== +id));
  updateCounts();
  return on;
};
const pushRecent = id => store.set("mw_recent", [+id, ...store.get("mw_recent", []).filter(x => x !== +id)].slice(0, 8));

// ---------- Recherche ----------
const hay = p => norm([p.name, NAMES[p.cat], p.desc, p.tag, ...(p.specs || []).map(s => s[1]), p.fm ? "fait main artisanal" : ""].join(" "));
const search = q => {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return PRODUCTS.map(p => {
    const h = hay(p), n = norm(p.name);
    if (!words.every(w => h.includes(w))) return null;
    return { p, score: words.reduce((s, w) => s + (n.includes(w) ? 3 : 0) + (n.startsWith(w) ? 2 : 0), 0) };
  }).filter(Boolean).sort((a, b) => b.score - a.score).map(x => x.p);
};
const mark = (text, q) => {
  let out = esc(text);
  norm(q).split(/\s+/).filter(w => w.length > 1).forEach(w => {
    const i = norm(text).indexOf(w);
    if (i >= 0) out = esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + w.length)) + "</mark>" + esc(text.slice(i + w.length));
  });
  return out;
};

// ---------- Carte produit ----------
const card = p => `<article class="card">
  <a href="produit.html?id=${p.id}">
    <div class="art">${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}${p.fm ? `<span class="fm">${ICON.hand} Fait main</span>` : ""}${img(p.ph[0], p.name, 600, 750)}${p.ph[1] ? img(p.ph[1], p.name + ", autre vue", 600, 750) : ""}</div>
    <div class="cat">${NAMES[p.cat] || ""}</div>
    <h3>${esc(p.name)}</h3>
    <div class="price">${euro(p.price)}</div>
  </a>
  <button class="fav" data-fav="${p.id}" aria-pressed="${isFav(p.id)}" aria-label="Ajouter ${esc(p.name)} aux favoris">${ICON.heart(17)}</button>
  ${p.tag === "Épuisé" ? "" : `<button class="quick" data-add="${p.id}">Ajouter au panier</button>`}
</article>`;

// ---------- En-tete ----------
const NAV = [
  ["boutique.html", "E-shop", "boutique"],
  ["boutique.html?cat=deco", "Décoration", "deco"],
  ["boutique.html?cat=vaisselle", "Art de la table", "vaisselle"],
  ["boutique.html?cat=paniers", "Paniers", "paniers"],
  ["boutique.html?cat=textiles", "Textile", "textiles"],
  ["boutique.html?cat=bienetre", "Bien-être", "bienetre"],
  ["boutique.html?cat=bijoux", "Bijoux", "bijoux"],
  ["regions.html", "Le Maroc", "regions"],
  ["a-propos.html", "À propos", "apropos"],
  ["contact.html", "Contact", "contact"],
];
const searchBox = id => `<div class="search" role="search">
  <form action="boutique.html" autocomplete="off">
    <label class="visually-hidden" for="${id}">Rechercher un article</label>
    <input id="${id}" name="q" type="search" placeholder="Rechercher un article, une région..." value="${esc(param("q") || "")}">
    <button aria-label="Lancer la recherche">${ICON.search}</button>
  </form>
  <div class="suggest" role="listbox"></div>
</div>`;

function buildHeader() {
  const page = document.body.dataset.page, cat = param("cat");
  const counts = Object.fromEntries(CAT_ORDER.map(c => [c, PRODUCTS.filter(p => p.cat === c).length]));
  const cur = k => (k === cat || (k === page && !cat)) ? ' aria-current="page"' : "";
  document.body.insertAdjacentHTML("afterbegin", `
<div class="demo">Maquette : articles, photos (libres de droits) et prix sont des exemples. <a href="admin.html">Voir l'espace vendeuse</a></div>
<div class="topbar" aria-live="polite"><span class="on">Paiement sécurisé par carte ou par virement</span><span>Livraison offerte dès ${FREE_FROM} € d'achat</span><span>Retours possibles sous 14 jours</span><span>Pièces choisies auprès d'artisans du Maroc</span></div>
<header class="site">
  <div class="wrap">
    <div class="head-row">
      <div class="left">
        <button class="icon-btn burger" aria-label="Ouvrir le menu" aria-expanded="false">${ICON.burger}</button>
        <button class="icon-btn search-toggle" aria-label="Ouvrir la recherche">${ICON.search}</button>
        ${searchBox("q1")}
      </div>
      <a class="logo" href="index.html"><b>MAISON WAFA</b><i>artisanat du Maroc</i></a>
      <div class="icons">
        <a class="icon-btn" href="compte.html" aria-label="Mon compte">${ICON.user}</a>
        <a class="icon-btn" href="favoris.html" aria-label="Mes favoris">${ICON.heart(21)}<span class="count" id="favCount" data-n="0">0</span></a>
        <button class="icon-btn" id="openCart" aria-label="Ouvrir le panier">${ICON.bag}<span class="count" id="cartCount" data-n="0">0</span></button>
      </div>
    </div>
    <div class="mobile-search">${searchBox("q2")}</div>
    <nav class="main" aria-label="Menu principal">
      <ul>
        <li><a href="boutique.html"${cur("boutique")}>E-shop</a>
          <div class="drop">
            <ul class="drop-cats">${CAT_ORDER.map(c => `<li><a href="boutique.html?cat=${c}"><span class="ph">${img(CAT_PH[c], "", 360, 225)}</span><b>${NAMES[c]}</b><small>${counts[c]} article${counts[c] > 1 ? "s" : ""}</small></a></li>`).join("")}</ul>
            <div class="drop-side">
              <h4>À découvrir</h4>
              <ul><li><a href="boutique.html?sort=new">Nouveautés</a></li><li><a href="boutique.html?fm=1">Pièces faites main</a></li><li><a href="boutique.html?sort=asc">Petits prix</a></li><li><a href="regions.html">Par région du Maroc</a></li></ul>
              <a class="btn btn-dark" href="boutique.html">Tout l'e-shop</a>
            </div>
          </div>
        </li>
        ${NAV.slice(1).map(([h, t, k]) => `<li><a href="${h}"${cur(k)}>${t}</a></li>`).join("")}
      </ul>
    </nav>
  </div>
</header>`);

  // Bandeau qui tourne
  const msgs = $$(".topbar span"); let mi = 0;
  setInterval(() => { msgs[mi].classList.remove("on"); mi = (mi + 1) % msgs.length; msgs[mi].classList.add("on"); }, 4000);

  // Menu mobile
  const burger = $(".burger"), nav = $("nav.main");
  burger.addEventListener("click", () => burger.setAttribute("aria-expanded", nav.classList.toggle("open")));
  $(".search-toggle").addEventListener("click", () => { const m = $(".mobile-search"); m.classList.toggle("open"); if (m.classList.contains("open")) $("#q2").focus(); });

  // Ombre quand on descend
  const hd = $("header.site");
  addEventListener("scroll", () => hd.classList.toggle("scrolled", scrollY > 10), { passive: true });

  $$(".search").forEach(initSearch);
}

function initSearch(box) {
  const input = $("input", box), list = $(".suggest", box);
  let hl = -1;
  const close = () => { list.classList.remove("open"); hl = -1; };
  const draw = () => {
    const q = input.value.trim();
    if (q.length < 2) return close();
    const res = search(q).slice(0, 5);
    const cats = CAT_ORDER.filter(c => norm(NAMES[c]).includes(norm(q)));
    list.innerHTML = (cats.length ? `<h4>Catégories</h4>` + cats.map(c => `<a class="cat" href="boutique.html?cat=${c}"><span>${mark(NAMES[c], q)}</span><small>${PRODUCTS.filter(p => p.cat === c).length} articles</small></a>`).join("") : "")
      + (res.length ? `<h4>Articles</h4>` + res.map(p => `<a href="produit.html?id=${p.id}">${img(p.ph[0], "", 88, 110, false)}<span>${mark(p.name, q)}</span><span>${euro(p.price)}</span></a>`).join("")
        + `<a class="all" href="boutique.html?q=${encodeURIComponent(q)}">Voir tous les résultats (${search(q).length})</a>`
        : (cats.length ? "" : `<p class="none">Aucun article pour « ${esc(q)} ». Essayez « argan », « panier » ou « collier ».</p>`));
    list.classList.add("open"); hl = -1;
  };
  input.addEventListener("input", draw);
  input.addEventListener("focus", draw);
  input.addEventListener("keydown", e => {
    const links = $$("a", list);
    if (!links.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      hl = (hl + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
      links.forEach((a, i) => a.classList.toggle("hl", i === hl));
    } else if (e.key === "Enter" && hl >= 0) { e.preventDefault(); location.href = links[hl].href; }
    else if (e.key === "Escape") close();
  });
  document.addEventListener("click", e => { if (!box.contains(e.target)) close(); });
}

// ---------- Pied de page ----------
function buildFooter() {
  document.body.insertAdjacentHTML("beforeend", `
<section class="news">
  <div class="wrap">
    <fieldset>
      <legend>Inscrivez-vous à notre lettre d'info</legend>
      <p>Recevez les nouvelles pièces en premier.</p>
      <form class="news-form"><input type="email" required placeholder="Adresse e-mail" aria-label="Adresse e-mail"><button>S'abonner</button></form>
    </fieldset>
  </div>
</section>
<footer class="site">
  <div class="wrap">
    <div class="foot-cols">
      <div>
        <div class="name">MAISON WAFA</div>
        <div class="tagline">Décoration marocaine, bien-être et bijoux</div>
        <p>Des pièces choisies une par une, auprès d'artisans de tout le Maroc.</p>
        <div class="pay-icons"><span>CB</span><span>Visa</span><span>Mastercard</span><span>Virement</span></div>
      </div>
      <div><h4>La boutique</h4><ul>${CAT_ORDER.map(c => `<li><a href="boutique.html?cat=${c}">${NAMES[c]}</a></li>`).join("")}<li><a href="boutique.html?fm=1">Fait main</a></li></ul></div>
      <div><h4>Aide</h4><ul><li><a href="livraison-retours.html">Livraison</a></li><li><a href="livraison-retours.html#retours">Retours et remboursements</a></li><li><a href="contact.html#faq">Questions fréquentes</a></li><li><a href="contact.html">Nous contacter</a></li><li><a href="compte.html#suivi">Suivre ma commande</a></li></ul></div>
      <div><h4>Maison Wafa</h4><ul><li><a href="a-propos.html">Notre histoire</a></li><li><a href="regions.html">Le Maroc, région par région</a></li><li><a href="favoris.html">Mes favoris</a></li><li><a href="admin.html">Espace vendeuse</a></li></ul></div>
    </div>
    <div class="bottom">
      <span>© Maison Wafa · Maquette réalisée par Le Bon Site</span>
      <span><a href="legal.html">Mentions légales</a> · <a href="legal.html#cgv">CGV</a> · <a href="legal.html#confidentialite">Confidentialité</a></span>
    </div>
  </div>
</footer>
<div class="shade" id="shade"></div>
<aside class="drawer" id="drawer" aria-label="Panier">
  <div class="drawer-head"><h2>Mon panier</h2><button class="icon-btn" id="closeCart" aria-label="Fermer le panier" style="font-size:26px">×</button></div>
  <div id="shipBar"></div>
  <div class="drawer-body" id="lines"></div>
  <div class="drawer-foot" id="foot"></div>
</aside>
<div class="toast" id="toast" role="status"></div>`);

  $$(".news-form").forEach(f => f.addEventListener("submit", e => { e.preventDefault(); f.innerHTML = `<p style="padding:12px;width:100%">Merci, c'est noté (maquette).</p>`; }));
  $("#openCart").addEventListener("click", () => openDrawer(true));
  $("#closeCart").addEventListener("click", () => openDrawer(false));
  $("#shade").addEventListener("click", () => openDrawer(false));
  addEventListener("keydown", e => { if (e.key === "Escape") openDrawer(false); });
}

const shipBar = sub => {
  if (!sub) return "";
  const left = FREE_FROM - sub;
  return `<div class="ship-bar">${left > 0 ? `Plus que <b>${euro(left)}</b> pour la livraison offerte` : `<b>Livraison offerte</b> sur votre commande`}<div class="bar"><i style="width:${Math.min(100, sub / FREE_FROM * 100)}%"></i></div></div>`;
};

function renderDrawer() {
  const c = getCart(), sub = cartSub();
  $("#shipBar").innerHTML = shipBar(sub);
  if (!c.length) {
    $("#lines").innerHTML = `<p class="empty">Votre panier est vide.</p>`;
    $("#foot").innerHTML = `<a class="btn btn-dark" href="boutique.html">Découvrir la boutique</a>`;
    return;
  }
  $("#lines").innerHTML = c.map(({ id, q }) => { const p = byId(id); return `<div class="line">
    <a class="mini" href="produit.html?id=${id}">${img(p.ph[0], p.name, 140, 175, false)}</a>
    <div><h3><a href="produit.html?id=${id}">${esc(p.name)}</a></h3><small>${euro(p.price)}</small><div style="margin-top:8px"><span class="qty"><button data-q="${id}" data-d="-1" aria-label="Moins">−</button><output>${q}</output><button data-q="${id}" data-d="1" aria-label="Plus">+</button></span></div></div>
    <div class="end">${euro((p.price || 0) * q)}<button class="rm" data-rm="${id}">Retirer</button></div>
  </div>`; }).join("");
  $("#foot").innerHTML = `<div class="total"><span>Sous-total</span><span>${euro(sub)}</span></div>
    <small style="color:var(--muted);font-family:Commissioner,sans-serif;font-size:12px">Frais de livraison calculés à l'étape suivante.</small>
    <a class="btn btn-dark" href="commande.html">Commander</a>
    <a class="btn" href="panier.html">Voir le panier</a>`;
}
function openDrawer(o) {
  if (o) renderDrawer();
  $("#drawer").classList.toggle("open", o); $("#shade").classList.toggle("open", o);
}

function updateCounts() {
  const n = cartCount(), f = getFavs().length;
  const a = $("#cartCount"), b = $("#favCount");
  if (a) { a.textContent = n; a.dataset.n = n; }
  if (b) { b.textContent = f; b.dataset.n = f; }
  if ($("#drawer")?.classList.contains("open")) renderDrawer();
}

let toastT;
const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2600); };

// Clics communs : favoris, ajout rapide, quantites, retirer
document.addEventListener("click", e => {
  const f = e.target.closest("[data-fav]");
  if (f) { e.preventDefault(); const on = toggleFav(f.dataset.fav); $$(`[data-fav="${f.dataset.fav}"]`).forEach(b => b.setAttribute("aria-pressed", on)); toast(on ? "Ajouté à vos favoris" : "Retiré de vos favoris"); document.dispatchEvent(new Event("favs")); return; }
  const a = e.target.closest("[data-add]");
  if (a) { e.preventDefault(); addToCart(a.dataset.add, 1); openDrawer(true); return; }
  const q = e.target.closest("[data-q]");
  if (q) { const l = getCart().find(x => x.id === +q.dataset.q); if (l) setQty(l.id, l.q + +q.dataset.d); document.dispatchEvent(new Event("cart")); return; }
  const r = e.target.closest("[data-rm]");
  if (r) { setQty(r.dataset.rm, 0); document.dispatchEvent(new Event("cart")); }
});

buildHeader();
buildFooter();
updateCounts();
