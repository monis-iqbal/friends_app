import React from 'react'
import { Routes as MyAppRoutes, Route, Link } from "react-router-dom";
import DownloadImage from '../pages/DownloadImage';
import HomePage from '../pages/HomePage';
import HomeStart from '../pages/HomeStart';
import Posts from '../pages/Posts';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import Uploadimage from '../pages/Uploadimage';
const FriendAppRoutes = () => {
    return (
        <div>
        <MyAppRoutes>
        <Route path="/" element={<SignInPage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/form" element={<HomePage />} />
        <Route path="/home" element={<HomeStart />} />
        <Route path="/posts" element={<Posts/>} />
        <Route path="/uploadimage" element={<Uploadimage/>} />
        <Route path="/downloadimage" element={<DownloadImage/>} />
       </MyAppRoutes>  
        </div>
    )
}

export default FriendAppRoutes
