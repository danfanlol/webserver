var root;
(async () => {
    function parse(object) {
        let type=typeof object;
        if(type=="number"||type=="string"||type=="null"||type=="bigint"||type=="boolean"||type=="symbol"||type=="undefined") {
            return object;
        }
        if(type=="array") {
            return object.map(x=>parse(x));
        }
        type=object.type;
        if(type=="function") {
            return function (...args)  {
                let res,rej;
                let completion=new Promise((resolve,reject) => {
                    res=resolve;
                    rej=reject;
                })
                console.log(args);
                console.log(JSON.stringify(args));
                $.ajax({
                    type: "POST",
                    url: `/api/query/${object.id}`,
                    data: {str:JSON.stringify(args)},
                    xhrFields: {
                      withCredentials: true,
                    },
              
                    success: function (xhr, status, error) {
                        res(xhr);
                    },
                    error: function (xhr, status, error) {
                        rej(xhr);
                    },
                });
                return completion;
            }
        }
        if(type=="object") {
            let newObj={};
            for(let param in object.val) {
                newObj[param]=parse(object.val[param])
            }
            return newObj;
        }

        
        
        
    }
    $.get("/api/apiobj").then((val) => {
        let thing=JSON.parse(val);
        root=parse(thing);
    })
})();
