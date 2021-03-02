var Datastore = require('nedb');
var db = new Datastore({filename: 'database.json',autoload: true});
var express = require('express');
var app = express();
//handling the post request
var bodyParser = require('body-parser');
var port = 8082;

// encoded body to the url
// extended character set
var urlEncoder = bodyParser.urlencoded({extended: true});
app.use(urlEncoder);

app.use(express.static("public"));

//tell the express app to use EJS
app.set('view engine','ejs');

app.get("/success", function(req,res){
    console.log(req.query.text);
    // collect data in a JSON format
   var data = {
       text : req.query.text
   };

   db.insert(data, function(err,newDoc){
       db.find({},function(err,docs){
        //res.send("Data Saved: " + newDoc);
        //render using EJS
        //res.render('response.ejs');
        res.send(docs);
       });
    });

});

app.listen(port, function(){
    console.log('Server is running on port: ',port);
  });
  

