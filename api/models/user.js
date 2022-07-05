const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { 
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
},
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema)
/**
 * unique doesn't actually perform validation. It does
 * some kind of optimisation for searching, knowing we
 * will be having unique email in DB, thus, we still
 * need to check in user route if the email exists in
 * DB while user sign up.
 * match takes a RegEx, we can use it to validate that
 * what user entered was indeed an email.
 */