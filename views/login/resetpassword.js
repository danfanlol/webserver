$(() => {
  console.log("ready!");
  const errbar = document.getElementById("login-error");
  const form = document.getElementById("login-form");
  const email = document.getElementById("login-email");
  const submit = document.getElementById("login-submit");
  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const emaile = email.value;
    if (!email) {
      errbar.innerHTML = "All fields needed.";
      errbar.style.opacity = 1;
      return;
    }
    var info = { email: emaile };
    $.ajax({
      type: "POST",
      url: "/api/auth/recover",
      data: info,
      success: function () {
        window.location.href = "/resetpasswordsent";
      },
      error: function () {
        if (xhr.responseJSON) {
          console.log(xhr.responseJSON.message);
          errbar.innerHTML = xhr.responseJSON.message;
          errbar.style.opacity = 1;
        } else {
          errbar.innerHTML = "An error occurred.";
          errbar.style.opacity = 1;
        }
      },
    });
  });
});
