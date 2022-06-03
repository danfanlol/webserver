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
            url: `/api/session/fromstudent/${user}`
        },
        operation: {
            type:"switch",
            quit: {
                type:"nothing"
            }
        },
        submit: {
            type:"button",
            text:"Submit",
            onclick: mysubmit,
        },
    }
    setTitle("Manage your classes")
    jscreator=getJSONCreator(template)
    $("#jsoncreator").append(
        $(jscreator.create())
    )
}
newsession_load();
