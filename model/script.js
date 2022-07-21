import mongoose from "mongoose";
import User from "./schema/user.js";
import Session from "./schema/session.js";

async function main() {
    await Session.updateMany({student: "PLACEMENT"}, {student: ""});
    return;
    var bsp=await User.findOne({user:"BigStickPolicies"});
    if(!bsp) console.log("No bigstickpolciise");
    bsp.permissions=["admin","post-session","signup"]
    await bsp.save();
}
export default main;