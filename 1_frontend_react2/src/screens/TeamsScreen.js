import React, { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import {UserContext} from './../App'
import TeamCard from '../components/TeamCard'
import './TeamsScreen.css'

const TeamsScreen = () => {

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()

    const [isLoading, setIisLoading] = useState(true)
    const [teams, setTeams] = useState([])
    const [teamVote, setTeamVote] = useState({})
    
    
    //Load all teams and setTeamVote
    const loadTeams = () => {
        axios.get('http://localhost:5000/api/teams')
            .then(response=> {
                console.log(response.data)
                setTeams(response.data.teams)
                setIisLoading(false)
            })
    
    }

    const loadVote = () => {
        axios.get('http://localhost:5000/api/teams/' + localStorage.getItem('team'))
        .then(response=>{
           setTeamVote(response.data.voted)
          
        })
    }

    const logoutHandler = () => {       
            localStorage.removeItem('team');
            dispatch({type: "LOGOUT"})
             history.push('/')          
    }

    //Load user vote
 
    useEffect(() => {
        loadTeams()
        loadVote()
       
    }, []) 

    return (
        <div className="container">
        <button onClick={(e)=>logoutHandler()}>Logout</button>
            <div className="teamsScreen">
            { isLoading ? (
                <p>Loading...</p>
            ) : (
                teams.map((team) =><TeamCard
                team={team}
                key={team._id}
                teamVote={teamVote}
                setTeamVote={setTeamVote} />)
            )}
            </div>
            <p>You last voted for {teamVote.team_name}</p>            
        </div>
      
    )
}

export default TeamsScreen
