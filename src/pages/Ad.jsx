import React, { useEffect, useState } from 'react';
import summaryApi from '../common';
import { toast } from 'react-toastify';

const AdsList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    // const loadingList = new Array(0).fill(null)


    useEffect(() => {
        const fetchAds = async () => {
            try {
                setLoading(true)
                const res = await fetch(summaryApi.ad.url);
                setLoading(false)
                const data = await res.json();

                if (res.ok) {
                    setAds(data.ads);
                    // toast.success('Ad created successfully')
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

    // if (loading) return <p>Loading ads...</p>;
    // if (ads.length === 0) return <p>No ads found</p>;

    return (
        <div className="ads-list flex flex-wrap gap-5 container mx-auto ">

            {loading ?
                (
                    // Skeleton Loader (simulate 3 items)
                    [...Array(1)].map((_, index) => (
                        <div key={index} className="bg-white p-3">
                            <h3 className="font-bold mb-2 bg-slate-200 p-2 h-6 w-1/3 rounded animate-pulse rounded"></h3>
                            <div className="flex flex-wrap gap-2">
                                <div
                                    className="w-[580px] h-[400px] bg-slate-200 rounded animate-pulse"
                                ></div>
                            </div>
                        </div>
                    ))
                ) :
                (
                    ads.map(ad => (
                        <div key={ad._id} className="bg-white p-2">
                            <h3 className="font-semibold text-2xl mb-2">{ad.title || "Untitled"}</h3>
                            <div className="flex flex-wrap gap-2 ">
                                {ad.media.map((item, index) =>
                                    item.type === 'image' ? (
                                        <img
                                            key={index}
                                            src={item.url}
                                            alt={`ad-media-${index}`}
                                            className="w-[650px] h-[420px] object-contain animate-pulse rounded"
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
                    ))
                )
            }

        </div>
    );
};

export default AdsList;
