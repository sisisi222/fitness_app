import React, { useState } from 'react';
import axios from 'axios';

function DiscussionComment({ userId, topicId }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure that the comment text is not empty
    if (!commentText.trim()) {
      alert('Please enter a comment.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/discussion/comment/create', {
        topic_id: topicId,
        comment_text: commentText,
        user_id: userId
      });
      alert(response.data.message);
      setCommentText(''); // Clear the input field after successful submission
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting comment. Please try again.');
    }
  };

  return (
    <div>
      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Your comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ width: '100%', height: '200px', fontSize: '30px' }}
        />
        <br />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}

export default DiscussionComment;
