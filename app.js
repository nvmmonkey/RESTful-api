// IMPORT ////
const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const ejs = require("ejs");

// SETUP ////
mongoose.set("strictQuery",false)
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true}, ()=>{
    console.log("Connected to MongoDB ")
})
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Schema Setup ///
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)


//////////////////////////////////Request Targeting All Articles///////////////////////////////////

// API Route ///
app.route("/articles")

.get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles)
        } else {
            res.send(err)
        }
    })
})

.post(function(req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if (!err) {
            res.send("Successfully added a new article!")
        } else {
            res.send(err)
        }
    })
})

.delete(function(req, res){
    Article.deleteMany({}, function(err){
        if(!err){
            res.send("Successfully deleted all articles!")
        } else {
            res.send(err)
        }
    })
})


// API Get ///
// app.get("/articles", function(req, res) {
//     Article.find({}, function(err, foundArticles) {
//         if (!err) {
//             res.send(foundArticles)
//         } else {
//             res.send(err)
//         }
//     })
// })

// API Post ///
// app.post("/articles", function(req, res) {
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     })
//     newArticle.save(function(err){
//         if (!err) {
//             res.send("Successfully added a new article!")
//         } else {
//             res.send(err)
//         }
//     })
// })

// API Delete ///
// app.delete("/articles", function(req, res){
//     Article.deleteMany({}, function(err){
//         if(!err){
//             res.send("Successfully deleted all articles!")
//         } else {
//             res.send(err)
//         }
//     })
// })


//////////////////////////////////Request Targeting A Specific Articles///////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){
    req.params.articleTitle
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No articles matching that title was found!")
        }
    })
})

.put(function(req, res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully Update article!")
            }else{
                res.send(err)
            }
        }
    )
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully update selected article!")
            }else{
                res.send(err)
            }
        }
    )
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully delete selected article!")
            }else{
                res.send(err)
            }
        }
    )
})


// LISTEN ////
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
