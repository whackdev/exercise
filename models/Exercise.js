const mongoose = require('mongoose');
const { Schema } = mongoose;
const shortid = require('shortid');
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);
const moment = require('moment');

const exerciseSchema = new Schema(
  {
    username: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    userId: { type: String, required: true },
    _id: { type: String, default: shortid.generate },
    date: Date
  },
  { versionKey: false }
);

module.exports = mongoose.model('Exercise', exerciseSchema);