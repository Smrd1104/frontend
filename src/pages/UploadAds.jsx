import React, { useEffect, useState } from 'react';
import AdminAds from '../components/AdminAds';
import UploadMediaWithTitle from '../components/UploadAdvertisement';
import summaryApi from '../common';

const UploadAds = () => {
  const [openUploadAds, setOpenUploadAds] = useState(false);
  const [allAds, setAllAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllAds = async () => {
    setLoading(true);
    try {
      const response = await fetch(summaryApi.ad.url);
      const dataResponse = await response.json();

      if (response.ok) {
        setAllAds(dataResponse?.ads || dataResponse?.data || []);
      } else {
        console.error('Failed to fetch ads:', dataResponse.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAds();
  }, []);

  if (loading) return <div className="p-4">Loading ads...</div>;

  return (
    <div className="p-4">
      <div className="bg-white py-2 px-4 flex justify-between items-center mb-4 rounded-lg shadow-sm">
        <h1 className="font-bold text-lg">All Ads</h1>
        <button
          className="cursor-pointer border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
          onClick={() => setOpenUploadAds(true)}
        >
          Upload ads
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {allAds.length > 0 ? (
          allAds.map((ad) => (
            <AdminAds
              data={ad}
              key={ad._id}
              fetchData={fetchAllAds}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No advertisements found.</p>
            {/* <button
              className="mt-4 cursor-pointer border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full"
              onClick={() => setOpenUploadAds(true)}
            >
              Upload Your First Ad
            </button> */}
          </div>
        )}
      </div>

      {openUploadAds && (
        <UploadMediaWithTitle
          onClose={() => setOpenUploadAds(false)}
          onUploadSuccess={fetchAllAds}
        />
      )}
    </div>
  );
};

export default UploadAds;