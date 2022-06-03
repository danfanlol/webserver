post_url=`/api/signup`

function mysubmit() {
    var data=jscreator.get();
    submission={};
    submission.session=data.area.val.subject.val;
    console.log(submission);
    if(!submission.session) {
        showError("No class selected!")
        return;
    }
    submit(submission);
}
async function newsession_load() {
    var classtypes=await $.get("/api/classtypes")
    var areaselector={
        type:"switch",
        tooltip:"Area (field) of the class you want to take"
    }
    for(var area in classtypes) {
        var append={
            type:"switch"
        };
        areaselector[area]={
            type:"object",
            subject:append,
        }
        for(var subject of classtypes[area]) {
            append[subject]={
                type:"classselector",
                url:`/api/session/fromsubject/${subject}`
            }
        }
    }
    var template={
        type:"object",
        area: areaselector,
        signup: {
            type:"button",
            text:"Sign Up",
            onclick: mysubmit,
        },
    }
    setTitle("Sign Up For New Session")
    jscreator=getJSONCreator(template)
    $("#jsoncreator").append(
        $(jscreator.create())
    )

}
newsession_load();
