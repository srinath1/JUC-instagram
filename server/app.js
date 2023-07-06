const express=require('express')
const app=express()
const PORT=5000
const mongoose=require('mongoose')
const {MONGOURI}=require('./keys')
require('./models/user')
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


mongoose.connect(MONGOURI,{
    useUnifiedTopology: true,
    useNewUrlParser: true

})
mongoose.connection.on('connected',()=>{
    console.log('DB Connected')
})
mongoose.connection.on('error',(err)=>{
    console.log('Error in connecting to DB',err)
})

const path = require("path");
__dirname = path.resolve();
// render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT,()=>{
    console.log('Server Running')
})