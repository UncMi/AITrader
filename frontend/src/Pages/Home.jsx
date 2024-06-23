import axios from "axios";
import { useEffect, useState, useRef } from 'react';

import './../App.css'
import Navbar from './../Components/Navbar'
import ForexGraph from './../Components/ForexGraph';
import News from './../Components/News'; // Import the News component

export default function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [isNewsExpanded, setIsNewsExpanded] = useState(false);
    const [newsData, setNewsData] = useState(null);
    const forexGraphRef = useRef(null);
    const newsRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/forex/H1`)
            .then(response => {
                setListOfPosts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });

        // Fetch news data when the component mounts
        axios.get(`http://localhost:3001/news`)
            .then(response => {
                setNewsData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the news data!", error);
            });
    }, []);

    const toggleNews = () => {
        setIsNewsExpanded(!isNewsExpanded);
    };

    return (
        <>
            <div className="forex-graph-container" ref={forexGraphRef}>
                <ForexGraph />
            </div>
            <div className={`news ${isNewsExpanded ? 'expanded' : 'collapsed'}`} ref={newsRef} onClick={toggleNews}>
                {isNewsExpanded ? <News data={newsData} /> : "NEWS"}
            </div>
            
            {/* <div class="slider-container">
                <input type="range" min="1" max="100" value="50" class="slider"></input>
            </div> */}

        </>
    );
}
