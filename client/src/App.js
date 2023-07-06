import React ,{useEffect,createContext,useReducer,useContext}from 'react'
import NavBar from './components/NavBar'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signup from './components/screens/Signup'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import { initialState,reducer } from './reducers/userReducer'
import UserPofile from './components/screens/UserProfile'
import SubscribedUserPost from './components/screens/SubscibedUserPost'
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'
export const userContext=createContext()

const Routing=()=>{
  const history=useHistory()
  const {state,dispatch}=useContext(userContext)

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({type:"USER",payload:user})
     
    }else{
      if(!history.location.pathname.startsWith('/reset'))  history.push('/signin')
    }

  },[])
  return(
    <Switch>
      <Route exact path="/"><Home/></Route>
        <Route   path="/signin"><Signin/></Route>
        <Route path="/signup"><Signup/></Route>
        <Route  exact path="/profile"><Profile/></Route>
        <Route   path="/create"><CreatePost/></Route>
        <Route  exact path="/profile/:userid"><UserPofile/></Route>
        <Route  exact path="/myfollowingspost"><SubscribedUserPost/></Route>
        <Route  exact path="/reset"><Reset/></Route>
        <Route path="/reset/:token">
        <Newpassword />
      </Route>



    </Switch>
    
  )
}



const App = () => {
  const[state,dispatch]=useReducer(reducer,initialState)
  return (
    <userContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar/>
        <Routing/>      



    </BrowserRouter>
    </userContext.Provider>
  )
}

export default App