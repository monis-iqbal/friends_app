import React,{useEffect,useState}from 'react'
import { getDownloadURL,ref, uploadBytes } from "firebase/storage"
import { storage,auth,imagesRef,collection,
    query,
    where,
    getDocs,
    onAuthStateChanged,} from './FirebaseApp'
const DownloadImage = () => {
    const [imgURL, setImgURL] = useState('')
    console.log(imgURL)
    useEffect(() => {
        let currUser;
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            
            console.log(user.uid);
            
            console.log(currUser)
          } else {
            // User is signed out
            // ...
            console.log("no user has logged in")
          }
        });
        currUser=localStorage.getItem('loginUseruid')
        console.log(currUser)
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
                // const newImage =localStorage.setItem('profileimage',url)
                setImgURL(url)  
            })
            .catch((error) => {
                // Handle any errors
                console.log(error)
            });

    }, [])
    console.log(imgURL)
    return (
        <div>
            <img src={imgURL} style={{width:'200px'}}></img>
        </div>
    )
}
export default DownloadImage
