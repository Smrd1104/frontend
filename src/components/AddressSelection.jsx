import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import summaryApi from '../common';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoClose } from 'react-icons/io5';

const AddressSelection = ({
  savedAddresses,
  setSavedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  fetchSavedAddresses
}) => {
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(true);

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

  const validateForm = () => {
    const { name, phone, email, address, pincode, city, state } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;

    if (!name.trim()) return "Name is required";
    if (!phoneRegex.test(phone)) return "Invalid phone number (10 digits, starts with 6-9)";
    if (!emailRegex.test(email)) return "Invalid email format";
    if (!address.trim()) return "Address is required";
    if (!pincodeRegex.test(pincode)) return "Pincode must be 6 digits";
    if (!city.trim()) return "City is required";
    if (!state.trim()) return "State is required";

    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewAddress = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      setIsLoading(true);
      const requestOptions = {
        method: isEditing ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };

      let response;
      if (isEditing && editingId) {
        response = await fetch(summaryApi.updateAddress(editingId).url, requestOptions);
      } else {
        response = await fetch(summaryApi.addAddress.url, requestOptions);
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || (isEditing ? 'Address updated successfully' : 'Address added successfully'));
        fetchSavedAddresses();
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
        toast.error(data.message || (isEditing ? 'Error updating address' : 'Error adding address'));
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Error saving address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      email: address.email,
      address: address.address,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      country: address.country || 'India',
    });
    setIsAddNewOpen(true);
    setIsEditing(true);
    setEditingId(address._id);
  };

  const handleDeleteAddress = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(summaryApi.deleteAddress(id).url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Address deleted successfully');
        fetchSavedAddresses();
        if (selectedAddressId === id) {
          setSelectedAddressId('');
        }
      } else {
        toast.error(data.message || 'Error deleting address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Error deleting address');
    } finally {
      setIsLoading(false);
      setShowDeletePopup(false);
      setAddressToDelete(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-2 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Select Delivery Address</h2>
        <button
          onClick={() => setIsSectionOpen(prev => !prev)}
          className="text-xl font-bold px-2 text-blue-600"
        >
          {isSectionOpen ? '−' : '+'}
        </button>
      </div>

      {isSectionOpen && (
        <div>
          {isLoading && !isAddNewOpen && !showDeletePopup && (
            <div className="text-center py-4">Loading addresses...</div>
          )}

          <div className="space-y-4">
            {savedAddresses.length === 0 && !isLoading ? (
              <div className="text-center py-4 text-gray-500">
                No saved addresses found. Please add an address.
              </div>
            ) : (
              savedAddresses.map((address) => (
                <div key={address._id} className="relative">
                  <label
                    className={`flex items-start gap-4 border p-2   rounded-md cursor-pointer ${selectedAddressId === address._id
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
                    <div className='text-sm'>
                      <p className="font-semibold">{address.name}</p>
                      <p>{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                      <p>Phone: {address.phone}</p>
                      <p>Email: {address.email}</p>
                      <p>Country: {address.country}</p>
                    </div>
                  </label>

                  {selectedAddressId === address._id && (
                    <div className=''>
                      <FaRegEdit
                        className="absolute md:top-2 md:right-2 right-1 top-2 text-green-600 text-2xl hover:text-green-800"
                        onClick={() => handleEditAddress(address)}
                        disabled={isLoading}
                      />


                      <MdDeleteOutline
                        className="absolute md:bottom-2 md:right-2  right-1 bottom-2  text-red-600 md:text-2xl text-3xl hover:text-red-800"
                        onClick={() => {
                          setAddressToDelete(address._id);
                          setShowDeletePopup(true);
                        }}
                        disabled={isLoading}
                      />


                    </div>
                  )}
                </div>
              ))
            )}
          </div>

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
              disabled={isLoading}
            >
              + Add New Address
            </button>
          </div>
        </div>
      )}

      {isAddNewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg relative">
            <IoClose
              className="absolute top-2 text-2xl right-2 text-gray-600 hover:text-gray-800"
              onClick={() => {
                setIsAddNewOpen(false);
                setIsEditing(false);
              }}
              disabled={isLoading}
            />


            <h3 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </h3>
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
                disabled={isLoading}
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="border p-2 rounded w-full"
                disabled={isLoading}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="border p-2 rounded w-full"
                disabled={isLoading}
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Pincode"
                className="border p-2 rounded w-full"
                disabled={isLoading}
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="border p-2 rounded w-full"
                disabled={isLoading}
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="border p-2 rounded w-full"
                disabled={isLoading}
              />
            </div>

            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Full Address"
              className="border p-2 rounded w-full mt-4"
              disabled={isLoading}
            ></textarea>

            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:bg-blue-400"
              onClick={handleSaveNewAddress}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isEditing ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-sm relative">
            <IoClose
              className="absolute top-2 text-2xl right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowDeletePopup(false)}
              disabled={isLoading}
            />

            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this address?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
                onClick={() => setShowDeletePopup(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
                onClick={() => handleDeleteAddress(addressToDelete)}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelection;