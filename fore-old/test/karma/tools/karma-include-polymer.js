(function() {
  window.__karma__.loaded = function(){
    window.addEventListener('WebComponentsReady', function() {
      window.__karma__.start();
    });
  };

  var l = document.createElement('link');
  l.rel = 'import';
  l.href = 'base/app/bower_components/polymer/polymer.html';
  document.head.appendChild(l);
})();
