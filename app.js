const express=require("express");
const path=require("path");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const app=express();
const dbPath=path.join(__dirname,"covid19IndiaPortal.db");
let db=null;

const initializeDBAndServer=()=>{
    try {
        db=open({filename:dbPath,driver:sqlite3.Database});
        app.listen(3000);
    } catch (error) {
        console.log(error.message)
    }
}
initializeDBAndServer();
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});
