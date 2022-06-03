post_url='/api/manage'
function mysubmit() {
    var data=jscreator.get();
    var submission={user:data.username,permission:data.permission,operation:data.operation.select}
    console.log(submission);
    submit(submission);
}
async function newsession_load() {
    var template={
        type:"object",
        username: {
            type:"string"
        },
        permission: {
            type:"string"
        },
        operation: {
            type: "switch",
            grant: {
                type:"nothing"
            },
            revoke: {
                type:"nothing"
            }
        },
        submit: {
            type:"button",
            text:"Submit",
            onclick: mysubmit,
        },
    }
    setTitle("Manage Permissions")
    jscreator=getJSONCreator(template)
    $("#jsoncreator").append(
        $(jscreator.create())
    )

}
newsession_load();