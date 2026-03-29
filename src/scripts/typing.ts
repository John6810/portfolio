const titles = ['Cloud Solutions Architect', 'Microsoft Azure', 'IaC / Terraform'];

const el = document.getElementById('typingText');
let ti = 0, ci = 0, del = false;
let timer: ReturnType<typeof setTimeout>;

function type() {
  if (!el) return;
  const cur = titles[ti % titles.length];

  if (del) {
    el.textContent = cur.substring(0, ci--);
    if (ci < 0) { del = false; ti++; timer = setTimeout(type, 500); return; }
  } else {
    el.textContent = cur.substring(0, ci++);
    if (ci > cur.length) { del = true; timer = setTimeout(type, 2000); return; }
  }
  timer = setTimeout(type, del ? 50 : 80);
}

type();

// Speed up deletion when language changes so new language titles appear quickly
document.addEventListener('langchange', () => {
  clearTimeout(timer);
  del = true;
  timer = setTimeout(type, 50);
});
