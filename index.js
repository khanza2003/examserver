require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./routes/router')
require('./config/connection')

const userServer=express()
userServer.use(cors())
userServer.use(express.json())
userServer.use(router)

const PORT=3000 || process.env.PORT

userServer.listen(PORT,()=>{
    console.log(`userServer started at port :${PORT} and waiting for client request`);
    
})
userServer.get('/',(req,res)=>{
    res.status(200).send('<h1 style="color:black">userServer started  and waiting for client request!!!</h1>')
})