import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

function VideoList() {
    const categories = [
        {
            title: "Aerobic",
            levels: {
                "Beginner": [
                    { id: "WTUruNwUMFI", title: "Beginner Workout 1 for Aerobic" },
                    { id: "hcHYG9ZpYug", title: "Beginner Workout 2 for Aerobic" }
                ],
                "Experienced": [
                    { id: "X3Zp0h42J_w", title: "Experienced Workout 1 for Aerobic" }
                ],
                "Expert": [
                    { id: "HpuwhAzrDZA", title: "Expert Workout 1 for Aerobic" }
                ]
            }
        },
        {
            title: "Cardio",
            levels: {
                "Beginner": [
                    { id: "fcN37TxBE_s", title: "Beginner Workout 1 for Cardio" }
                ],
                "Experienced": [
                    { id: "wLYeRlyyncY", title: "Experienced Workout 1 for Cardio" },
                    { id: "W3xemVqcGJo", title: "Experienced Workout 2 for Cardio" }
                ],
                "Expert": [
                    { id: "WNUvx5y-1QE", title: "Expert Workout 1 for Cardio" }
                ]
            }
            
        },
        {
            title: "Weight Training",
            levels: {
                "Beginner": [
                    { id: "BNsKEG3hIzI", title: "Beginner Workout 1 for Weight Training" }
                ],
                "Experienced": [
                    { id: "JyV7mUFSpXs", title: "Experienced Workout 1 for Weight Training" },
                    { id: "SuajkDYlIRw", title: "Experienced Workout 2 for Weight Training" }
                ],
                "Expert": [
                    { id: "XC3LJwbGteE", title: "Expert Workout 1 for Weight Training" }
                ]
            }
        }
    ];

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Visual Training</h2>
            {!selectedCategory && <div>
                <p>Can you tell me about what type of exercises you are interested in?</p>
                {categories.map(category => (
                    <button key={category.title} onClick={() => setSelectedCategory(category.title)}>
                        {category.title}
                    </button>
                ))}
            </div>}

            {selectedCategory && !selectedLevel && <div>
                <p>What level are you?</p>
                {["Beginner", "Experienced", "Expert"].map(level => (
                    <button key={level} onClick={() => setSelectedLevel(level)}>
                        {level}
                    </button>
                ))}
            </div>}

            {selectedCategory && selectedLevel && <div>
                <p>Here are some videos for {selectedCategory} at {selectedLevel} level:</p>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {categories.find(c => c.title === selectedCategory).levels[selectedLevel].map(video => (
                        <li key={video.id} style={{ marginBottom: '15px' }}>
                            <h4>{video.title}</h4>
                            <VideoPlayer videoId={video.id} />
                        </li>
                    ))}
                </ul>
            </div>}

        </div>
    );
}

export default VideoList;