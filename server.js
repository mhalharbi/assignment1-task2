const express = require ( 'express' )
var bodyParser = require('body-parser');
const path = require('path')
const multer = require('multer')  
const app = express () 

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json()); 
// set mongoDB connection
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://sit725:password!10@cluster0.k31mg.mongodb.net/<spotifydb>?retryWrites=true&w=majority"
const client = new MongoClient(uri, {useNewUrlParser: true });  
let songCollection; 

client.connect(err => { 
    songCollection = client.db("spotifydb").collection("songs"); // connect to mongodb
});

const insertSong = (song) => { // add song
    try {
        songCollection.insertOne({song:song});
     } catch (e) {
        console.log(e);
     }
}

app.get ( '/songs' , function ( req,res ) {
    songCollection.find().toArray(function(err, result) {
        res.send(result);
    });    
 })

 // configure multer to upload song
 const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
    }); 

 const upload = multer ({ storage: storage}).single('file');

 app.post('/upload_song', (req,res)=> { 
     console.log(req.body.filename)
     console.log(req.params)
     upload(req, res, (err) => {
         if(err){ console.log(err)}
         else{ 
        let song = { "artist_name":req.body.artist_name, "description":req.body.description, "filenamecar":req.file.filename } 
        insertSong(song)
        res.sendStatus(200); 
        }
    }); 
 }); 

// respond with "hello world" when a GET request is made to the homepage
app.get ( '/' , function ( req,res ) {    
    res.sendFile(path.join(__dirname, './public/index.html'))
})
// list to a particular port
app.listen (3000);
