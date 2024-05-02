/* eslint-disable no-unused-vars */
import './App.css'
import axios from "axios";
import {useEffect, useState} from 'react';
import Navbar from './Components/Navbar';

import ForexGraph from './Components/ForexGraph';
import {BrowserRouter, Router, Route, Routes} from 'react-router-dom';


import NoPage from './Pages/NoPage';
import AIDemo from './Pages/AIDemo';
import Home from './Pages/Home';




function App() {

  

  return (
    <>
        

        <BrowserRouter>
        <Navbar></Navbar><br></br><br></br><br></br>
          <Routes>
            <Route index element={<Home/>} />
            <Route path="/Home" element={<Home/>}/>
            <Route path="/AIDemo" element={<AIDemo/>}/>
            <Route path="/*" element={<NoPage/>}/>
          </Routes>
        </BrowserRouter>
        
    </>
  )
}

export default App
