import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import image from '../assets/images/img1.jpg'
import "./TeamCard.css"

const TeamCard = ({team, teamVote, setTeamVote}) => {

    const [score, setScore] = useState(0)
    const allowUpdate = useRef(false)

    const loadScore = () => {         
       
        axios.get('http://localhost:5000/api/votes/'+ team._id)
            .then(response=> {
                if(response.data[0]){                  
                    setScore(response.data[0].votes)
                }    
            })       
    }

    const updateVote = async() => {
        console.log('teamVote in updateVote', teamVote)
        let response = await axios.put('http://localhost:5000/api/teams/voted/' + localStorage.getItem('team'), teamVote)
        
    }   

    const increaseScore = async () =>{
       
        if(
            (
            (teamVote.vote_submitted === false) ||
            (team.name === teamVote.team_name && teamVote.direction === -1 ) ||
            (teamVote.direction ===0)   
            ) && (score >=0)
        )
        {
            const response = await axios.get('http://localhost:5000/api/votes/add/'+ team._id)

            setScore(response.data.body)      
            setTeamVote({team_name:team.name, direction:teamVote.direction+1, vote_submitted:true})                            
            console.log('increase score fires')
            allowUpdate.current  = true
        }

         
    }
    const decreaseScore = () => {
      
        if( (
            (teamVote.vote_submitted === false) ||
            (team.name === teamVote.team_name && teamVote.direction === 1 ) ||
            (teamVote.direction ===0)   
            ) && (score >0)
        )

        axios.get('http://localhost:5000/api/votes/subtract/'+ team._id)
        .then(response=> {
            setScore(response.data.body)     
            setTeamVote({team_name:team.name, direction:teamVote.direction-1, vote_submitted:true})   
            console.log('decrease score fires')
            allowUpdate.current  = true

        })
    }

    

    useEffect(()=>{
        loadScore()
    }, [])    

    useEffect(()=>{

        if(allowUpdate.current){
            updateVote()
            console.log('vote useffect fires', teamVote)
            allowUpdate.current = false
        }
        
    }, [teamVote])

    return (
        <div className="teamCard">
            <img src={image} alt=''/>            
            <div className="teamName">Team name: {team.name}</div>
            <div className="buttons">
                <div onClick={()=>increaseScore()}>+</div>
                <div>Score: {score}</div>
                <div onClick={()=>decreaseScore()}>-</div>
            </div>
        </div>
    )
}

export default TeamCard
