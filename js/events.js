const controls = document.getElementById('controls');

function getViewportHeight() {
  return Math.max(document.documentElement.clientHeight || 0,
    window.innerHeight || 0);
}

function setViewHeight() {
  view.style.height = (getViewportHeight() - controls.offsetHeight) + 'px';
}

window.addEventListener('load', setViewHeight);
window.addEventListener('resize', setViewHeight);

visualizer = new Visualizer();

shuffleButton.addEventListener('click', function() {
  visualizer.shuffle();
}, false);

sortButton.addEventListener('click', function() {
  visualizer.sort();
}, false);
