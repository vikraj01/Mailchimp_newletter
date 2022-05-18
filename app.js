const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path=require('path');

const app = express();

//Bodyparser Middleware
app.use(bodyParser.urlencoded({extended:true}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req,res) => {
    const {firstName , lastName, email} = req.body;

    //Make sure fiels are filled
    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }

    // Construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data);



    const options = {
        url : 'https://us17.api.mailchimp.com/3.0/lists/f9f3d47efb',
        method: 'POST',
        headers :{
            Authorization : 'auth f50293911374d7fdf710bcda242c09ba-us17'
        },
        body : postData
    }

    request(options,(err, response, body) => {
        if(err){
            res.redirect('/fail.html');
        }else {
            if(response.statusCode === 200){
                res.redirect('/success.html');
            }else{
                res.redirect('/fail.html');  
            }
        }
    } );

});


const PORT = process.env.PORT || 5000 ; //Dynamic port
app.listen(PORT,console.log(`Server started pm ${PORT}`) );

// API key
// f50293911374d7fdf710bcda242c09ba-us17

// list id
// f9f3d47efb