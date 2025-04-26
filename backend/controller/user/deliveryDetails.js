const deliveryModel = require("../../models/deliveryModel");
const { check, validationResult } = require('express-validator');

// Save delivery details if not duplicate
const deliveryDetails = async (req, res) => {
    // Validate input
    await check('address', 'Address is required').trim().notEmpty().run(req);
    await check('postalCode', 'Postal code is required').trim().notEmpty().isPostalCode('any').withMessage('Invalid postal code').run(req);
    await check('city', 'City is required').trim().notEmpty().run(req);
    await check('state', 'State is required').trim().notEmpty().run(req);
    await check('phone', 'Phone is required').trim().notEmpty().isMobilePhone('any').run(req);
    await check('name', 'Name is required').trim().notEmpty().run(req);
    await check('email', 'Email is required').trim().notEmpty().isEmail().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    try {
        const {
            userId,
            address,
            postalCode,
            city,
            state,
            phone,
            name,
            email
        } = req.body;

        // Normalize the values for comparison
        const normalizedAddress = address.trim().toLowerCase();
        const normalizedCity = city.trim().toLowerCase();
        const normalizedState = state.trim().toLowerCase();
        const normalizedPostalCode = postalCode.trim();

        // Check for existing delivery address (ignore phone/email/name)
        const existingAddress = await deliveryModel.findOne({
            userId,
            address: { $regex: `^${normalizedAddress}$`, $options: 'i' },
            city: { $regex: `^${normalizedCity}$`, $options: 'i' },
            state: { $regex: `^${normalizedState}$`, $options: 'i' },
            postalCode: normalizedPostalCode,
        });

        if (existingAddress) {
            return res.status(200).json({
                success: true,
                message: "Delivery address already exists",
                data: existingAddress
            });
        }

        // Create new delivery entry
        const newDelivery = new deliveryModel({
            userId,
            address: normalizedAddress,
            city: normalizedCity,
            state: normalizedState,
            postalCode: normalizedPostalCode,
            phone,
            name,
            email
        });

        await newDelivery.save();

        res.status(201).json({
            success: true,
            message: "Delivery details saved successfully",
            data: newDelivery
        });

    } catch (error) {
        console.error("Error saving delivery:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to save delivery details",
            error
        });
    }
};

module.exports = deliveryDetails;
