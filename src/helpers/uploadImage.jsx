const uploadImage = async (file) => {
    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME_CLOUDINARY}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mern_product"); // Make sure this preset works for both

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Cloudinary ${resourceType} upload failed`);
    }

    const result = await response.json();
    return {
        url: result.url,
        type: isVideo ? "video" : "image"
    };
};

export default uploadImage;
































// const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME_CLOUDINARY}/image/upload`;

// const uploadImage = async (image) => {
//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", "mern_product");

//     const dataResponse = await fetch(url, {
//         method: "post",
//         body: formData,
//     });

//     return dataResponse.json();
// };

// export default uploadImage;
