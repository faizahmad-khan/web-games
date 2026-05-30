// Compatibility helpers for older browsers and touch/keyboard activation
(function(){
  try{
    // Improve touch behavior
    document.documentElement.style.touchAction = document.documentElement.style.touchAction || 'manipulation';

    function makeActivatable(el){
      if(!el) return;
      if(!el.hasAttribute('role')) el.setAttribute('role','button');
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');

      el.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); }
      });

      el.addEventListener('touchstart', function(e){
        e.preventDefault(); el.click();
      }, {passive:false});
    }

    function init(){
      // Make any element with class `play-button` or role=button respond to keyboard/touch
      Array.from(document.querySelectorAll('.play-button, [role="button"]')).forEach(makeActivatable);

      // Ensure canvas elements are focusable for keyboard controls
      Array.from(document.querySelectorAll('canvas')).forEach(function(c){
        if(!c.hasAttribute('tabindex')) c.setAttribute('tabindex','0');
        c.style.outline = c.style.outline || 'none';
      });
    }

    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }catch(e){ console.warn('compat.js error', e); }
})();
