class JSONCreatorClassSelector extends JSONCreator {
    url;
    value;
    sessions;
    constructor(obj) {
        super(obj);
        this.url=obj.url;
        this.sessions=[];
    }
    create() {
        var element = $(`<div class="creator-object"></div>`);
        $.get(this.url).then((session_array) => {
            if(session_array.length==0) {
                element.html("No sessions...");
            }
            for(let session of session_array) {
                var day=days[Math.floor(session.begin/24)]
                var temphour=(session.begin%24)
                var fullhour=Math.floor(temphour);
                var mins=Math.floor((temphour%1)*60);
                mins=mins.toString();
                if(mins.length==1) {
                    mins="0"+mins;
                }

                var time=`${fullhour}:${mins}`
                var duration=`${session.duration} hours`;
                var part=$(`<div class="session">
                    <span>Tutor: <a href="/tutor/${session.tutor}">${session.tutor}</a></span>
                    <span>${day} ${time}</span>
                    <span>${duration}</span>
                    <span>Student: ${session.student}</span>
                    <span>${session.subject}</span>
                </div>`)
                element.append(part);
                session.element=part;
                session.controller=this;
                part.prop("controller",session);
                part.on("click",function() {
                    var session=this.controller;
                    session.controller.value=session._id;
                    for(var sess of session.controller.sessions) {
                        sess.element.removeClass("session-selected");
                    }
                    $(this).addClass("session-selected")
                });
                this.sessions.push(session);
            }
        })
        return element;
    }
    get() {
        return this.value;
    }

}
registerJSONCreator("classselector",JSONCreatorClassSelector)
