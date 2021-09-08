const mongoose = require('mongoose')
const { Schema } = mongoose;

const votesSchema = new Schema({
  votes: {
    type: Number,
    required: true,
  },
  team_id: {
    type: String,
    required: true,
  }
});

const Vote = mongoose.model('vote', votesSchema);
module.exports = Vote;