import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3001/economicnews');
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching the economic events data", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="news">
            <h1>News</h1>
            <hr />
            {events.length > 0 ? (
                events.map(event => (
                    <div key={event.id}>
                        <p><strong>Name:</strong> {event.name}</p>
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Time:</strong> {event.time}</p>
                        <p><strong>Impact:</strong> {event.impact}</p>
                        <hr />
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default News;
