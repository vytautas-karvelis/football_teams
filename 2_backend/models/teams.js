const mongoose = require('mongoose')
const { Schema } = mongoose;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  voted: {
      team_name:{
       type:String
      },
      direction: {
        type: Number
      },
      vote_submitted:{
        type:Boolean
      }
  },

  password: {
    type: String,
    required: true,
  }

});

const Team = mongoose.model('team', teamSchema);
module.exports= Team;
