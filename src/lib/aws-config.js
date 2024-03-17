const { S3 } = require('@aws-sdk/client-s3');
const s3 = new S3({
    credentials: {
        accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
    signatureVersion: 'v4',
});

module.exports = s3;