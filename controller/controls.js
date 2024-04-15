const models = require('../module/dataModels')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const secretAccess = crypto.randomBytes(64).toString('hex')

let userID = {id : 9999}
let propertiesID = { id : 1000}

const multerConfig = ()=>{

    const multer = require('multer')
    const path = require('path')
    const storage = multer.diskStorage({
        
        destination : async(req, file, cb)=>{
            const property =  await models.propertyModel.find({propertyName : req.body.name})
            if(property.length > 0) {
                req.body.msg = 'Property already exists, please update'
                console.log('Property already exists, please update')
                return
            }else{
                cb(null, path.join(__dirname, '..', 'properties_images'))
            }
            
        },
        filename :  async (req, file, cb)=>{
    
            const property =  await models.propertyModel.find({propertyName : req.body.name})
            if(property.length > 0) {
                req.body.msg = 'Property already exists, please update'
                //console.log('Property already exists, please update')
            }
            //C:\Users\LENOVO\Documents\Canada\Calgary\BVC\courses\Winter2024\SODV1201\fullStack\Full-Stack-Project 7\Full-Stack-Project 7\Full-Stack-Project 3\Back\properties_images\9999_1000_property1.jpg
            else{
                const authHeader = req.headers['authorization']
                const token = authHeader && authHeader.split(' ')[1]
                let tokenPayload = token.split('.')[1]
                tokenPayload =  JSON.parse(atob(tokenPayload.replace(/-/g, '+').replace(/_/g, '/'))); //Decodes URLBase64 encoding
                req.body.ownerID = tokenPayload.userID
                req.body.propertyID = propertiesID.id
                const imgName = `${req.body.ownerID}_${req.body.propertyID}_${req.body.name}`
                req.body.imageURL = `http://localhost:9999/properties_images/${imgName}${path.extname(file.originalname)}` 
                cb(null, `${imgName}${path.extname(file.originalname)}`)
                propertiesID.id += 1

            }
        }
    })
    const upload = multer({storage : storage})
    return upload
}
const addProperty = async (req,res, next)=>{
    const property =  await models.propertyModel.find({propertyName : req.body.name})
    if(property.length > 0) {
        res.send({message: 'Property already exists, please update'})
        return        
    }
    
    const newProperty = new models.propertyModel({
        propertyID : req.body.propertyID,
        propertyName : req.body.name,
        price :req.body.price,
        capacity :req.body.capacity,
        neighborhood : req.body.neighborhood,
        address: req.body.address,
        area : req.body.area,
        parking : req.body.parking,
        publicTransportation : req.body.publicTransportation,
        smoke :  req.body.smoke,
        ownerID : req.body.ownerID,
        imageURL : req.body.imageURL
        
    })
    try{
        const property = await newProperty.save()
        console.log(property)
        res.send({message : "Image uploaded"})
    }
    catch(e){
        console.log(e.message)
    }

}
const getProperties = async(req,res,next)=>{
    try{
        const properties = await models.propertyModel.find()
        res.send(properties)
    }
    catch(e){
        console.error(e)
    }

}


const signIn = async (req,res,next)=>{    

    if(req.body.role === 'Cooworker'){

        const existingUser = await models.cooworkerModel.find({email : req.body.email})//Find returns an array of the documents that meet the condition
        req.body.password = await bcrypt.hash(req.body.password,10)  //hashes password before storing
        if(existingUser.length > 0){
            const availability = {message : "That user email has been already used."}
            res.send(availability)
            return
        }
        let newUser = new models.cooworkerModel({
            _id: userID.id,
            gender : req.body.gender,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            country : req.body.country,
            phone : req.body.phone,
            role : req.body.role,
            email : req.body.email, 
            password : req.body.password    
        }) 
        try{
            const newCooworker = await newUser.save()
            userID.id -= 1
            console.log(newCooworker)
            res.send( {redirectedURL : `${req.headers.origin}/index.html?confirmation=true`})
        }
        catch(error){
            console.log(error.message)
        }

    } 
    else if(req.body.role === 'Owner'){

        const existingUser = await models.ownerModel.find({email : req.body.email})//Find returns an array of the documents that meet the condition
        req.body.password = await bcrypt.hash(req.body.password,10)  //hashes password before storing
        if(existingUser.length > 0){
        const availability = {message : "That user email has been already used."}
        res.send(availability)
        return
    }

        let newUser = new models.ownerModel({
            _id: userID.id,
            gender : req.body.gender,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            country : req.body.country,
            phone : req.body.phone,
            properties : [],
            role : req.body.role,
            email : req.body.email, 
            password : req.body.password    
        }) 
        try{
            const newOwner = await newUser.save()
            userID.id -= 1
            console.log(newOwner)
            res.send( {redirectedURL : `${req.headers.origin}/index.html?confirmation=true`})
        }
        catch(error){
            console.log(error.message)
        }
    }


}

const logIn = async (req,res,next)=>{
    const registeredCooworker = await models.cooworkerModel.find({email : req.body.email})
    const registeredOwner = await models.ownerModel.find({email : req.body.email})
    const errorData = {message : 'Invalid Username or Password!'}
    if(registeredCooworker.length === 0 && registeredOwner.length === 0){
        console.log(errorData)
        res.send(errorData)
        return
    }

    if(registeredCooworker.length > 0){

        if(await bcrypt.compare(req.body.password, registeredCooworker[0].password)){
            const userJWT = {userID: registeredCooworker[0]._id ,email : registeredCooworker[0].email, role: registeredCooworker[0].role}
            const token = jwt.sign(userJWT, secretAccess,{
                expiresIn : '1h'
            })
            const accessToken = { accessToken : token}
            console.log(accessToken)
            res.send(accessToken)
        }
        else{
            console.log(errorData)   
            res.send(errorData)
        }        

    }
    else if(registeredOwner.length > 0){

        if(await bcrypt.compare(req.body.password, registeredOwner[0].password)){
            const userJWT = {
                userID: registeredOwner[0]._id ,
                email : registeredOwner[0].email, 
                role: registeredOwner[0].role,
                properties: registeredOwner[0].properties
            }
            const token = jwt.sign(userJWT, secretAccess,{
                expiresIn : '1h'
            })
            const accessToken = { accessToken : token}
            console.log(accessToken)
            res.send(accessToken)
        }
        else{
            console.log(errorData)   
            res.send(errorData)
        }   
    }

    
}

const redirectFilters = (req,res,next)=>{
    console.log(req.body)
    const filtersBody = {
        checkIn : req.body.checkIn,
        checkOut : req.body.checkOut,
        location : req.body.location,
        area : req.body.area,
        capacity : req.body.capacity,
        smoking : req.body.smoking,
        publicTransport : req.body.publicTransport 
    }
    
    res.send(filtersBody)
}






module.exports = {signIn, logIn, redirectFilters, multerConfig, addProperty, getProperties}