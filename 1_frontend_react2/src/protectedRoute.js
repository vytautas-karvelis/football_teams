import React , { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import TeamsScreen from './screens/TeamsScreen'

const ProtectedRoute = () => {

    //redirects
    const history = useHistory()

    useEffect(()=>{
       if(!localStorage.getItem('team')){
        history.push('/')
       }
    })

   return <TeamsScreen/>
  
}

export default ProtectedRoute
