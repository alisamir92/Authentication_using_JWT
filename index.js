const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRoute")
const cookieParser = require("cookie-parser")

dotenv.config();

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/api", authRouter);
app.use("/api", userRouter)

mongoose
.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Database is connected")
})
.catch((err)=>{console.log(err)})


app.listen(5000, (req, res) => {
    console.log("Server is running")
})