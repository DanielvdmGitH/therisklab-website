function toggleMenu(){
  var nav = document.getElementById('navLinks');
  var btn = document.getElementById('menuToggle');
  var isOpen = nav.classList.toggle('open');
  if(btn){ btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false'); }
}
function closeMenu(){
  document.getElementById('navLinks').classList.remove('open');
  var btn = document.getElementById('menuToggle');
  if(btn){ btn.setAttribute('aria-expanded', 'false'); }
}
/* Note: the .reveal fade-in effect is handled entirely by a CSS animation
   in style.css now, so it works even if this script fails to load or run. */
