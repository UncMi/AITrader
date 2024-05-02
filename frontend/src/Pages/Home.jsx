import axios from "axios";
import {useEffect, useState} from 'react';

import './../App.css'
import Navbar from './../Components/Navbar'
import ForexGraph from './../Components/ForexGraph';



export default function Home(){

    const [listOfPosts, setListOfPosts] = useState([]);
    axios.get(`http://localhost:3001/forex/H1`)

    return (
        <>
            <ForexGraph></ForexGraph>
        </>
  )
}
