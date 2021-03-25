var https = require('https');
var fs = require('fs');
var Datastore = require('nedb');
var db = new Datastore({ filename: 'database.json', autoload: true });

// credential for https
var credentials = {
    key: fs.readFileSync('itp_key_cert/star_itp_io.key'),
    cert: fs.readFileSync('itp_key_cert/star_itp_io.pem')
};

//start express
var express = require('express');
var app = express();
var port = 8443;

var count = 1;

var cors = require('cors');
app.use(cors());
app.use(express.static("public"));
//tell the express app to use EJS
app.set('view engine', 'ejs');

//for post request
var bodyParser = require('body-parser');
var jsonBodyParser = bodyParser.json({ limit: "1000kb" });
app.use(jsonBodyParser);

app.get('/', function(req, res) {
    //find max count in database
});

app.post('/canvas', function(req, res) {
    // console.log(req.body);
    var img = req.body.canvas;

    // Saving a img URL (server side)
    var searchFor = "data:image/png;base64,";
    var strippedImage = img.slice(img.indexOf(searchFor) + searchFor.length);
    var binaryImage = new Buffer(strippedImage, 'base64');
    fs.writeFileSync(__dirname + '/public/img/image' + count + '.png', binaryImage);

    // collect data in a JSON format
    var data = {
        img: 'image' + count + '.png',
        age: req.body.age,
        religion: req.body.religion,
        nationality: req.body.nationality,
        gender: req.body.gender,
        count: count,
    };
    // console.log(data);

    db.insert(data, function(err, newDocs) {
        console.log(newDocs);
        count += 1;
        console.log(count);
    });
});

app.get('/collection', function(req, res) {
    var searchInput = {};
    // searchInput.minAge = req.query.minAge;
    // searchInput.maxAge = req.query.maxAge;

    // searchInput.age = "{$and: [{$gte: " + req.query.minAge + "}, {$lte: " + req.query.maxAge + "}]}";

    // db.find({ "humans.genders": { $gt: 5 } }, function (err, docs) {
    //   // docs contains Omicron Persei 8, whose humans have more than 5 genders (7).
    // });

    // db.find({ $or: [{ planet: 'Earth' }, { planet: 'Mars' }] }, function (err, docs) {
    //   // docs contains Earth and Mars
    //});

    if (typeof req.query.religion != "undefined") {
        searchInput.religion = req.query.religion;
    }
    if (typeof req.query.nationality != "undefined") {
        searchInput.nationality = req.query.nationality;
    }
    if (typeof req.query.gender != "undefined") {
        searchInput.gender = req.query.gender;
    }
    /*var searchInput = {
      minAge: req.query.minAge,
      maxAge: req.query.maxAge,
      religion: req.query.religion,
      nationality: req.query.nationality,
      gender: req.query.gender
    };*/
    console.log(searchInput);

    db.find(searchInput, function(err, docs) {
        var dataWrapper = { data: docs };
        console.log(dataWrapper);
        res.render('output.ejs', dataWrapper);
    });

});


//running the server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, function() {
    console.log('Server is running on port: ', port);
});