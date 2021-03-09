var https = require('https');
var fs = require('fs'); // Using the filesystem module
var Datastore = require('nedb');
var db = new Datastore({filename: 'database.json',autoload: true});
var port = 8443;

var credentials = {
  key: fs.readFileSync('itp_key_cert/star_itp_io.key'),
  cert: fs.readFileSync('itp_key_cert/star_itp_io.pem')
};

// Start Normal Express Code
var express = require('express');
var bodyParser = require('body-parser');
// Require cookie-parser
//var cookieParser = require('cookie-parser');

//Require session
var session = require('express-session');
var nedbstore = require('nedb-session-store')(session);

const uuid = require('uuid');

var bcrypt = require('bcrypt-nodejs');

var app = express();
app.use(express.static("public"));

// encoded body to the url
// extended character set
var urlEncoder = bodyParser.urlencoded({extended: true});
app.use(urlEncoder);

//for cookies
//app.use(cookieParser());

//for session
app.use( session(
	    {
		    secret: 'secret',
		    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000 /*e.g. 1 year*/},
			        store: new nedbstore({filename: 'sessions.db'})
    	}
	)
);

//generate hash for password
function generateHash(password) {
	return bcrypt.hashSync(password);
}
//detect if it is the same password
function compareHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}

app.get('/', function(req, res) {

    console.log(req.session.username);

    if(!req.session.username){
        res.redirect('/login.html');
    } else {
        //Give them the main page 
        res.redirect('/drawing.html');
    }
    /*
    //session test
    if(!req.session.userid){
        req.session.userid = uuid.v1();
    }

    res.send('session user-id:' + req.session.userid);
    */

    /*
    //cookies test
    // log cookies on the server side
    console.log(req.cookies);

    var visits = 1;

    // if there are a "visits" cookie set, increse visit value by 1
    if(req.cookies.visits){
        visits = Number(req.cookies.visits)+1;
    }

    //set new updated cookie
    res.cookie('visits',visits,{});

    //send the info to the user
    res.send("You have visited this site " + visits + " times.");
    */
});

//use post to not showing data in the query string
app.post('/register', function(req, res) {
	// We want to "hash" the password so that it isn't stored in clear text in the database
    // encrypt the password in the database
	var passwordHash = generateHash(req.body.password);

	// The information we want to store
	var registration = {
		"username": req.body.username,
		"password": passwordHash
	};

	// Insert into the database
	db.insert(registration);
	console.log("inserted " + registration);
	
	// Give the user an option of what to do next
	res.redirect('/login.html');
	
});

// Post from login page
app.post('/login', function(req, res) {

	// Check username and password in database
	db.findOne({"username": req.body.username},function(err, doc) {
	    if (doc != null) {
            // Found user, check password				
			if (compareHash(req.body.password, doc.password)) {				
				// Set the session variable
				req.session.username = doc.username;

				// Put some other data in there
				req.session.lastlogin = Date.now();

				res.redirect('/');
					
			} else {

				res.send("Invalid Try again");

			}
		} 
	});
});

app.get('/logout', function(req, res) {
	delete req.session.username;
	res.redirect('/');
});

var httpsServer = https.createServer(credentials, app);

// Default HTTPS Port
httpsServer.listen(port,function(){
    console.log('Server is running on port: ',port);
});