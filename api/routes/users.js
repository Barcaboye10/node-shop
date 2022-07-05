const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      //   if (user) {
      /**
       * if the email is not found, it won't be null,
       * but an empty array. Thus, we need to use it
       * like sio
       */
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email already exists",
        });
      } else {
        // const user = new User({
        //   _id: new mongoose.Types.ObjectId(),
        //   email: req.body.email,
        // password: req.body.password
        // )}
        /**
         * If we add password in DB in above manner,
         * even in https connection we will still store
         * raw password in the database and any employee
         * having access to DB will get the password, so
         * we need to hash/encrypt it.
         * We have node.bcrypt.js library for it.
         * https://github.com/kelektiv/node.bcrypt.js
         */
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(200).json({
                  message: "User Created",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "User Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
