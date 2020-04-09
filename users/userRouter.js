const express = require("express");
const userDb = require("./userDb");
const posts = require("../posts/postDb");

const router = express.Router();

//add a user
router.post("/", validateUser, (req, res) => {
  // do your magic!
  userDb
    .insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "There was an error creating the post",
      });
    });
});

// post  to a user id
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const id = req.params.id;
  const newPost = req.body;
  const postWithId = { ...newPost, user_id: id };
  console.log(postWithId);
  posts
    .insert(postWithId)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        errorMessage: "Please provide text for the comment.",
      });
    });
});

//=================================================================

// get all users
router.get("/", (req, res) => {
  // do your magic!
  userDb
    .get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error retrieving users.",
      });
    });
});

//get a user by id
router.get("/:id", validateUserId, (req, res) => {
  userDb
    .getById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "Hub not found" });
      }
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the hub",
      });
    });
});

//fetch all posts from a single user
router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  userDb
    .getUserPosts(id)
    .then((posts) => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(400).json({ message: "no posts exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Error getting posts",
      });
    });
});

// Destroy a user
router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  userDb.remove(id).then((user) => {
    res.status(200).json({
      message: `${user} user has been removed`,
    });
  });
});

//update a user
router.put("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  userDb
    .update(id, changes)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "User could NOT be updated",
      });
    });
});

//custom middleware
//validateUserId
function validateUserId(req, res, next) {
  userDb.getById(req.params.id).then((user) => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ Message: "Invalid user ID" });
    }
  });
}

//validateUser
function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

//validatePost
function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
