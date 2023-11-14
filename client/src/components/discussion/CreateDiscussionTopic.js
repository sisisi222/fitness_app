import React, { useState } from 'react';
import axios from 'axios';

function CreateDiscussionTopic({ userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/discussion/topic/create', {
        title, description, user_id: userId
      });
      alert(response.data.message);
      // Handle post-submission logic (e.g., redirecting)
    } catch (error) {
      console.error('Error:', error);
      // Handle errors
    }
  };

  return (
    <div>
      <h2>Create Discussion Topic</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', height: '500px', fontSize: '30px' }} // Increased height for better visibility
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateDiscussionTopic;
