const express = require('express')
const router = express.Router()
const controls = require('../controller/controls')

/*
The required routes for the cooworking app are:
FRONTEND ROUTES:
        1. To signup: No http request needed
        2. To Login: No http request needed
        3. To Owners Settings: No http request needed
BACKEND ROUTES:
    COOWORKER LOGIC:
        1. Sign Up Route 
            -> POST Request (Post a user into the DB)
            -> Redirects to HomePage
            -> Applies to the Owner as well...
*/

router.post('/signIn', controls.signIn)

/*
        2. Login Route 
            -> POST Request (Sends Token if authenthicated within DB)
            -> Redirects to HomePage
            -> Applies to the Owner as well...
*/

router.post('/logIn', controls.logIn)//, controls.redirectLogIn)
/*
        3. Search Route 
            -> This route receives post requests. 
            -> Redirects to the properties page & send filter encoded into the url without posting it into DB.
            -> Front End uses url data to filter according filter from the last page.*/

router.post('/filters', controls.redirectFilters)

/*        4. Make reservarion Route
            -> Authentication required
                -> IF NOT THEN REDIRECT TO CREDENTIALS PAGE
                -> THEN REDIRECTED TO LOGIN PAGE
            -> Redirects to property details and booking
*/
router.post('/reservation')

/*    
            OWNER LOGIC:
        1. Add Property Route
            -> POST Request (Auth required for owner)    
                -> IF NOT THEN REDIRECT TO CREDENTIALS PAGE
                -> THEN REDIRECTED TO LOGIN PAGE
*/

// Multer configuration
const upload = controls.multerConfig()
router.post('/addProperty', upload.single('images'), controls.addProperty)
router.get('/getProperties', controls.getProperties)

/*
        2. Update Property
            -> UPDATE Request (Auth required for owner)    
                -> IF NOT THEN REDIRECT TO CREDENTIALS PAGE
                -> THEN REDIRECTED TO LOGIN PAGE
*/              
router.put('/updateProperty')

module.exports = router

