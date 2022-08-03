$(() => {
	console.log("ready!");
	const errbar = document.getElementById("login-error");
	const nameFirst = document.getElementById("login-name-first");
	const nameLast = document.getElementById("login-name-last");
	const pass = document.getElementById("login-password");
	const submit = document.getElementById("login-submit");
	submit.addEventListener("click", (event) => {
	  event.preventDefault();
	  const firstName = nameFirst.value;
	  const lastName = nameLast.value;
	  const password = pass.value;
	  if (!firstName || !lastName || !password) {
		errbar.innerHTML = "All fields needed.";
		errbar.style.opacity = 1;
		return;
	  }
	  var info = { name: { first: firstName, last: lastName }, pass: password };
	  $.ajax({
		type: "POST",
		url: "/api/auth/edit",
		data: info,
		xhrFields: {
		  withCredentials: true,
		},
		success: function (xhr, status, error) {
		  console.log("success");
		  window.location.replace("/");
		},
		error: function (xhr, status, error) {
		  console.log(xhr.responseJSON.message);
		  errbar.innerHTML = xhr.responseJSON.message;
		  errbar.style.opacity = 1;
		},
	  });
	});
  });
  