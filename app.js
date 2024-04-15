const express = require('express')
const app = express()
const router = require('./router/routes')
const connectToMongoDB = require('./connectDB')
connectToMongoDB()


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(router)
//app.get('/getProperties', express.static(path.join(__dirname, 'properties_images')))
app.listen(9999,()=>{console.log('server running')})