import React,{useContext,useState,useRef,useEffect} from 'react'
import "../App.css"
import { Link ,useHistory} from 'react-router-dom'
import { userContext } from '../App'
import M, { Modal } from 'materialize-css'

const NavBar = () => {
  const {state,dispatch}=useContext(userContext)
  const[search,setSearch]=useState("")
  const[userDetails,setUserDetails]=useState([])
  const history=useHistory( )
  const searchModal=useRef(null)
  useEffect(()=>{
    M.Modal.init(searchModal.current)

  },[])
  const renderList=()=>{
    if(state){
      return[
        <li key="5" i className='large material-icons modal-trigger' data-target="modal1" style={{color:'black',paddingTop:"20px",marginRight:"5px",cursor:"pointer"}}>search</li>,
        <li key="1"><Link to="/profile">Profile</Link></li>,
        <li key="2"><Link to="/create">Create Post</Link></li>,
        <li key="4"><Link to="/myfollowingspost">My Following User Post</Link></li>,

        <li key="3">
                <button className="btn #d32f2f red darken-2 "  onClick={()=>{
                  localStorage.clear()
                  dispatch({type:"CLEAR"})
                  history.push('/signup')
                }} >Logout</button>    

      </li>

      ]
    }else{
    return [
      <li key="1"><Link to="/signin">Signin</Link></li>,
      <li key="2"><Link to="/signup">Signup</Link></li>,
      
     ]
    }
  }
  const fetchUsers=(query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:'post',
      headers:{
        "Content-Type":'application/json',

      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      console.log(results)
      setUserDetails(results.user)
    })
  }
  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to={state ? "/":"/signin"} className="brand-logo left">MYJUC Instagram</Link>
      <ul id="nav-mobile" className="right ">
      {renderList()}
       
        

      </ul>
    </div>
  
    <div id="modal1" className="modal" ref={searchModal} style={{color:'black'}}>
    <div className="modal-content">
    <input
            type="text"
            placeholder="Serach Users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
    {userDetails.map(item=>{
      return <Link to={'/profile/'+item._id} onClick={()=>{
        setSearch("")
        M.Modal.getInstance(searchModal.current).close()
        window.open(item._id !== state._id ? "/profile/"+item._id : "/profile", "_self");      }}> <li key={item._id} className='collection-item'>{item.name}</li></Link> 
    })}
    </ul>
    </div>
    <div className="modal-footer">
      <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>{
        setSearch("")
        setUserDetails([])
      }}>Close</button>
    </div>
  </div>
  </nav>
  )
}

export default NavBar