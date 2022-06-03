function setTitle(title) {
    $("#title").text(title);
    $("#header").text(title);
}
var post_url="";
var jscreator;
var days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
function showError(message) {
    $("#errbar").html(message);
    $("#errbar").css("opacity","1.0");
}
$("#errbar").css("opacity","0.0");
async function submit(data) {
    $.ajax({
        type: "POST",
        url: post_url,
        data: data,
        xhrFields: {
          withCredentials: true,
        },
  
        success: function (xhr, status, error) {
          $("#jsoncreator").html("");
          $("#header").text("Form successfuly submitted.")
          console.log(xhr);
        },
        error: function (xhr, status, error) {
            var err="Error in form."
          if (xhr.responseJSON) {
            err=xhr.responseJSON.message;
            console.log(xhr.responseJSON.message);
          }
          showError(err);
        },
      });
}

function requireLogin() {
    if(!username) {
        window.location.href="/login"
    }
}