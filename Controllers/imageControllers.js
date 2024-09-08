const AWS = require("aws-sdk");
const Jimp = require("jimp");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
});

const spacesEndpoint = new AWS.Endpoint("https://motohat-cdn.sgp1.digitaloceanspaces.com");
const spacesCDNURL = 'https://motohat-cdn.sgp1.digitaloceanspaces.com/motohat';


const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  s3ForcePathStyle: true,
  sslEnabled: true,
});



exports.upload = async (req, res) => {
  try {
    const { originalname, buffer } = req.file;


    const fileExtension = originalname.split('.').pop();
    const newFileName = `${Date.now()}.${fileExtension}`;

    const key = `images/${newFileName}`;

    const params = {
      Bucket: 'motohat',
      Key: key,
      Body: buffer,
      ACL: 'public-read', 
    };

    await s3.upload(params).promise();


    const imageURL = `${spacesCDNURL}/${key}`;

    console.log(imageURL);

    res.json({ success: true, imageURL });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Image upload failed" });
  }
};


exports.uploadImage = async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const fileExtension = originalname.split('.').pop();
    const newFileName = `${Date.now()}.${fileExtension}`;
    const key = `images/${newFileName}`;

    const image = await Jimp.read(buffer);

    const watermarkText = 'MOTOHAT';
    const watermarkOpacity = 0.2;
    const watermarkSpacing = 300; 
    const watermarkAngle = -45; 

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).catch((err) => {
      console.error("Error loading font:", err);
      throw new Error("Failed to load font");
    });

    const watermark = new Jimp(300, 300, 0x00000000); 

    watermark.print(
      font,
      0,
      0,
      {
        text: watermarkText,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      300,
      300
    );

    watermark.rotate(watermarkAngle);

    for (let x = -watermark.bitmap.width; x < image.bitmap.width; x += watermarkSpacing) {
      for (let y = -watermark.bitmap.height; y < image.bitmap.height; y += watermarkSpacing) {
        image.composite(watermark, x, y, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: watermarkOpacity,
        });
      }
    }

    image.quality(80); 
    image.deflateLevel(5); 
    image.deflateStrategy(1);

    const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    const params = {
      Bucket: 'motohat',
      Key: key,
      Body: processedImageBuffer,
      ACL: 'public-read',
    };

    await s3.upload(params).promise();

    const imageURL = `${spacesCDNURL}/${key}`;
    res.json({ success: true, imageURL });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Image upload failed" });
  }
};
