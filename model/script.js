import mongoose from "mongoose";
import User from "./schema/user.js";

async function main() {
    return;
    var bsp=await User.findOne({user:"BigStickPolicies"});
    if(!bsp) console.log("No bigstickpolciise");
    bsp.permissions=["admin","post-session","signup"]
    await bsp.save();
}
export default main;