const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
let content;
try {
  content = JSON.parse(fs.readFileSync(path.join(root, 'data/content.json'), 'utf8'));
} catch (error) {
  console.error('Cannot read data/content.json: ' + error.message);
  process.exit(1);
}
const problems = [];
const groups = ['experience', 'blogs', 'projects'];
const assetPattern = /^images\/[a-z0-9/_-]+\.(png|jpe?g|webp|svg)$/i;

function checkAsset(value, location) {
  if (!value) return;
  if (!assetPattern.test(value) || !fs.existsSync(path.join(root, value))) {
    problems.push(location + ': missing or invalid image ' + value);
  }
}

if (!content.site || !content.site.name) problems.push('site.name is required');
if (!content.about || !Array.isArray(content.about.cards)) problems.push('about.cards must be an array');
if (!Array.isArray(content.achievements)) problems.push('achievements must be an array');
if (!Array.isArray(content.contact)) problems.push('contact must be an array');
checkAsset(content.site?.avatar, 'site.avatar');
if (!fs.existsSync(path.join(root, 'resume.pdf'))) problems.push('resume.pdf is missing');
for (const [index, item] of (Array.isArray(content.contact) ? content.contact : []).entries()) {
  const place = 'contact[' + index + ']';
  if (!item.label || !item.url) problems.push(place + ': label and url are required');
  if (item.icon && !['github', 'facebook', 'linkedin', 'email', 'instagram', 'discord', 'phone'].includes(item.icon)) {
    problems.push(place + ': unsupported icon ' + item.icon);
  }
  checkAsset(item.iconImage, place + '.iconImage');
}

for (const group of groups) {
  if (!Array.isArray(content[group])) {
    problems.push(group + ' must be an array');
    continue;
  }
  const ids = new Set();
  for (const [index, item] of content[group].entries()) {
    const place = group + '[' + index + ']';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id || '')) problems.push(place + ': id must use lowercase letters, numbers and hyphens');
    if (ids.has(item.id)) problems.push(place + ': duplicate id ' + item.id);
    ids.add(item.id);
    if (!item.title || !item.summary) problems.push(place + ': title and summary are required');
    checkAsset(item.image, place + '.image');
    if (group === 'projects' && item.githubUrl) {
      try {
        const repo = new URL(item.githubUrl);
        if (repo.protocol !== 'https:' || repo.hostname !== 'github.com' || repo.pathname.split('/').filter(Boolean).length < 2) {
          problems.push(place + ': githubUrl must be an HTTPS GitHub repository URL');
        }
      } catch {
        problems.push(place + ': githubUrl must be an HTTPS GitHub repository URL');
      }
    }
    if (item.content && !Array.isArray(item.content)) problems.push(place + '.content must be an array');
    for (const [blockIndex, block] of (Array.isArray(item.content) ? item.content : []).entries()) {
      const blockPlace = place + '.content[' + blockIndex + ']';
      if (!['heading', 'paragraph', 'quote', 'code', 'list', 'image', 'link'].includes(block.type)) problems.push(blockPlace + ': unsupported type');
      if (block.type === 'list' && !Array.isArray(block.items)) problems.push(blockPlace + ': items must be an array');
      if (block.type === 'image') checkAsset(block.src, blockPlace + '.src');
      if (block.type === 'link' && !/^https?:\/\//i.test(block.url || '')) problems.push(blockPlace + ': link requires an http(s) URL');
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Content valid: ' + groups.map(group => group + ' ' + content[group].length).join(', '));
}
