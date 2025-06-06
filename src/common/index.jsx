const backendDomain = import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://shop-e-mart.onrender.com";

const summaryApi = {
    signUp: {

        url: `${backendDomain}/api/signup`,
        method: "POST"
    },
    signIn: {
        url: `${backendDomain}/api/signin`,
        method: "POST"

    },
    current_user: {
        url: `${backendDomain}/api/user-details`,
        method: "GET"

    },
    logout_user: {
        url: `${backendDomain}/api/userLogout`,
        method: "GET"
    },
    allUser: {
        url: `${backendDomain}/api/all-user`,
        method: "GET"
    },
    updateUser: {
        url: `${backendDomain}/api/update-user`,
        method: "POST"

    },
    deleteUser: (id) => ({
        url: `${backendDomain}/api/user/${id}`,
        method: "DELETE",
    }),


    uploadProduct: {
        url: `${backendDomain}/api/upload-product`,
        method: "POST"
    },
    allProduct: {
        url: `${backendDomain}/api/get-product`,
        method: "GET"
    },
    updateProduct: {
        url: `${backendDomain}/api/update-product`,
        method: "POST"
    },
    deleteProduct: {
        url: `${backendDomain}/api/product/delete-product`,
        method: "DELETE"
    },
    categoryProduct: {
        url: `${backendDomain}/api/get-categoryProduct`,
        method: "POST",
    },
    categoryWiseProduct: {
        url: `${backendDomain}/api/category-product`,
        method: "POST",
    },
    productDetails: {
        url: `${backendDomain}/api/product-details`,
        method: "POST"
    },
    addToCartProduct: {
        url: `${backendDomain}/api/addtocart`,
        method: "POST"
    },
    addToCartProductCount: {
        url: `${backendDomain}/api/CountAddToCartProduct`,
        method: "GET"

    },
    addToCartProductView: {
        url: `${backendDomain}/api/view-cart-product`,
        method: "GET"
    },
    updateCartProduct: {
        url: `${backendDomain}/api/update-cart-product`,
        method: "POST"
    },
    deleteCartProduct: {
        url: `${backendDomain}/api/delete-cart-product`,
        method: "POST"
    },
    searchProduct: {
        url: `${backendDomain}/api/search`,
        method: "GET"
    },
    filterProduct: {
        url: `${backendDomain}/api/filter-product`,
        method: "POST"
    },
    payment: {
        url: `${backendDomain}/api/checkout`,
        method: "POST"
    },
    getOrder: {
        url: `${backendDomain}/api/order-list`,
        method: "GET"
    },
    allOrder: {
        url: `${backendDomain}/api/all-order`,
        method: "GET"
    },

    // Add these new endpoints
    forgotPassword: {
        url: `${backendDomain}/api/forgot-password`,
        method: "POST"
    },
    verifyOtp: {
        url: `${backendDomain}/api/verify-otp`,
        method: "POST"
    },
    resetPassword: {
        url: `${backendDomain}/api/reset-password`,
        method: "POST"
    },


    // Get all addresses
    getAllAddresses: {
        url: `${backendDomain}/api/addresses`,
        method: "GET"
    },

    // Get a specific address by ID
    getAddressById: (id) => ({
        url: `${backendDomain}/api/addresses/${id}`,
        method: "GET"
    }),

    // Add a new address
    addAddress: {
        url: `${backendDomain}/api/addresses`,
        method: "POST"
    },

    // Update an address
    updateAddress: (id) => ({
        url: `${backendDomain}/api/addresses/${id}`,
        method: "PUT"
    }),

    // Delete an address
    deleteAddress: (id) => ({
        url: `${backendDomain}/api/addresses/${id}`,
        method: "DELETE"
    }),

    // media upload
    uploadMedia: {
        url: `${backendDomain}/api/media/upload`,
        method: "POST"
    },
    adMedia: {
        url: `${backendDomain}/api/ad/upload-media`,
        method: "POST"
    },
    ad: {
        url: `${backendDomain}/api/ad/get-ads`,
        method: "GET"
    },
    updateAd: (id) => ({
        url: `${backendDomain}/api/ad/upload-media/${id}`,
        method: 'PUT'
    }),
    deleteAd: (id) => ({
        url: `${backendDomain}/api/ad/${id}`,
        method: 'DELETE'
    })




}

export default summaryApi