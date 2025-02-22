import express from "express";
const app = express();

//start a server
//attach two communitcation methods
// 
app.use(express.json());
app.post("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(3030,()=>{
    console.log("Server is running")
});