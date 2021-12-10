import React,{useEffect,useState} from 'react'
import { storage,storageRef,auth,imagesRef,collection,
    query,
    where,
    getDocs,
    onAuthStateChanged,
    db, } from './FirebaseApp'
import { Upload, message, Button,Form as AntForm } from 'antd';
import { getDownloadURL,ref, uploadBytes } from "firebase/storage"
import { UploadOutlined } from '@ant-design/icons';
const Uploadimage = () => {
    const [form] = AntForm.useForm();
    // console.log('Success:', values.upload.file, values.upload.file.name);

    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
    };

    const buttonItemLayout = {
        wrapperCol: { span: 14, offset: 4 },
    };
    let currUser;
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            
            console.log(user.uid);
            currUser=user.uid;
         
          } else {
            // User is signed out
            // ...
            console.log("no user has logged in")
          }
        });
      },[])
    // let arr = [];
    // let user = [];
    // const [myUsers, setMyUsers] = useState([]);

    // useEffect( async() => {
    //   let userData = collection(db, "userProfiles");
    //   console.log(userData);
    //   let q = query(userData, where("email", "==","hammad@123.com"));
    //   user = await getDocs(q);
    //   console.log(user);
    //   user.forEach((doc) => {
    //     arr = doc.data();
  
    //     // arr.push(doc.data());
    //     // console.log(arr);
    //   });
    //   setMyUsers(arr);
    // }, []);
    // console.log(myUsers)

    const onFinish = (values) => {
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
    

    return (
        <div>

            <AntForm
                {...formItemLayout}
                layout="horizontal"
                form={form}
                name="control-hooks"
                onFinish={onFinish}
            >
                <AntForm.Item
                    name="upload"
                    label="Upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}

                >
                    <Upload name="logo" listType="picture" accept="image/*" multiple={false}
                        maxCount={1}>
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </AntForm.Item>
                <AntForm.Item {...buttonItemLayout}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>Submit</Button>


                </AntForm.Item>
            </AntForm>
            
        </div>
    )
}

export default Uploadimage
