import mongoose from "mongoose";
import bcrypt from "bcrypt";

import init from "./init.js";
import script from "./script.js"

async function init_mongoose(){
  await mongoose.connect(process.env.MONGO_URL).catch((e) => {
    console.log(e);
  });
  console.log("apparently connected?");
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('Connected to mongodb!');
  });

  init();
  script();
}

export default init_mongoose;