import mongoose from "mongoose";
import User from "./schema/user.js";
import Session from "./schema/session.js";

async function main() {
    /* Promise.all((await Session.find()).map(async session => {
        console.log(session.tutor);
        session.tutorId = (await User.findOne({
            user: session.tutor
        }))._id;
        if (session.student) {
            session.studentId = (await User.findOne({
                user: session.student
            }))._id;
        }
        session.save();
    })); */

    return;
    var bsp=await User.findOne({user:"BigStickPolicies"});
    if(!bsp) console.log("No bigstickpolciise");
    bsp.permissions=["admin","post-session","signup"]
    await bsp.save();
}
export default main;