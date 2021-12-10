import React from "react";
import { auth, signOut } from "./FirebaseApp";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { } from './FirebaseApp'
import {
  collection,
  storage,
  query,
  where,
  getDocs,
  onAuthStateChanged,
  db,
  setData,
} from "./FirebaseApp";
import "./pages.css";
import { setUser } from "./SignInPage";
import Search from "./componenets/Search";
const HomeStart = () => {
  const [image, setimage] = useState();
  let navigate = useNavigate();
  let LoggedinUser = setUser();
  let imageURL;
  localStorage.setItem('user', JSON.stringify(setUser()));
  let data = JSON.parse(localStorage.getItem('user'));
  console.log(data);
  console.log(LoggedinUser);
  const onEditHandler = () => {
    navigate("/form");
  };
  const [myUsers, setMyUsers] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log("isLoggedin", user.email)

      // ...
    } else {
      // User is signed out
      // ...
      console.log("no user has logged in");
    }
  });

  let arr = [];
  let user = [];

  useEffect(async () => {
    let userData = collection(db, "userProfiles");
    console.log(userData);
    let currUser = LoggedinUser
    console.log(currUser)
    let q = query(userData, where("email", "==", data));
    user = await getDocs(q);
    console.log(user);
    user.forEach((doc) => {
      arr = doc.data();
      currUser = localStorage.getItem('loginUseruid')
      getDownloadURL(ref(storage, `images/${currUser}`))
        .then((url) => {
          // `url` is the download URL for 'images/stars.jpg'

          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();

          // Or inserted into an <img> element
          // const img = document.getElementById('myimg');
          // img.setAttribute('src', url);
          console.log(url)
          setimage(url);
          // localStorage.setItem('profileimage2',url)
        })
        .catch((error) => {
          // Handle any errors
          console.log(error)
        });
      // arr.push(doc.data());
      // console.log(arr);
    });
    setMyUsers(arr);
  }, []);
  console.log(myUsers);
  let fetchedpost;
  let arr2 = [];
  let newarr = [];
  const [allpost, setallPost] = useState([]);
  useEffect(async () => {
    let postData = collection(db, "Posts");
    console.log(postData);
    let q = query(postData, where("postedBy", "==", data));
    fetchedpost = await getDocs(q);
    console.log(fetchedpost);
    fetchedpost.forEach((doc) => {
      arr2 = doc.data();
      newarr.push(arr2);
      console.log(newarr);
    });
    setallPost(newarr);
  }, []);
  console.log(allpost);
  return (
    <div className="main">
      <div className="top-bar">
        <h1 className="header_name">Friends</h1>


        <div className="menu_bar">
          <Button id="edit-Profile" onClick={onEditHandler}>
            Settings
          </Button>
          <Search />
        </div>
      </div>
      <div className='intro-section'>
        <div id="intro">
          <div className="img_post">
            <img src={image} style={{ width: '200px', height: '180px', }} alt="Image is Here"></img>
          </div>
          <div>
            <div>
              <h2 className="sub-heading" ><b>&nbsp;&nbsp;&nbsp;&nbsp;Profile</b></h2>
            </div>

            <div></div>
            <div className="boxes">Email: {myUsers.email}</div>
            <div className="boxes">Date of Birth: {myUsers.dob}</div>
            <div className="boxes">Phone No: {myUsers.contactno}</div>
            <div className="boxes">About: {myUsers.about}</div>
          </div>
        </div>
      </div>
      <div className='post-section'>
        <div>
          <h2 className="create_post_heading">Create a Post</h2>
          <textarea placeholder="create a content to post" type="text" className="post_input_create"  />
          <button className="post_create_btn">Post</button>
          
        </div>
        <div>
          {allpost.map((data) => {
            return (
              <div> <div>Post Title: {data.title}</div>
                <div>Created By: {data.postedBy}</div>
                <div> Post content:{data.content}</div>

              </div>

            )
          })}
        </div>
      </div>
    </div>
  );
};
export default HomeStart;
