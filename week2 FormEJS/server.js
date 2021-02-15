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

// data array
var submittedData = [];

app.get("/", function(req , res){
    res.send('Hello World!');
});

app.post("/formData", function(req,res){
   
    // collect data in a JSON format
   var data = {
       text : req.body.text,
       bd : req.body.bd,
       col : req.body.col
   };
   //push data to an array
   submittedData.push(data);
   console.log(submittedData);

   //wrapping the data and send it to EJS
   var dataWrapper = {data: submittedData};

   /*
   //crete an html to output the data
   var output = "<html><body>";
   output += "<h3> Data</h3>"
   for(let i =0; i<submittedData.length; i++){
       output += "<div class ='output'>" + submittedData[i].text + "</div>"
   }

   output += "</body></html>";
   res.send(output);
   */

   //render using EJS
   res.render('outputTemplate.ejs',dataWrapper);

   //simple post response 
    //console.log(req.body.data);
    //res.send('Got your data  '+req.body.data);

    //for get request
    //console.log(req.query.data);
    //res.send('Got your data'+req.query.data);

});

app.listen(port, function(){
    console.log('Server is running on port: ',port);
  });
  

