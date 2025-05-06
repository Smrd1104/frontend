import React, { useState, useEffect } from 'react';
import summaryApi from '../common';

const AddressSelection = () => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

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



  useEffect(() => {
    // Fetch all addresses when the component mounts
    const fetchAddresses = async () => {
      try {
        const response = await fetch(summaryApi.getAllAddresses.url);
        const data = await response.json();
        setSavedAddresses(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSaveNewAddress = async () => {
    const requestOptions = {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };

    try {
      let response;

      if (isEditing && editingId) {
        // Corrected: use updateAddress with ID
        response = await fetch(summaryApi.updateAddress(editingId).url, requestOptions);
      } else {
        response = await fetch(summaryApi.addAddress.url, requestOptions);
      }

      if (response.ok) {
        const updatedAddress = await response.json();

        if (isEditing) {
          setSavedAddresses((prev) =>
            prev.map((addr) => (addr._id === editingId ? updatedAddress : addr))
          );
        } else {
          setSavedAddresses((prev) => [...prev, updatedAddress]);
        }

        setSelectedAddressId(updatedAddress._id);
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
      } else {
        console.error('Error saving address:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };


  const handleEditAddress = (address) => {
    setFormData(address);
    setIsAddNewOpen(true);
    setIsEditing(true);
    setEditingId(address._id);
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await fetch(summaryApi.deleteAddress(id).url, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedAddresses((prev) => prev.filter((addr) => addr._id !== id));
      } else {
        console.error('Error deleting address:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
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
                onChange={() => setSelectedAddressId(address._id)}
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
              <div>
                <button
                  className="absolute top-2 right-8 text-blue-600 hover:text-blue-800"
                  onClick={() => handleEditAddress(address)}
                >
                  ✏️
                </button>
                <button
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  onClick={() => {
                    setAddressToDelete(address._id);
                    setShowDeletePopup(true);
                  }}
                >
                  🗑️
                </button>

              </div>
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

      {/* delete popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowDeletePopup(false)}
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this address?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={async () => {
                  await handleDeleteAddress(addressToDelete);
                  setShowDeletePopup(false);
                  setAddressToDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddressSelection;
