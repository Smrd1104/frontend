const imageToBase64 = async (image) => {
    const reader = new FileReader();

    const data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(image);
    });

    return data;
};

export default imageToBase64;
