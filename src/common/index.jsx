const backendDomain = "http://localhost:8080"

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
    }


}

export default summaryApi