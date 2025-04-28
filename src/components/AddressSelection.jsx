import React, { useState } from 'react';

const AddressSelection = () => {
  const [savedAddresses, setSavedAddresses] = useState([
    {
      _id: '1',
      name: 'John Doe',
      phone: '9876543210',
      email: 'john@example.com',
      address: '123 Main Street',
      pincode: '123456',
      city: 'New York',
      state: 'NY',
      country: 'India',
    },
    {
      _id: '2',
      name: 'Jane Smith',
      phone: '9876543221',
      email: 'jane@example.com',
      address: '456 Elm Street',
      pincode: '654321',
      city: 'Los Angeles',
      state: 'CA',
      country: 'India',
    },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveNewAddress = () => {
    if (isEditing && editingId) {
      setSavedAddresses((prev) =>
        prev.map((addr) =>
          addr._id === editingId ? { ...formData, _id: editingId } : addr
        )
      );
      setSelectedAddressId(editingId);
    } else {
      const newAddress = {
        ...formData,
        _id: Date.now().toString(),
      };
      setSavedAddresses([...savedAddresses, newAddress]);
      setSelectedAddressId(newAddress._id);
    }

    setIsAddNewOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      country: 'India',
    });
  };

  const handleEditAddress = (address) => {
    setFormData(address);
    setIsAddNewOpen(true);
    setIsEditing(true);
    setEditingId(address._id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Select Delivery Address</h2>

      {/* Saved Addresses */}
      <div className="space-y-4">
        {savedAddresses.map((address) => (
          <div key={address._id} className="relative">
            <label
              className={`flex items-start gap-4 border p-4 rounded-md cursor-pointer ${selectedAddressId === address._id
                ? 'border-blue-500 bg-blue-100'
                : 'border-gray-300'
                }`}
            >
              <input
                type="radio"
                name="selectedAddress"
                value={address._id}
                checked={selectedAddressId === address._id}
                onChange={() => {
                  setSelectedAddressId(address._id);
                }}
                className="mt-1"
              />
              <div>
                <p className="font-semibold">{address.name}</p>
                <p>{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                <p>Phone: {address.phone}</p>
                <p>Email: {address.email}</p>
                <p>Country: {address.country}</p>
              </div>
            </label>

            {selectedAddressId === address._id && (
              <button
                className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
                onClick={() => handleEditAddress(address)}
              >
                ✏️
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add New Address Button */}
      <div className="mt-6">
        <button
          className="text-blue-600 font-medium hover:underline"
          onClick={() => {
            setIsAddNewOpen(true);
            setIsEditing(false);
            setFormData({
              name: '',
              phone: '',
              email: '',
              address: '',
              pincode: '',
              city: '',
              state: '',
              country: 'India',
            });
          }}
        >
          + Add New Address
        </button>
      </div>

      {/* Add/Edit Address Popup */}
      {isAddNewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => {
                setIsAddNewOpen(false);
                setIsEditing(false);
              }}
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Address' : 'Add New Address'}</h3>
            <input
              type="text"
              name="country"
              value={formData.country}
              disabled
              className="border p-2 mb-5 rounded w-full bg-gray-100 text-gray-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="border p-2 rounded w-full"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Pincode"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="border p-2 rounded w-full"
              />

            </div>

            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Full Address"
              className="border p-2 rounded w-full mt-4"
            ></textarea>

            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={handleSaveNewAddress}
            >
              {isEditing ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelection;
