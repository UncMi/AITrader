/* eslint-disable no-unused-vars */
import React, {	Component } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar(){

    const navigate = useNavigate();

    return(
        <>
            <div className="navbar"> 
                <a onClick={() => navigate('/Home')}>Home</a>
                <a onClick={() => navigate('/AIDemo')}>Ai GraphGuessr Demo</a>
                <a onClick={() => navigate('/EconomicNews')}>Economic News</a>
                <a onClick={() => navigate('/AIStatistics')}>AI Statistics</a>
            </div>
        </>
    )
}

export default Navbar;