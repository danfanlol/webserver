import { v4 as uuidv4 } from 'uuid';
import express from "express";
const router=express.Router();
const functionMap=new Map();
router.post(`/query/:id`,(req,res) => {
    console.log("recieved")
    try {
        let params=JSON.parse(req.body.str);
        var fxn=functionMap.get(req.params.id);
        
        params.splice(0,0,{req,res})

        let returnvalue=fxn.call(...params)

        res.status(200).json(returnvalue);
    }catch(e) {
        console.log(e);
        res.status(500).json(e);
    }
})
function apiify(object) {
    let type=typeof object;
    if(type=="number"||type=="string"||type=="null"||type=="bigint"||type=="boolean"||type=="symbol"||type=="undefined") {
        return object;
    }
    if(type=="function") {
        let id=uuidv4();
        functionMap.set(id,object);
        return {type:"function",id};
    }
    if(type=="array") {
        return object.map((e) => apiify(e))
    }
    if(type=="object") {
        let newObj={};
        for(let param in object) {
            newObj[param]=apiify(object[param]);
        }
        return {type:"object",val:newObj};
    }
}
export default {apiify:apiify,router:router};