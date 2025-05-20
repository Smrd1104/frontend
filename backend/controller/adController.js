const Ad = require('../models/ad');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// Upload media to Cloudinary and create ad
const uploadMedia = async (req, res) => {
    try {
        const { title, media } = req.body;

        // Basic validation
        if (!media || media.length === 0) {
            return res.status(400).json({ error: 'At least one media item is required' });
        }

        const ad = new Ad({ title, media });
        await ad.save();

        return res.status(201).json({ 
            success: true,
            message: 'Ad created successfully', 
            ad 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            error: 'Server error while creating ad' 
        });
    }
};

// Get all ads
const getAds = async (req, res) => {
    try {
        const ads = await Ad.find().sort({ createdAt: -1 });
        res.json({ 
            success: true,
            ads 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: 'Server error while fetching ads' 
        });
    }
};

// Get single ad by ID
const getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ 
                success: false,
                error: 'Ad not found' 
            });
        }
        res.json({ 
            success: true,
            ad 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: 'Server error while fetching ad' 
        });
    }
};

// Update ad by ID
const updateAd = async (req, res) => {
    try {
        const { title, media } = req.body;
        const adId = req.params.id;

        // Basic validation
        if (!media || media.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'At least one media item is required' 
            });
        }

        const updatedAd = await Ad.findByIdAndUpdate(
            adId,
            { title, media },
            { new: true, runValidators: true }
        );

        if (!updatedAd) {
            return res.status(404).json({ 
                success: false,
                error: 'Ad not found' 
            });
        }

        res.json({ 
            success: true,
            message: 'Ad updated successfully',
            ad: updatedAd 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: 'Server error while updating ad' 
        });
    }
};

// Delete ad by ID
const deleteAd = async (req, res) => {
    try {
        const adId = req.params.id;
        const deletedAd = await Ad.findByIdAndDelete(adId);

        if (!deletedAd) {
            return res.status(404).json({ 
                success: false,
                error: 'Ad not found' 
            });
        }

        // Optional: Delete media from Cloudinary
        // You might want to implement this if you want to clean up storage
        // await deleteMediaFromCloudinary(deletedAd.media);

        res.json({ 
            success: true,
            message: 'Ad deleted successfully' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: 'Server error while deleting ad' 
        });
    }
};

// Helper function to delete media from Cloudinary (optional)
const deleteMediaFromCloudinary = async (mediaArray) => {
    try {
        for (const media of mediaArray) {
            const publicId = media.url.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        console.error('Error deleting media from Cloudinary:', error);
    }
};

module.exports = {
    uploadMedia,
    getAds,
    getAdById,
    updateAd,
    deleteAd
};