import express from 'express'
import {join} from 'path'
const PORT = 9090

const app = express()

app.use(express.static(join(process.cwd(),"css")))
app.use(express.static(join(process.cwd(),"public")))
app.use(express.static(join(process.cwd(),"js")))



app.get("/",(req,res)=>{
    res.sendFile(join(process.cwd(),"html","index.html"))
})

app.get("/register",(req,res)=>{
    res.sendFile(join(process.cwd(),"html","register.html"))
})


app.get("/login",(req,res)=>{
    res.sendFile(join(process.cwd(),"html","login.html"))
})


app.get("/admin",(req,res)=>{
    res.sendFile(join(process.cwd(),"html","admin.html"))
})


app.get("/js/index.js",(req,res)=>{
    res.sendFile(join(process.cwd(),"js","index.js"))
})



app.listen(PORT,()=>console.log("frontend server run"))