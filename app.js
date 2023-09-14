const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article",articleSchema);

/* for all articles */

app.route("/articles")
  .get((req, res)=>{
    Article.find({}).then((foundArticles,err)=>{
      if (!err){res.send(foundArticles);}
      else {res.send(err);}
    })
  })

  .post((req, res)=>{
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save().then((err)=>{
      if (!err){res.send("Success add");}
      else {res.send(err);}
    });
  })

  .delete((req, res)=>{
    Article.deleteMany({}).then((err)=>{
      if (!err){res.send("Success delete");}
      else {res.send(err);}
    })
});


/* for specific articles */
app.route("/articles/:articleTitle")
  .get((req, res)=>{
    Article.findOne({title: req.params.articleTitle}).then((foundArticle, err)=>{
      if (foundArticle){
        res.send(foundArticle);
      } else {
        res.send("No found");
      }
    });
  })
  // updates all parts of the article
  .put((req, res)=>{
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true}
    ).then((err)=>{
      if (!err){res.send("success update");}
      else {res.send(err);}
    });
  })
  // only changes the part you want to change
  .patch((req, res)=>{
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {$set: req.body}  
      // req is a javascript object that provides key value pairs of what you want to update.
      // so no need for more dynamic codes in $set
    ).then((err)=>{
      if (!err){res.send("success update");}
      else {res.send(err);}
    });
  })
  .delete((req, res)=>{
    Article.findOneAndDelete(
      {title: req.params.articleTitle},
    ).then((err)=>{
      if (!err){res.send("success delete");}
      else {res.send(err);}
    });
  })



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

/* [
  {
    "_id": "646ad65f296dbd536c332ba5",
    "title": "REST",
    "content": "REST is short for REpresentational State Transfer. It's an architectural style for designing APIs."
},
{
    "_id": "646ad6c4296dbd536c332ba6",
    "title": "API",
    "content": "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
},
{
    "_id": "646ad6d3296dbd536c332ba7",
    "title": "Bootstrap",
    "content": "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
},
{
    "_id": "646ad6de296dbd536c332ba8",
    "title": "DOM",
    "content": "The Document Object Model is like an API for interacting with our HTML"
},
{
    "_id": "646add2f8900319b81487b93",
    "title": "Ooooo",
    "content": "Adfsffdafsaadfsfs",
    "__v": 0
},
{
    "_id": "646adda7f535bd62252e10b8",
    "title": "AAAAA",
    "content": "nmnmnmnmnmnmnm",
    "__v": 0
}
] */