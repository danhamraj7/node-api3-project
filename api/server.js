const express = require("express");
const helmet = require("helmet");

const server = express();

//routers
const userRouter = require("../users/userRouter");
const postRouter = require("../posts/postRouter");

server.use(logger);
server.use(helmet());

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>
  <p>By Dan Hamraj</p`);
});

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log({
    method,
    originalUrl,
    timestamp: new Date().toLocaleString(),
  });
  next();
}

module.exports = server;
