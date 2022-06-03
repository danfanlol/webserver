
post_url=`/api/session`
function mysubmit() {
    var submission={};
    var data=jscreator.get();
    console.log(data);
    submission.duration=data.duration;
    var day=data.day.select;
    submission.begin=days.indexOf(day)*24+data.day.val.time;
    console.log(submission);

    submission.subject=data.area.val.subject.select;
    console.log(submission);
    submit(submission);
}

async function newsession_load() {

    var timeSelector={
        type:"switch",
        tooltip:"Day of the week you're tutoring",
    }
    var classtypes=await $.get("/api/classtypes")
    console.log(classtypes);
    
    var areaselector={
        type:"switch",
        tooltip:"Area (field) of the class you're tutoring"
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
                type:"nothing"
            }
        }
    }

    setTitle("Post New Session")
    for(var day of days) {
        timeSelector[day]={
            type:"object",
            time: {
                type:"number",
                min:0,
                max:24,
                tooltip:"Hour of day (from 0-24, 0:00 is midnight, 12:00 is noon) Use decimals for parts of an hour"
            }
        }
    }
    
    var template={
        type:"object",
        area: areaselector,
        day:timeSelector, 
        duration: {
            type:"number",
            min:0,
            max:24,
            tooltip:"Duration of session (in hours). Decimals allowed",
        },
        submit: {
            type:"button",
            text:"Submit",
            onclick: mysubmit,
        },
        manage: {
            type:"link",
            text:"Manage Sessions",
            url: "/forms/tutorviewclasses"
        }
    }
    jscreator=getJSONCreator(template)
    $("#jsoncreator").append(
        $(jscreator.create())
    )
}
newsession_load();
