const page = document.body.dataset.page || 'home';
const app = document.getElementById('app');
const labels = { experience: 'Activities', blogs: 'Blogs', projects: 'Projects' };
const contactIconClasses = {
  github: 'fa-brands fa-github',
  facebook: 'fa-brands fa-facebook',
  linkedin: 'fa-brands fa-linkedin',
  email: 'fa-solid fa-envelope',
  instagram: 'fa-brands fa-instagram',
  discord: 'fa-brands fa-discord',
  phone: 'fa-solid fa-phone'
};

function el(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined && value !== null) node.textContent = String(value);
  return node;
}
function add(parent, ...children) {
  children.filter(Boolean).forEach(child => parent.append(child));
  return parent;
}
function asset(path) {
  return typeof path === 'string' && /^images\/[a-z0-9/_-]+\.(png|jpe?g|webp|svg)$/i.test(path) ? path : null;
}
function external(url) {
  if (typeof url !== 'string') return null;
  try {
    const parsed = new URL(url, location.href);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? parsed.href : null;
  } catch { return null; }
}
function githubRepoUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const segments = url.pathname.split('/').filter(Boolean);
    return url.protocol === 'https:' && url.hostname === 'github.com' && segments.length >= 2
      ? url.href : null;
  } catch { return null; }
}
function link(label, href, className) {
  const node = el('a', className, label);
  node.href = href;
  if (/^https?:/i.test(href)) {
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
  }
  return node;
}
function header(site) {
  const root = el('header', 'site-header');
  const inner = el('div', 'container header-inner');
  const nav = el('nav', 'site-nav');
  nav.id = 'site-nav';
  nav.setAttribute('aria-label', 'Main navigation');
  [
    ['About', page === 'home' ? '#about' : 'index.html#about'],
    ['Achievements', page === 'home' ? '#achievements' : 'index.html#achievements'],
    ['Activities', 'experience.html'], ['Blogs', 'blogs.html'],
    ['Projects', 'projects.html'],
    ['Contact', page === 'home' ? '#contact' : 'index.html#contact']
  ].forEach(([name, href]) => {
    const item = link(name, href);
    if (href === page + '.html') item.setAttribute('aria-current', 'page');
    nav.append(item);
  });
  if (page === 'home') {
    const updateActive = () => {
      const active = ['#about', '#achievements', '#contact'].includes(location.hash) ? location.hash : '#about';
      nav.querySelectorAll('a').forEach(item => {
        if (item.getAttribute('href') === active) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
      });
    };
    updateActive();
    window.addEventListener('hashchange', updateActive);
  }
  const actions = el('div', 'header-actions');
  const theme = el('button', 'icon-button', '◐');
  theme.type = 'button';
  theme.setAttribute('aria-label', 'Toggle color theme');
  theme.addEventListener('click', () => {
    const light = document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', light ? 'light' : 'dark');
  });
  const menu = el('button', 'icon-button menu-button', '☰');
  menu.type = 'button';
  menu.setAttribute('aria-label', 'Open menu');
  menu.setAttribute('aria-controls', 'site-nav');
  menu.setAttribute('aria-expanded', 'false');
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }
  });
  add(actions, theme, menu);
  add(inner, link(site.name, 'index.html', 'logo'), nav, actions);
  root.append(inner);
  document.body.prepend(root);
}
function footer(site) {
  const root = el('footer', 'site-footer');
  const inner = el('div', 'container footer-inner');
  const identity = el('div');
  add(identity, el('strong', '', site.name), el('p', '', site.tagline));
  add(inner, identity, el('p', '', '© ' + new Date().getFullYear() + ' ' + site.name));
  root.append(inner);
  document.body.append(root);
}
function section(id, eyebrow, title, description) {
  const root = el('section', 'section');
  if (id) root.id = id;
  const inner = el('div', 'container');
  const heading = el('div', 'section-heading');
  add(heading, el('span', 'eyebrow', eyebrow), el('h2', '', title));
  if (description) heading.append(el('p', '', description));
  inner.append(heading);
  root.append(inner);
  return [root, inner];
}
function detailHref(type, item) {
  return 'post.html?type=' + encodeURIComponent(type) + '&id=' + encodeURIComponent(item.id);
}
function sourceLink(url) {
  const source = link('', url, 'source-link');
  const icon = el('i', 'fa-brands fa-github');
  icon.setAttribute('aria-hidden', 'true');
  add(source, icon, el('span', '', 'Source'));
  source.setAttribute('aria-label', 'View source on GitHub');
  return source;
}
function card(type, item) {
  const root = el('article', 'content-card');
  const visual = el('div', 'card-visual');
  const image = asset(item.image);
  if (image) {
    const img = el('img');
    img.src = image;
    img.alt = '';
    img.loading = 'lazy';
    visual.append(img);
  } else visual.append(el('span', '', (item.title || '?').charAt(0).toUpperCase()));
  const body = el('div', 'card-body');
  if (item.meta) body.append(el('span', 'card-meta', item.meta));
  add(body, el('h3', '', item.title), el('p', '', item.summary));
  if (Array.isArray(item.tags)) {
    const tags = el('div', 'tags');
    item.tags.forEach(tag => tags.append(el('span', '', tag)));
    body.append(tags);
  }
  if (type === 'projects') {
    const actions = el('div', 'project-actions');
    actions.append(link('View details →', detailHref(type, item), 'text-link'));
    const repo = githubRepoUrl(item.githubUrl);
    if (repo) actions.append(sourceLink(repo));
    body.append(actions);
  } else {
    body.append(link('View details →', detailHref(type, item), 'text-link'));
  }
  add(root, visual, body);
  return root;
}
function grid(type, items, limit) {
  const root = el('div', 'card-grid');
  const visible = limit ? items.slice(0, limit) : items;
  visible.forEach(item => root.append(card(type, item)));
  if (!visible.length) root.append(el('p', 'empty-state', 'No entries yet. Add one in data/content.json.'));
  return root;
}
function home(data) {
  const site = data.site;
  const hero = el('section', 'hero');
  const inner = el('div', 'container hero-inner');
  const copy = el('div');
  add(copy, el('span', 'eyebrow', 'Hello, I’m'), el('h1', '', site.name),
    el('p', 'hero-tagline', site.tagline), el('p', 'hero-intro', site.intro));
  const buttons = el('div', 'button-row');
  if (site.resume === 'resume.pdf') buttons.append(link('View resume ↗', site.resume, 'button button-primary'));
  buttons.append(link('Contact me', '#contact', 'button button-secondary'));
  copy.append(buttons);
  const portrait = el('div', 'avatar-frame');
  const avatar = asset(site.avatar);
  if (avatar) {
    const img = el('img');
    img.src = avatar;
    img.alt = site.name;
    portrait.append(img);
  }
  add(inner, copy, portrait);
  hero.append(inner);
  app.append(hero);

  const [aboutRoot, aboutInner] = section('about', 'About', data.about.title, data.about.intro);
  const aboutGrid = el('div', 'about-grid');
  (data.about.cards || []).forEach(item => {
    const box = el('article', 'info-card');
    add(box, el('h3', '', item.title), el('p', '', item.text));
    aboutGrid.append(box);
  });
  aboutInner.append(aboutGrid);
  app.append(aboutRoot);

  const [awardRoot, awardInner] = section('achievements', 'Achievements', 'Selected achievements', 'Milestones from my academic journey.');
  awardRoot.classList.add('section-muted');
  const awards = el('div', 'award-grid');
  (data.achievements || []).forEach(item => {
    const box = el('article', 'award-card');
    add(box, el('span', 'award-icon', item.icon || '★'), el('h3', '', item.title), el('p', '', item.summary));
    awards.append(box);
  });
  awardInner.append(awards);
  app.append(awardRoot);

  [
    ['experience', 'Selected activities'],
    ['blogs', 'Latest writing'],
    ['projects', 'Selected projects']
  ].forEach(([type, title], index) => {
    const [root, content] = section('', labels[type], title);
    if (index % 2) root.classList.add('section-muted');
    content.append(grid(type, data[type] || [], 3));
    content.append(link('View all ' + labels[type] + ' →', type + '.html', 'section-link'));
    app.append(root);
  });

  const [contactRoot, contactInner] = section('contact', 'Contact', 'Let’s connect', 'Reach out for collaboration, opportunities, or a conversation.');
  const contacts = el('div', 'contact-grid');
  (data.contact || []).forEach(item => {
    const href = external(item.url);
    if (!href) return;
    const box = link('', href, 'contact-card');
    const icon = el('div', 'contact-icon');
    const imagePath = asset(item.iconImage);
    if (imagePath) {
      const image = el('img');
      image.src = imagePath;
      image.alt = '';
      image.loading = 'lazy';
      icon.append(image);
    } else if (Object.hasOwn(contactIconClasses, item.icon)) {
      const symbol = el('i', contactIconClasses[item.icon]);
      symbol.setAttribute('aria-hidden', 'true');
      icon.append(symbol);
    }
    add(box, icon, el('strong', '', item.label), el('span', '', item.detail));
    contacts.append(box);
  });
  contactInner.append(contacts);
  app.append(contactRoot);
}
function listing(data, type) {
  const descriptions = {
    experience: 'Research, mentoring, development, and community work.',
    blogs: 'Thoughts on programming, AI, learning, and building.',
    projects: 'Experiments and projects across software and AI.'
  };
  const [root, inner] = section('', labels[type], labels[type], descriptions[type]);
  root.classList.add('listing-section');
  inner.append(grid(type, data[type] || []));
  app.append(root);
  document.title = labels[type] + ' | ' + data.site.name;
}
function block(item) {
  if (!item || typeof item !== 'object') return null;
  switch (item.type) {
    case 'heading': return el('h2', '', item.text);
    case 'paragraph': return el('p', '', item.text);
    case 'quote': return el('blockquote', '', item.text);
    case 'code': {
      const pre = el('pre');
      pre.append(el('code', '', item.text));
      return pre;
    }
    case 'list': {
      const list = el(item.ordered ? 'ol' : 'ul');
      (item.items || []).forEach(value => list.append(el('li', '', value)));
      return list;
    }
    case 'image': {
      const src = asset(item.src);
      if (!src) return null;
      const figure = el('figure');
      const image = el('img');
      image.src = src;
      image.alt = item.alt || '';
      figure.append(image);
      if (item.caption) figure.append(el('figcaption', '', item.caption));
      return figure;
    }
    case 'link': {
      const href = external(item.url);
      return href ? link(item.text || href, href, 'article-link') : null;
    }
    default: return null;
  }
}
function detail(data) {
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  const id = params.get('id');
  const item = Object.hasOwn(labels, type) && (data[type] || []).find(entry => entry.id === id);
  const root = el('article', 'article-page');
  const inner = el('div', 'container article-shell');
  if (!item) {
    add(inner, el('h1', '', 'Content not found'), link('← Back to home', 'index.html', 'text-link'));
  } else {
    add(inner, link('← ' + labels[type], type + '.html', 'back-link'),
      el('span', 'eyebrow', item.meta || labels[type]),
      el('h1', '', item.title), el('p', 'article-summary', item.summary));
    if (Array.isArray(item.tags) && item.tags.length) {
      const tags = el('div', 'tags');
      item.tags.forEach(tag => tags.append(el('span', '', tag)));
      inner.append(tags);
    }
    if (type === 'projects') {
      const repo = githubRepoUrl(item.githubUrl);
      if (repo) inner.append(sourceLink(repo));
    }
    const blocks = Array.isArray(item.content) ? item.content : [];
    const uniqueBlocks = blocks.filter((entry, index) =>
      !(index === 0 && entry.type === 'paragraph' && entry.text === item.summary));
    if (uniqueBlocks.length) {
      const body = el('div', 'article-body');
      uniqueBlocks.forEach(entry => { const node = block(entry); if (node) body.append(node); });
      inner.append(body);
    }
    document.title = item.title + ' | ' + data.site.name;
  }
  root.append(inner);
  app.append(root);
}
async function start() {
  if (localStorage.getItem('theme') === 'light') document.documentElement.classList.add('light');
  let stage = 'fetch';
  try {
    const response = await fetch('data/content.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    stage = 'parse';
    const data = await response.json();
    stage = 'render';
    header(data.site);
    if (page === 'home') home(data);
    else if (page === 'post') detail(data);
    else if (labels[page]) listing(data, page);
    footer(data.site);
    if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  } catch (error) {
    console.error('Could not load portfolio content:', error);
    const messages = {
      fetch: 'Could not load data/content.json. Start the local preview server, then refresh this page.',
      parse: 'data/content.json contains invalid JSON. Check its commas and brackets, then refresh this page.',
      render: 'Could not render the page. Check the browser console for details.'
    };
    app.append(el('p', 'load-error', messages[stage]));
  }
}
start();
