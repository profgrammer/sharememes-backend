const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const uploadFile = (filePath, fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err)  reject(err);
            try {
                const params = {
                    Bucket: process.env.S3_BUCKET,
                    Key: `media/${Date.now()}_${fileName}`,
                    Body: data,
                    ACL:'public-read',
                    ContentType: 'image/jpeg',
                    ContentDisposition: 'inline'
                };
                s3.upload(params, function(err, uploadedData) {
                    if(err) reject(err);
                    fs.unlinkSync(filePath);
                    resolve(uploadedData.Location);
                });
            } catch(err) {
                reject(err);
            }
        });
    });
};

module.exports = () => {
    return {uploadFileToS3: uploadFile};
};