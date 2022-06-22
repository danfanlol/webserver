$(() => {
  console.log("ready!");
  const form = document.getElementById("login-form");
  const errbar = document.getElementById("login-error");
  const user = document.getElementById("login-username");
  const pass = document.getElementById("login-password");
  const submit = document.getElementById("login-submit");
  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const username = user.value;
    const password = pass.value;
    if (!username || !password) {
      errbar.innerHTML = "All fields needed.";
      errbar.style.opacity = 1;
      return;
    }

    var login = { user: username, pass: password };
    $.ajax({
      type: "POST",
      url: "/api/auth/login",
      data: login,
      xhrFields: {
        withCredentials: true,
      },

      success: function (xhr, status, error) {
        window.location.href = "/findtutors";
        console.log(xhr);
      },
      error: function (xhr, status, error) {
        if (xhr.responseJSON) {
          console.log(xhr.responseJSON.message);
        }
        errbar.innerHTML = "Incorrect username or password";
        errbar.style.opacity = 1;
      },
    });
  });
});
