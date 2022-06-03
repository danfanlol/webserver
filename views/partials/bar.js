$('#searchform').on('submit', (event) => {
  event.preventDefault();
  window.location.href = '/search?search=' + $('#navbar-control').val();
});
$('#worldsearch').on('click', (event) => {
  event.preventDefault();
  window.location.href = '/search?search=' + $('#navbar-control').val();
});
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
