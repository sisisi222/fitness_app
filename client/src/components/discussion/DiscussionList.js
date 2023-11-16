import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/discussion/DiscussionList.css'

function DiscussionList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/discussion/topics');
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="discussion-list-container">
      <h2>Discussion Topics</h2>
      <Link to="/discussion/create" className="discussion-create-link">Create New Topic</Link>
      <ul className="discussion-topics-list">
        {topics.map(topic => (
          <li key={topic.id}>
            <Link to={`/discussion/${topic.id}`}>{topic.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );  
}

export default DiscussionList;
