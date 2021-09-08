import React, {useState, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import {UserContext} from './../App'
import styles from './AdminScreen.module.css'


const AdminScreen = () => {

  const {dispatch} = useContext(UserContext)
  
  const [loginName, setLoginName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginErrorMessage, setLoginErrorMessage] = useState('')

  const [signupName, setSignupName] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [signupErrorMessage, setSignupErrorMessage] = useState('')

  const history = useHistory()

  const inputRef = useRef()
  const signupPasswordInputRef = useRef()
  const signupEmailInputRef = useRef()


  // Login user
  const loginTeam = (e) => {
    e.preventDefault()
    

    axios.post('http://localhost:5000/api/team/login', {
        name:loginName,
        password:loginPassword
    })
        .then(response=>{
            const teamId = response.data.teamId 
            console.log(response)
            localStorage.setItem('team', teamId)
            dispatch({type: "LOGIN", payload: teamId})
            history.push('/my-account')
        })
        .catch(err=>{
            setLoginName('')
            setLoginPassword('')
            setLoginErrorMessage(err.response.data.message)
            inputRef.current.focus()
        })
    }

    // Signup user
    const signupTeam = (e) => {
      e.preventDefault()

      if(signupPassword !== signupConfirmPassword){
          setSignupErrorMessage("Passwords do not match")

          setSignupPassword('')
          setSignupConfirmPassword('')

          signupPasswordInputRef.current.focus()
          return
      }

      axios.post("http://localhost:5000/api/team/signup", {
          name: signupName,         
          password:signupPassword
      })
      .then(response=>{
          if(response.data.registrationStatus === 'failed'){
              setSignupErrorMessage(response.data.message)              
              setSignupPassword("")
              setSignupConfirmPassword('')
             
          } else if (response.data.registrationStatus ==='success'){
              localStorage.setItem('team', response.data.teamId)
              dispatch({type:"REGISTER", payload:response.data.teamId})

              history.push('/my-account')
          }
      })
      .catch(err=>console.log(err))

  }

    return (
        <main>
        <div className={styles.container}>
        <section><h1 className="headline">Sign up/ Log In</h1></section>

        <div className="login-signup-container">
          <section id="login">
            <h2><span>Have a football Team account?</span> Log In Here</h2>

            <form id="logInForm" className="form" onSubmit={loginTeam}>
              <div className="form-control">
                <label className={styles['form-label']} htmlFor="loginName">Team name</label>
                <input
                  className="form-input"
                  type="text"
                  value={loginName}
                  onChange={(e)=>setLoginName(e.target.value)}
                  required
                  ref = {inputRef}
                />
              </div>

              <div className="form-control">
                <label className={styles['form-label']} htmlFor="loginPassword">Password</label>
                <input
                  className="form-input"
                  type="password"
                  value={loginPassword}
                  onChange={(e)=>setLoginPassword(e.target.value)}                  
                  required
                />
              </div>

              <div className="form-control">
                <input
                  type="submit"
                  value="Log In"
                  className="btn-primary btn-primary-submit"
                />
              </div>
            </form>
            <p
              id="loginMessage"
              className="hidden form-message form-message-danger"
            >{loginErrorMessage}</p>
          </section>

          <section id="signup">
            <h2><span>New football team?</span> Sign Up Here</h2>

            <form id="signUpForm" className="form" onSubmit={signupTeam}>
              <div className="form-control">
                <label className={styles['form-label']} htmlFor="signUpName">Name</label>
                <input
                  className="form-input"
                  type="text"                  
                  required
                  value = {signupName}
                  onChange={(e)=>setSignupName(e.target.value)}
                />
              </div>  

              <div className="form-control">
                <label className={styles['form-label']} htmlFor="signUpPassword">Password</label>
                <input
                  className="form-input"
                  type="password"
                  value = {signupPassword}
                  onChange={(e)=>setSignupPassword(e.target.value)}
                  required
                  ref={signupPasswordInputRef}
                />
              </div>

              <div className="form-control">
                <label className={styles['form-label']} htmlFor="signUpConfirmPassword"
                  >Confirm Password</label
                >
                <input
                  className="form-input"
                  type="password"
                  value = {signupConfirmPassword}
                  onChange={(e)=>setSignupConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <input
                  type="submit"
                  value="Sign Up"
                  className="btn-primary btn-primary-submit"
                />
              </div>
            </form>
            <p
              id="signUpMessage"
              className="form-message form-message-danger"
            >{signupErrorMessage}</p>
          </section>
        </div>
      </div>
        </main>
    )
}

export default AdminScreen
