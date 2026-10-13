import ImageKit from '@imagekit/nodejs';



var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

// Provide forward-compatibility helper
if (!imagekit.upload && imagekit.files && typeof imagekit.files.upload === 'function') {
    imagekit.upload = imagekit.files.upload.bind(imagekit.files);
}

export default imagekit;