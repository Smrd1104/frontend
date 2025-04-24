const deliveryModel = require("../../models/deliveryModel");
const { check, validationResult } = require('express-validator');

// @desc    Save delivery details
// @route   POST /api/delivery
// @access  Public
const deliveryDetails = async (req, res) => {
    // Validate request data
    await check('address', 'Address is required').notEmpty().run(req);
    await check('city', 'City is required').notEmpty().run(req);
    await check('postalCode', 'Postal code is required').notEmpty().run(req);

    // Collect validation errors
    const errors = validationResult(req);

    // If validation errors exist, return them
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    try {
        const newDelivery = new deliveryModel(req.body);

        // Save the delivery details to the database
        await newDelivery.save();

        // Send a success response
        res.status(201).json({
            success: true,
            message: "Delivery details saved successfully",
            data: newDelivery
        });
    } catch (error) {
        // Log and send the error
        console.error("Error saving delivery:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to save delivery details",
            error: error
        });
    }
};

module.exports = deliveryDetails;
