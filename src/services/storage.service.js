const ImageKit = require("imagekit");

async function uploadMusic(file, fileName = "music.mp3") {
    const imageKitClient = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    const result = await imageKitClient.upload({
        file,
        fileName: `${Date.now()}_${fileName}`,
        folder: "/music"
    });
    return result;
}

module.exports = { uploadMusic };