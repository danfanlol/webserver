$(() => {
  console.log("ready!");
  const errbar = document.getElementById("login-error");
  const form = document.getElementById("login-form");
  const user = document.getElementById("login-username");
  const email = document.getElementById("login-email");
  const pass = document.getElementById("login-password");
  const submit = document.getElementById("login-submit");
  const confirm = document.getElementById("login-confirm");
  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const username = user.value;
    const password = pass.value;
    const emaile = email.value;
    const confpass = confirm.value;
    if (!username || !password || !email || !confpass) {
      errbar.innerHTML = "All fields needed.";
      errbar.style.opacity = 1;
      return;
    }
    if (confpass != password) {
      errbar.innerHTML = "Passwords do not match.";
      errbar.style.opacity = 1;
      pass.value = "";
      confirm.value = "";
      return;
    }
    if (password.length < 6) {
      errbar.innerHTML = "Password must be at least 6 characters long.";
      errbar.style.opacity = 1;
      pass.value = "";
      confirm.value = "";
      return;
    }
    var info = { user: username, pass: password, email: emaile };
    $.ajax({
      type: "POST",
      url: "/api/auth/register",
      data: info,
      xhrFields: {
        withCredentials: true,
      },
      success: function (xhr, status, error) {
        console.log("success");
        window.location.replace("/emailsent");
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseJSON.message);
        errbar.innerHTML = xhr.responseJSON.message;
        errbar.style.opacity = 1;
      },
    });
  });
});
