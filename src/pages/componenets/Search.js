import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import "./component.css"


const Search = ()=>{

    return(
        <>
        <div className="search_bar">
            
            <input placeholder="Search..." type="text" className="input_search" /> <SearchOutlined className="icon_search"/>
            
        </div>
        </>
    )
}


export default Search; 
