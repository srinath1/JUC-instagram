import React,{useState,useContext} from 'react'
import { Link ,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import { userContext } from '../../App'



const Signin = () => {
  const{state,dispatch}=useContext(userContext)
  const[password,setPassword]=useState("")
  const [email,setEmail]=useState("")
  const history=useHistory()
  
  const postData=()=>{
    
    fetch("/signin",{
      method:"post",
      headers:{
        'Content-Type':"application/json"
      },
      body:JSON.stringify({
        password,
        email 
      })
    }).then(res=>res.json())
    .then(data=>{
      console.log(data)
      if(data.error){
        M.toast({html:data.error,classes:"#f44336 red"})
      }else{
        M.toast({html:"Signed up successfully",classes:"#1565c0 blue darken-3"})
                 localStorage.setItem("jwt",data.token)
               localStorage.setItem("user",JSON.stringify(data.user))
               dispatch({type:"USER",payload:data.user})

         history.push('/')


      }
    }).catch(err=>console.log(err))
  }
  
    return (
      <div className='mycard'>
        <div className="card  auth-card">
        <h2>MYJUC Instagram</h2>
        <input
      type='text'
      placeholder='Enter Your Email'
      value={email}
        onChange={e=>setEmail(e.target.value)}
      />

      <input type="password"
      placeholder='Enter Password'
      value={password}
        onChange={e=>setPassword(e.target.value)}
      />
        <button className="btn waves-effect waves-light "  onClick={()=>postData()} >Login     
    </button>
    <h6 ><Link to="/signup">Dont Have an account ?</Link></h6>
    <h6 style={{textAlign:"end"}} ><Link to="/reset" ><span style={{color:"red"}}>Reset Password ?</span></Link></h6>


  
           
          </div>
          
        
      </div>
    )
  
}

export default Signin