const mongoose = require('mongoose')
const connectURI = 'mongodb+srv://danielbenjumea0:Benyamin77@cluster0.p5himkc.mongodb.net/CooworkingDB?retryWrites=true&w=majority'

const connectToMongoDB = async()=>{
    try{
        await mongoose.connect(connectURI)
        console.log('Connected to MongoDB Atlas.')
        
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = connectToMongoDB
