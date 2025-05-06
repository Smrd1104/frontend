// controllers/addressController.js

const Address = require('../models/address');

// Get all addresses
const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error });
    }
};

// Get a specific address by ID
const getAddressById = async (req, res) => {
    const { id } = req.params;
    try {
        const address = await Address.findById(id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching address', error });
    }
};

// Add a new address
const addAddress = async (req, res) => {
    const { name, phone, email, address, pincode, city, state, country } = req.body;

    const newAddress = new Address({
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

// Update an address
const updateAddress = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, address, pincode, city, state, country } = req.body;

    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            id,
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

// Delete an address
const deleteAddress = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAddress = await Address.findByIdAndDelete(id);

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
