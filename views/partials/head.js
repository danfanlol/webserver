var username;
var dump_name;
$.get('/api/user/')
  .done((data) => {
    console.log(data);
    username = data.user;
    if(username) {
      $("#nav-login").remove()
      $("#nav-welcome").text(`Welcome, ${username}`)
    }else {
      $("#nav-logout").remove();
      $("#nav-welcome").remove();
    }
  })
  .fail(() => {
    alert('Could not connect to the server.');
  });
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
