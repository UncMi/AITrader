/* eslint-disable no-unused-vars */
import './App.css'
import axios from "axios";
import {useEffect, useState} from 'react';
import Navbar from './Components/Navbar';
import Forex from './Components/Forex';
import ForexGraph from './Components/ForexGraph';
function App() {

  const [listOfPosts, setListOfPosts] = useState([]);


  return (
    <>
        <Navbar></Navbar><br></br><br></br><br></br>
        <ForexGraph></ForexGraph>
        
    </>
  )
}

export default App