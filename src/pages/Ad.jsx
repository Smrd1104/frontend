import React, { useEffect, useState } from 'react';
import summaryApi from '../common';

const AdsList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch(summaryApi.ad.url);
                const data = await res.json();
                if (res.ok) {
                    setAds(data.ads);
                } else {
                    console.error('Failed to fetch ads:', data.error);
                }
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
            setLoading(false);
        };
        fetchAds();
    }, []);

    if (loading) return <p>Loading ads...</p>;
    if (ads.length === 0) return <p>No ads found</p>;

    return (
        <div className="ads-list flex flex-wrap gap-5 p-4">
            {ads.map(ad => (
                <div key={ad._id} className="bg-white  p-3">
                    <h3 className="font-bold mb-2">{ad.title || "Untitled"}</h3>
                    <div className="flex flex-wrap gap-2 ">
                        {ad.media.map((item, index) =>
                            item.type === 'image' ? (
                                <img
                                    key={index}
                                    src={item.url}
                                    alt={`ad-media-${index}`}
                                    className="w-[400px] h-[400px] object-cover rounded"
                                />
                            ) : (
                                <video
                                    key={index}
                                    // controls
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    className="w-[650px] h-[420px] object-cover rounded"
                                >
                                    <source src={item.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )
                        )}

                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdsList;
