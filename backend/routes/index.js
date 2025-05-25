const express = require('express')
const router = express.Router()
const userSignUpController = require('../controller/user/userSignUp')
const userSignInController = require('../controller/user/userSignIn')
const authToken = require('../middleware/authToken')
const userDetailsController = require('../controller/user/userDetails')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const uploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct = require('../controller/user/addToCartViewProduct')
const updateToCartProduct = require('../controller/user/updateToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProduct = require('../controller/product/filterProduct')
const { paymentController } = require('../controller/order/paymentController')
const webhooks = require('../controller/order/webhook')
const orderController = require('../controller/order/order.controller')
const allOrderController = require('../controller/order/allorder.controller')
const passwordController = require('../controller/passwordController')
const addressController = require('../controller/addressController')
const { uploadMediaWithTitle } = require('../controller/mediaController')
const { uploadMedia, getAds, getAdById, updateAd, deleteAd } = require('../controller/adController')
const deleteProductController = require('../controller/product/deleteProductController')
const deleteUser = require('../controller/user/deleteUser')

router.post("/signup", userSignUpController)
router.post("/signin", userSignInController)
router.get("/user-details", authToken, userDetailsController)
router.get("/userLogout", userLogout)




// admin panel

router.get("/all-user", authToken, allUsers)
router.post("/update-user", authToken, updateUser)

// product upload
router.post("/upload-product", authToken, uploadProductController)
router.get("/get-product", getProductController)
router.post("/update-product", authToken, updateProductController)
router.post("/get-categoryProduct", getCategoryProduct)
router.post("/category-product", getCategoryWiseProduct)
router.post("/product-details", getProductDetails)
router.get("/search", searchProduct)
router.post("/filter-product", filterProduct)
router.delete("/product/delete-product", deleteProductController);
router.delete("/user/:id", deleteUser);




// user add to cart

router.post("/addtocart", authToken, addToCartController)
router.get("/countAddToCartProduct", authToken, countAddToCartProduct)
router.get("/view-cart-product", authToken, addToCartViewProduct)
router.post("/update-cart-product", authToken, updateToCartProduct)
router.post("/delete-cart-product", authToken, deleteAddToCartProduct)



// payment and order

router.post("/checkout", authToken, paymentController)
router.post("/webhook", webhooks)
router.get("/order-list", authToken, orderController)
router.get("/all-order", authToken, allOrderController)



// Forgot password - send OTP
router.post('/forgot-password', passwordController.sendOtp);

// Verify OTP
router.post('/verify-otp', passwordController.verifyOtp);

// Reset password
router.post('/reset-password', passwordController.resetPassword);



// Get all addresses
router.get('/addresses', authToken, addressController.getAllAddresses);

// Get a specific address by ID
router.get('/addresses/:id', authToken, addressController.getAddressById);

// Add a new address
router.post('/addresses', authToken, addressController.addAddress);

// Update an address
router.put('/addresses/:id', authToken, addressController.updateAddress);

// Delete an address
router.delete('/addresses/:id', authToken, addressController.deleteAddress);


console.log("Address routes loaded:", authToken, addressController);



// upload ad image
router.post('/media/upload', uploadMediaWithTitle);


// Upload media data (title + media URLs)
router.post('/ad/upload-media', uploadMedia);

// Get all ads
router.get('/ad/get-ads', getAds);

router.get('/ad/:id', getAdById);

router.put('/ad/upload-media/:id', updateAd);

router.delete('/ad/:id', deleteAd);

















module.exports = router