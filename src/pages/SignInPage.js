import React from 'react'
import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import 'antd/dist/antd.css';
import { Form, Input, Button, Checkbox, } from 'antd';
import { UserOutlined, LockOutlined,LoginOutlined } from '@ant-design/icons';
import './pages.css'
import { Link } from 'react-router-dom';
import { auth, signInWithEmailAndPassword,collection,addDoc,onAuthStateChanged, db } from "./FirebaseApp";
let setUser=()=>{}
const SignInPage = () => {
  let navigate = useNavigate()
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    const email = values.email;
    const password = values.password;
       setUser=()=>{
      let user=email;
      return user;
    }
    setUser(email);
    console.log(email, password);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.email,user.password)
        navigate('/home')
        // addUser(); //Set User On FireStore
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
         console.log(error);
      });
    };
     let LoggedinUser={}
      useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const email = user.email;
            localStorage.setItem('loginUseruid',user.uid)
            const lastLoggedin=new Date();
            user.lastLoggedin=lastLoggedin;
            console.log(email,lastLoggedin);
            LoggedinUser.email=email;
            LoggedinUser.lastLoggedin=lastLoggedin;
            // ...
          } else {
            // User is signed out
            // ...
            console.log("no user has logged in")
          }
        });
      },[])
    //  //Adding User on FireStore
    //   const addUser = async () => {
    //     console.log(LoggedinUser);
    //     let userRef = collection(db, 'user');
    //     console.log(userRef)
    //     await addDoc(userRef, LoggedinUser);
    // }

  

    return (
        <div>
 <div className='container'>
      <div className='logo'>
        <h1 className='heading'>Login Page</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" type="email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              size="10"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button icon={<LoginOutlined/>}type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <Link to="/signup">Signup Here</Link>
          </Form.Item>
        </Form>
      </div></div>            
        </div>
    )
}
export {setUser}
export default SignInPage
