const mongoose = require('mongoose');
const { Schema } = mongoose;
const shortid = require('shortid');
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

const userSchema = new Schema(
  {
    username: { type: String, lowercase: true, required: true, unique: true },
    _id: { type: String, default: shortid.generate }
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
