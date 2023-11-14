import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // Import useParams
import DiscussionComment from './DiscussionComment';

function DiscussionTopicDetail() {
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);

  const { id } = useParams();  // Use useParams to get the id

  useEffect(() => {
    const fetchTopicAndComments = async () => {
      try {
        const topicResponse = await axios.get(`http://localhost:5000/api/discussion/topic/${id}`);
        setTopic(topicResponse.data.topic);
        const commentsResponse = await axios.get(`http://localhost:5000/api/discussion/comments/${id}`);
        setComments(commentsResponse.data.comments);
      } catch (error) {
        console.error('Error fetching topic and comments:', error);
      }
    };

    fetchTopicAndComments();
  }, [id]);  // Dependency array updated to [id]

  return (
    <div>
      {topic && (
        <div>
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
          <DiscussionComment topicId={id} />
          <div>
            {comments.map(comment => (
              <p key={comment.id}>{comment.comment_text}</p> // Display each comment
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscussionTopicDetail;
