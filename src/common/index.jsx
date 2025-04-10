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

    }
}

export default summaryApi