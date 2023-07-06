import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(userContext);
  console.log("Data", data);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.posts);
      });
  }, []);

  const likePost = (postId) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Result", result);
        console.log("Data", data);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log("New Data", newData);
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const unlikePost = (postId) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Result", result);
        console.log("Data", data);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log("New Data", newData);
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.map((item) => {
        if (item._id === result._id) {
          return result;
        } else {
          return item;
        }
      });
      console.log("New Data", newData);
      setData(newData);

    }).catch(err=>console.log(err))
  };

  const deletePost=(postId)=>{
    fetch(`/deletepost/${postId}`,{
      method:"delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      

    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      const newData=data.filter(item=>{
        return item._id !==result._id
      })
      setData(newData)
      
      
    })

    
  }
  console.log('Data-->',data)
  console.log('User Id--->',state)
  return (
    <div className="home">
      <div className="card home-card ">
        {data &&
          data.map((item) => {
            return (
              <>
              <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> {item.postedBy._id == state._id 
                            && <i className="material-icons" style={{
                                float:"right"
                            }} 
                            onClick={()=>deletePost(item._id)}
                            >delete</i>

                            }</h5>
                <div className="card-image">
                  <img className="item" src={item.photo} />
                </div>
                <div className="card-content">
                  <i className="material-icons" style={{ color: "grey" }}>
                    favorite
                  </i>
                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => unlikePost(item._id)}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => likePost(item._id)}
                    >
                      thumb_up
                    </i>
                  )}
                  <h6>{item && item.likes.length} likes</h6>
                  <h6>{item.title}</h6>
                  <p>{item.body}</p>
                  {item.comments.map(record=>{
                    return (
                      <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>

                    )
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, item._id);
                    }}
                  >
                    <input type="text" placeholder="add a comment" />
                  </form>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
