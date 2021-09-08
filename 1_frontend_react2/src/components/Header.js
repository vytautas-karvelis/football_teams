import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import './Header.css'
const Header = () => {
    //Hooks
    // -- state
    const { state, dispatch } = useContext(UserContext)

    useEffect(()=>{
        if(localStorage.getItem('team')){
         dispatch({type: "LOGIN", payload:localStorage.getItem('team')})
        console.log('user found')
     } else {
         console.log('user not found');        
        }
     }, [])

    return (
        <header>
            <div className="container">              
                <nav>
                <ul>
                    <li><Link to='/'>Admin Page</Link></li>
                    {state.team ? (
                        <li><Link to='/my-account'>Teams Account</Link></li>
                    ) :
                    ( 
                        <li><Link to='/'>Login</Link></li>
                    )}
                </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
