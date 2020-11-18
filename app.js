

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const  app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

// *******************************    REQUESTS TARGETING ALL ARTICLES     ****************************

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if(err) {
                res.send(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if(err) {
                res.send(err);
            } else {
                res.send("Successfully added a new article.");
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if(err) {
                res.send(err);
            } else {
                res.send("Successfully deleted all the articles");
            }
        });
    });

// *******************************    REQUESTS TARGETING A SPECIFIC ARTICLE     ****************************

app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article matching that title was found.");
            }
        });
    })
    .put((req, res) => {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err) => {
                if(!err) {
                    res.send("Successfully updated the article.");
                }
            }
        );
    })
    .patch((req, res) => {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if(!err) {
                    res.send("Successfully updated the article.");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if(!err) {
                    res.send("Successfully deleted the article.");
                } else {
                    res.send(err);
                }
            }
        );
    });

app.listen(3000, () => {
    console.log("Server is running on Port 3000");
});