import React from 'react';
import VideoPlayer from './VideoPlayer';

function VideoList() {
    const categories = [
        {
            title: "Aerobic",
            videos: [
                { id: "a44ayeoSfKM", title: "Workout 1 for Aerobic" },
            ]
        },
        {
            title: "Cardio",
            videos: [
                { id: "fcN37TxBE_s", title: "Workout 1 for Cardio" },
            ]
        },
        {
            title: "Weight Training",
            videos: [
                { id: "BNsKEG3hIzI", title: "Workout 1 for Weight Training" },
            ]
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Visual Training</h2>
            {categories.map(category => (
                <div key={category.title} style={{ marginBottom: '30px' }}>
                    <h3>{category.title}</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {category.videos.map(video => (
                            <li key={video.id} style={{ marginBottom: '15px' }}>
                                <h4>{video.title}</h4>
                                <VideoPlayer videoId={video.id} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default VideoList;
