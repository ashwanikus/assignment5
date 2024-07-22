const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const { Upload } = require('@aws-sdk/lib-storage');

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      stream.on('error', reject);
    });
  };

async function readJsonFromS3(key) {
    try {
        const command = new GetObjectCommand({ 
            Bucket: process.env.AWS_BUCKET_NAME, 
            Key: key 
        });
        const { Body } = await s3.send(command);
        const data = await streamToString(Body);
        return JSON.parse(data);
      } catch (error) {
        console.error('Error reading JSON from S3:', error);
        throw error;
      }
  }
  
  async function uploadPdfToS3(key, pdfStream) {
    try {
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${key}`,
            Body: pdfStream,
            ContentType: "application/pdf",
          },
        });
  
        upload.on("httpUploadProgress", (progress) => {
          console.log(progress);
        });
  
        await upload.done();
        console.log('Upload completed successfully');
      } catch (error) {
        console.error('Error uploading PDF to S3:', error);
        throw error;
      }
  }

module.exports = {readJsonFromS3, uploadPdfToS3};