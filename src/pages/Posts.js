
import { auth, addDoc, db,collection,
  storage,
  query,
  where,
  doc,
  getDocs,
  storageRef,
  onAuthStateChanged,
  setDoc, } from "./FirebaseApp";
import React from "react";
import { Form,Form as AntForm, Upload,Input, InputNumber, Button } from 'antd';
import { getDownloadURL,ref, uploadBytes } from "firebase/storage"
import { UploadOutlined } from '@ant-design/icons';
import { useEffect,useState } from "react";
const Posts = () => {
  let post = {
    title:'',
    image:'',
    content:'',
    postedBy:'',
  }
  const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 12,
    },
  };
  let localPost=JSON.parse(localStorage.getItem('post'))
  console.log(localPost)
  const [form] = AntForm.useForm();
  const[image,setimage]=useState();
  const onFinish = (values) => {
    console.log(values);
    post.content=values.content;
    post.title=values.post;
    console.log(post);
    localStorage.setItem('post',JSON.stringify(post));
    addPosts();
    //For Image Upload
    const file = values.upload[0].originFileObj;
    console.log(file)
    // Points to 'images/space.jpg'
    // Note that you can use variables to create child values
    const fileName = post.title;
    console.log(fileName)
    const imagesRef = ref(storageRef, 'images');
    const spaceRef = ref(imagesRef, fileName);
    // File path is 'images/space.jpg'
    const path = spaceRef.fullPath;
    console.log(path)
    // File name is 'space.jpg'
    const name = spaceRef.name;
    console.log(name)
    // Points to 'images'
    const imagesRefAgain = spaceRef.parent;
    console.log(imagesRefAgain)
    const storageRefagain = ref(storage, `postimages/${localPost.title}`);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRefagain, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        onReset();  
      });
  }
  const onReset = () => {
    form.resetFields();
};

const normFile = (e) => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const email = user.email;
        console.log(email);
        post.postedBy = email;
  
        // ...
      } else {
        // User is signed out
        // ...
        console.log("no user has logged in");
      }
    });
  }, [onFinish]);

    
  
  
  //Adding Posts on FireStore
 
  const addPosts = () => {
    let postsRef = collection(db, "Posts");
    console.log(postsRef);
    addDoc(postsRef, post);
  };
 let fetchedpost;
 let arr=[];
 let newarr=[];
  const [allpost, setallPost] = useState([]);
  useEffect(async () => {
    let postData = collection(db, "Posts");
    console.log(postData);
    let q = query(postData);

    fetchedpost = await getDocs(q);
    console.log(fetchedpost);
    fetchedpost.forEach((doc) => {
      arr = doc.data();
        newarr.push(arr);
      console.log(newarr);
    });
    setallPost(newarr);
  }, []);
console.log(allpost);
//For Image Upload

//for Image download
const currUser=localStorage.getItem('loginUseruid')
const getURL=()=>{
getDownloadURL(ref(storage, `postimages/${localPost.title}`))
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
          let postData = collection(db, "Posts");
         console.log(postData);
        let q = query(postData,where("postedBy", "==",post.title));
       
        let dataRef = doc(db, 'Post', post.uid)
        setDoc(dataRef, {
            image:url
        });
        console.log('data')
        // addDoc(postData, url);
        //   setimage(url);
          // localStorage.setItem('profileimage2',url)
      })
      .catch((error) => {
          // Handle any errors
          console.log(error)
      });
    }
    getURL(); 
  return(
   <div>
       <div className='top-bar ' style={{fontSize:'30px'}}>Posts</div>
       <div><Form {...layout} name="nest-messages" onFinish={onFinish} form={form}>
       <Form.Item
                    name="upload"
                    label="Upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}

                >
                    <Upload name="logo" listType="picture" accept="image/*" multiple={false}
                        maxCount={1}>
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item>
       <Form.Item name={['post']} label="Title" >
        <Input />
      </Form.Item>
      <Form.Item name={['content']} label="Content">
        <Input.TextArea />
      </Form.Item>
    
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>  </Form>
      </div>
      <div>
          Old posts
      </div>
      <div>
          {allpost.map((data)=>{
              return(
              <div> <div>Post Title: {data.title}</div>
              <div>Created By: {data.title}</div>
              <div>Image:{data.image}</div>
             <div> Post content:{data.content}</div>
              
              </div>
              
              )
          })}
      </div>
   </div>
   
   )
};
export default Posts;
