var Datastore = require('nedb');
var db = new Datastore({filename: 'database.json',autoload: true});
var express = require('express');
var app = express();
//handling the post request
var bodyParser = require('body-parser');
var port = 8081;

// encoded body to the url
// extended character set
var urlEncoder = bodyParser.urlencoded({extended: true});
app.use(urlEncoder);

app.use(express.static("public"));

//tell the express app to use EJS
app.set('view engine','ejs');

app.get("/afterlife", function(req , res){
    db.find({},function(err,docs){
        //wrapping the data and send it to EJS
        var dataWrapper = {data: docs};
        console.log(dataWrapper);
    res.render('output.ejs',dataWrapper);
});

app.post("/success", function(req,res){
   
    // collect data in a JSON format
   var data = {
       text : req.body.text,
       bd : req.body.bd,
       col : req.body.col
   };

   db.insert(data, function(err,newDoc){
    //res.send("Data Saved: " + newDoc);
        //render using EJS
        res.render('response.ejs');
    });
   });



});

app.listen(port, function(){
    console.log('Server is running on port: ',port);
  });
  

