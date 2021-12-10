import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  onAuthStateChanged,
  db,
  auth,
  storage,
  storageRef,
  imagesRef,
  signOut,
} from "./FirebaseApp";
import {
  LogoutOutlined,
} from "@ant-design/icons";
import { Button,Upload, Form as AntForm,Radio, Form, Select, Space, Input, DatePicker } from "antd";
import { getDownloadURL,ref, uploadBytes } from "firebase/storage"
import { UploadOutlined } from '@ant-design/icons';

const HomePage = () => {

  let userInfo = {
    email:'',
    lastLoggedin:'',
    username:'',
    dob:'',
    gender:'',
    contactno:'',
    about:'',
  };
  let currUser;
  let valForm={};
  let username;
  let navigate = useNavigate();
  //Ant Design Form Items
  const { Option } = Select;
  function onChange(date, dateString) {
    console.log(date, dateString);
    userInfo.dob = dateString;
  }
  const onGenderChange = (value) => {
  console.log(value);
  userInfo.gender=value;
  }
  // const userNameHandler=(e)=>{
  // console.log(e.target.value);
  // username=e.target.value;
// userInfo.username=username; 
// }
const [form] = AntForm.useForm();
    // console.log('Success:', values.upload.file, values.upload.file.name);

    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
    };

    const buttonItemLayout = {
        wrapperCol: { span: 14, offset: 4 },
    };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const email = user.email;
        const lastLoggedin = new Date();
        console.log(email, lastLoggedin);
        userInfo.email = email;
        userInfo.lastLoggedin = lastLoggedin;
  localStorage.setItem('logginUser',user.uid)
        // ...
      } else {
        // User is signed out
        // ...
        console.log("no user has logged in");
      }
    });
  }, []);

 
 
  const onFinish = (values) => {
    currUser=localStorage.getItem('logginUser');
    console.log("Received values of form: ", values);
    userInfo.username=values.username
    userInfo.contactno=values.contactno
    userInfo.about=values.about
    addUserProfile();
    const file = values.upload[0].originFileObj;
    console.log(file)
    // Points to 'images/space.jpg'
    // Note that you can use variables to create child values
    const fileName = currUser;
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
    const storageRefagain = ref(storage, `images/${currUser}`);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRefagain, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        onReset();
    });
  }; 

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

  console.log(userInfo);
 

  const addUserProfile =  () => {
    let userProfileRef = collection(db, "userProfiles");
    console.log(userProfileRef);
    console.log('Setting data on Firebase')
     addDoc(userProfileRef, userInfo);
     navigate('/home');
  
  };


 
  //Adding User on FireStore

  //Ant Design Form Items
  function UserSignOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  

  return (
    <div>
      <Button icon={<LogoutOutlined />} type="primary" onClick={UserSignOut}>
        LogOut
      </Button>
      <Form
        name="complex-form"
        onFinish={onFinish}
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        {/* Image Upload */}
        {/* <Form.Item label="Upload Image">
    <Upload {...props}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
  </Form.Item> */}
        {/* Image Upload */}
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
                {/* <Form.Item {...buttonItemLayout}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>Submit</Button>


                </Form.Item> */}
        <Form.Item label="Username">
          <Space>
            <Form.Item
              name="username"
              noStyle
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input  style={{ width: 160 }} placeholder="Please input" />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="Contact Number">
          <Space>
            <Form.Item
              name="contactno"
              type={Number}
              noStyle
              rules={[{ required: true, message: "Contact Number Required" }]}
            >
              <Input
                style={{ width: 160 }}
                placeholder="Please Enter Contact Number"
              />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="Date Of Birth">
          <Space>
            <DatePicker
              name="date-of-birth"
              label="date-of-birth"
              onChange={onChange}
            />
          </Space>
        </Form.Item>
        <Form.Item label="Select">
        <Select
          placeholder="Select a option and change input text above"
          onChange={onGenderChange}
          allowClear
        >
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
        <Form.Item label="About me">
          <Input.Group compact>
            <Form.Item
              name="about"
              noStyle
              rules={[{ required: true, message: "Enter about Yourself" }]}
            >
              <Input style={{ width: "50%" }} />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="primary" htmlType="submit" >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default HomePage;
