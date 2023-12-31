// visualTraining/VideoPlayer.js
import React from 'react';
import YouTube from 'react-youtube';

function VideoPlayer({ videoId }) {
    
    const opts = {
        height: '1500',
        width: '1800',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1, 
        },
    };

    console.log("Rendering VideoPlayer with videoId:", videoId);
    return <YouTube videoId={videoId} opts={opts} />;
}

export default VideoPlayer;
