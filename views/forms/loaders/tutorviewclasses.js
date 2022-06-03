post_url="/api/tutorviewclasses"
function mysubmit() {
    var data=jscreator.get()
    console.log(data);
    var submission={};
    submission.session=data.sessions;
    submission.operation=data.operation.select;
    console.log(submission);
    submit(submission);
}
async function newsession_load() {
    var template = {
        type:"object",
        sessions: {
            type:"classselector",
            url: `/api/session/fromtutor/${user}`
        },
        
        
        operation: {
            type:"switch",
            delete: {
                type:"nothing"
            },
            kick: {
                type:"nothing"
            }
        },
        submit: {
            type:"button",
            text:"Submit",
            onclick: mysubmit,
        },
        add: {
            type:"link",
            url:"/forms/newsession",
            text:"Add More Sessions"
        },
    }
    setTitle("Manage your sessions")
    jscreator=getJSONCreator(template)
    $("#jsoncreator").append(
        $(jscreator.create())
    )
}
newsession_load();
