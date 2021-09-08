import React,{ useReducer} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import AdminScreen from './screens/AdminScreen'
import ProtectedRoute from './protectedRoute'

import Header from './components/Header'

export const UserContext = React.createContext()

const initialState = { team: ''}

const reducer = (state, action) =>{
  switch(action.type){
    case "REGISTER":
      return {team:action.payload}
    case "LOGIN":
      return {team:action.payload}
    case "LOGOUT":
      return {team:''}
      default:
        return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="App">
          <UserContext.Provider value={{state, dispatch}}>
          <Router>
            <Header />
              <Switch>
                <Route exact path='/'
                component={AdminScreen}/>             
                <Route path='/my-account'
                component={ProtectedRoute} />
              </Switch>
          </Router>
        </UserContext.Provider>
    </div>
  );
}

export default App;
