/* Theme toggle with persistence */
(function(){
  const btn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if(stored === 'dark') document.body.classList.add('theme-dark');
  if(btn){
    const setPressed = () => btn.setAttribute('aria-pressed', document.body.classList.contains('theme-dark'));
    setPressed();
    btn.addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
      setPressed();
    });
  }
})();

/* Active year in footer */
(function(){
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
})();

/* Moving code banner: simple typewriter cycling */
(function(){
  const el = document.querySelector('.code-line');
  if(!el) return;
  try {
    const items = JSON.parse(el.getAttribute('data-rotate'));
    let i=0, j=0, dir=1;
    const type = () => {
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        el.textContent = items[i % items.length];
        return;
      }
      el.classList.add('typing');
      const str = items[i % items.length];
      el.textContent = str.slice(0, j);
      j += dir;
      if(j > str.length + 8){ dir = -1; }
      if(j <= 0){ dir = 1; i++; }
      setTimeout(type, 60);
    };
    type();
  } catch(e){ el.textContent = "Welcome to Shaima's World"; }
})();
