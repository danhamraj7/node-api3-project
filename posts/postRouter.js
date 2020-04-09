const express = require("express");

const postDb = require("./postDb");

const router = express.Router();

//get all posts
router.get("/", (req, res) => {
  postDb
    .get()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Error getting posts",
      });
    });
});

//get a particular post by id
router.get("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  postDb
    .getById(id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Error invaild post ID",
      });
    });
});

//Destroy a post

router.delete("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  postDb
    .remove(id)
    .then((post) => {
      res.status(200).json({
        message: `${post} post has been removed`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Error deleting post",
      });
    });
});

//update a particular post
router.put("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  postDb
    .update(id, changes)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Error updating post",
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  postDb.getById(req.params.id).then((post) => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ Message: "Invalid post ID" });
    }
  });
}

module.exports = router;
