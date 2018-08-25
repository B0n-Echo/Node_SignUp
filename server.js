var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var app = express();

var MONGO_URL =
    "mongodb://admin:mikazaru1993@ds125372.mlab.com:25372/nikhilsdatabase";

app.get('/', function (req, res) {
    res.set({
        'Access-Control-Allow-Origin': '*' // allow any origin to get the resource
    });
    return res.redirect('/public/index.html');
}).listen(3000);

console.log("Server listening at : 3000");
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
var getHash = (pass, phone) => {

    var hmac = crypto.createHmac('sha512', phone);

    //passing the data to be hashed
    data = hmac.update(pass);
    //Creating the hmac in the required format
    gen_hmac = data.digest('hex');
    //Printing the output on the console
    console.log("hmac : " + gen_hmac);
    return gen_hmac;
}

// Sign-up function starts here. . .
app.post('/sign_up', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.password;
    var phone = req.body.phone;
    var password = getHash(pass, phone);


    var data = {
        "name": name,
        "email": email,
        "password": password,
        "phone": phone
    }

    mongo.connect(MONGO_URL, function (error, db) {

        // database variable is actually the parent object of the object you are trying to access
        const database = db.db("nikhilsdatabase");

        if (error) {
            throw error;
        }
        console.log("connected to database successfully");

        //CREATING A COLLECTION IN MONGODB USING NODE.JS
        database.collection("details").insertOne(data, (err, collection) => {
            if (err) throw err;
            console.log("Record inserted successfully");
            console.log(collection);
        });
    });

    console.log("DATA is " + JSON.stringify(data));
    res.set({
        'Access-Control-Allow-Origin': '*'
    });
    return res.redirect('/public/success.html');

});