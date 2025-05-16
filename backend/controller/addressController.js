const Address = require('../models/address');
const { addressValidationSchema } = require('../validations/addressValidation');

// Get all addresses for the current user
const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.userId });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error });
    }
};

// Get a specific address by ID (only if it belongs to the current user)
const getAddressById = async (req, res) => {
    const { id } = req.params;
    try {
        const address = await Address.findOne({ _id: id, user: req.userId });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching address', error });
    }
};

// Add a new address for the current user
const addAddress = async (req, res) => {
    const { error } = addressValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name, phone, email, address, pincode, city, state, country } = req.body;

    const newAddress = new Address({
        user: req.userId,
        name,
        phone,
        email,
        address,
        pincode,
        city,
        state,
        country,
    });

    try {
        await newAddress.save();
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(400).json({ message: 'Error adding address', error });
    }
};

// Update an address (only if it belongs to the current user)
const updateAddress = async (req, res) => {
    const { error } = addressValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const { name, phone, email, address, pincode, city, state, country } = req.body;

    try {
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id, user: req.userId },
            { name, phone, email, address, pincode, city, state, country },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(400).json({ message: 'Error updating address', error });
    }
};

// Delete an address (only if it belongs to the current user)
const deleteAddress = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAddress = await Address.findOneAndDelete({ _id: id, user: req.userId });

        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting address', error });
    }
};

module.exports = {
    getAllAddresses,
    getAddressById,
    addAddress,
    updateAddress,
    deleteAddress,
};
