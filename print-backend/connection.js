require('dotenv').config();
const mongoose = require('mongoose');
const connectionStr = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PW}@cluster0.upnxrq7.mongodb.net/Cluster0?retryWrites=true&w=majority`;
mongoose.connect(connectionStr,{useNewUrlparser:true})
.then(()=>console.log('connected to mongodb'))
.catch(err=>console.log(err))

mongoose.connection.on('error', err =>{
    console.log(err);
})