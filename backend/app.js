const express = require("express") ;
const app = express() ;
const cors = require("cors") ;
const user_details = require("./Routes/user_details");
const connection = require("./database/db");
const dotenv = require("dotenv") ;
dotenv.config()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"))
app.use("/", user_details)
app.get("/", (req, res) => {
    res.send({message : "Welcome to Homepage"})
})
app.listen(process.env.PORT,async() => {
    await connection ;
    console.log("Server start at 8080")
})