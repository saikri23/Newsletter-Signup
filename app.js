const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));//To access the static pages like local files

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    var first_name = req.body.fname;
    var second_name=req.body.sname;
    var email = req.body.email;
    
    var data={
        members:[
        {
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:first_name,
                LNAME:second_name
            }
        }
    ]
    };
    const json_data=JSON.stringify(data);

    const url="https://us13.api.mailchimp.com/3.0/lists/c4565499d3";

    
    const options ={
        method :"POST",
        auth : "saikri:"+process.env.MAILAPI_KEY
    }

    const request = https.request(url,options,function(response){//store in to request to post the json datato Mailchip
        response.on("data",function(data){
            console.log(JSON.parse(data));
            if(response.statusCode==200)
            {
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
        })
    })
    request.write(json_data);
    request.end();
    
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port 3000");
});



