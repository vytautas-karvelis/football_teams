const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const Team = require('./models/teams')
const Vote = require('./models/votes')

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then((response) => {
    console.log(`Connected to MongoDB`);
    // Starting server
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}...`)
    );
  });

// Routes
app.get('/', (req, res) => res.send('API is running...'));

// GET: all cars
app.post('/api/team/signup', async (req, res) => {
  let team = req.body;
  team.voted = {
    team_name: null,
    direction: null,
    vote_submitted:false
  }
  console.log(team)
  Team.find().then((result) => {
    const teamExists = result.some(
      (teamFromDB) => teamFromDB.name === team.name
    );

    if (teamExists) {
      res.json({
        registrationStatus: 'failed',
        message: 'Team with given name already exists',
      });
    } else {
      
      const newTeam = new Team(team);
      console.log(newTeam)

      // create vote for team
      const vote = {
        votes: 0,
        team_id : newTeam._id.toString()
      }

      const newVote = new Vote(vote)
      newVote.save()
      
      newTeam.save().then((result) => {
        let { _id } = result;
        res.json({
          registrationStatus: 'success',
          teamId: _id,
        });
      });
    }
  });
});

app.post('/api/team/login', (req, res) => {
  let team = req.body;

  Team.find().then((result) => {
    let teamFound = result.find(
      (teamFromDB) =>
        teamFromDB.name === team.name && teamFromDB.password === team.password
    );

    if (teamFound) {
      let { _id } = teamFound;

      res.json({
        loginStatus: 'success',
        teamId: _id,
      });
    } else {
      res.status(401).json({
        loginStatus: 'failed',
        message: 'Given email or password is incorrect',
      });
    }
  });
});

// Teams API
app.get('/api/teams', (req, res)=>{
  Team.find({}).then((result) => {
      res.json({
        teams:result
      })
  })
})

app.get('/api/teams/:id', (req, res)=>{
  let teamId = req.params.id;

  Team.findById(teamId).then((result) => {
    res.json(result);
  });
})

// Update team votes

app.put("/api/teams/voted/:id", (req, res)=>{
  
  console.log(req.body)
  console.log(req.params.id)
  Team.findByIdAndUpdate(req.params.id, {$set:{voted:req.body}}, {new:true}, (err, doc)=>{
   console.log('fires')
    if(err){
     console.log({body:"an error occured while updating"})
    }

  console.log('doc', doc)
 })
 res.send()
})



// Votes API

app.get('/api/votes/:id', (req, res)=>{
  Vote.find({team_id:req.params.id}).then((result) => {
      res.json(result)
  })
})


app.get('/api/votes/add/:id', async (req, res)=>{

 let vote = await Vote.find({team_id:req.params.id})
 let newVotes = vote[0].votes + 1
 console.log(newVotes);


 Vote.findOneAndUpdate({team_id:req.params.id}, {$set:{votes:newVotes}}, {new:true}, (err, doc)=>{
    if(err){
     res.json({body:"an error occured while updating"})
    }

    res.json({body:doc.votes})
 })
 
})


app.get('/api/votes/subtract/:id', async (req, res)=>{

  let vote = await Vote.find({team_id:req.params.id})
  let newVotes = vote[0].votes - 1
  console.log(newVotes);
 
 
  Vote.findOneAndUpdate({team_id:req.params.id}, {$set:{votes:newVotes}}, {new:true}, (err, doc)=>{
     if(err){
      res.json({body:"an error occured while updating"})
     }
 
     res.json({body:doc.votes})
  })
})

