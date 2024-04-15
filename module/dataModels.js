const mongoose = require('mongoose')


const cooworkerSchema = mongoose.Schema({
    _id : Number,
    gender : String,
    firstName : String,
    lastName : String,
    country : String,
    phone : Number,
    //Credentials
    role : String, //Role = cooworker
    email : String, //Username = email
    password : {} //Password = private
  
})
const ownerSchema = mongoose.Schema({
    _id : Number,
    gender : String,
    firstName : String,
    lastName : String,
    country : String,
    phone : Number,
    properties: Array,
    //Credentials
    role : String, //Role = cooworker
    email : String, //Username = email
    password : {} //Password = private
  
})
const propertySchema = mongoose.Schema({
    propertyID : Number,
    propertyName : String,
    price : Number,
    capacity : Number,
    neighborhood : String,
    address: {},
    area : Number,
    parking : String,
    publicTransportation : String,
    smoke :  String,
    availability : {},
    ownerID : Number,
    imageURL : String
  
})
const reservationSchema = mongoose.Schema({

  
})

const cooworkerModel = mongoose.model('Cooworker',cooworkerSchema) //This model is used to collect cooworkes info
const ownerModel = mongoose.model('Owner', ownerSchema)
const propertyModel = mongoose.model('Property', propertySchema)
const reservationModel= mongoose.model('Reservation', reservationSchema)
module.exports = {cooworkerModel,ownerModel,propertyModel,reservationModel}