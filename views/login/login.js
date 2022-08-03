$(() => {
  console.log("ready!");
  const form = document.getElementById("login-form");
  const errbar = document.getElementById("login-error");
  const email = document.getElementById("login-email");
  const pass = document.getElementById("login-password");
  const submit = document.getElementById("login-submit");
  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const emaile = email.value;
    const password = pass.value;
    if (!emaile || !password) {
      errbar.innerHTML = "All fields needed.";
      errbar.style.opacity = 1;
      return;
    }

    var login = { email: emaile, pass: password };
    $.ajax({
      type: "POST",
      url: "/api/auth/login",
      data: login,
      xhrFields: {
        withCredentials: true,
      },

      success: function (xhr, status, error) {
        window.location.href = new URLSearchParams(location.search).get("next")
            ?? "/findtutors";
        // console.log(xhr);
      },
      error: function (xhr, status, error) {
        if (xhr.responseJSON) {
          console.log(xhr.responseJSON.message);
        }
        errbar.innerHTML = "Incorrect email or password";
        errbar.style.opacity = 1;
      },
    });
  });
});
