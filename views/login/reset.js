$(() => {
  console.log("ready!");
  const errbar = document.getElementById("login-error");
  const form = document.getElementById("login-form");
  const pass = document.getElementById("login-password");
  const submit = document.getElementById("login-submit");
  const confirm = document.getElementById("login-confirm");
  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const password = pass.value;
    const conf = confirm.value;
    if (!password || !conf) {
      errbar.innerHTML = "All fields needed.";
      errbar.style.opacity = 1;
      return;
    }
    if (conf != password) {
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

    var info = { pass: password };
    $.ajax({
      type: "POST",
      url: window.location.href,
      data: info,
      xhrFields: {
        withCredentials: true,
      },
      success: function (xhr, status, error) {
        window.location.href = "/resetpasswordsuccess";
      },
      error: function (xhr, status, error) {
        console.log(xhr);
        if (xhr.responseJSON) {
          console.log(xhr.responseJSON.message);
          errbar.innerHTML = xhr.responseJSON.message;
          errbar.style.opacity = 1;
        }
      },
    });
  });
});
