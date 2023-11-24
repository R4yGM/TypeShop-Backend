import sanitizedConfig from '../config';




import {
    S3Client,
    ListBucketsCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  

  const R2_BUCKET = "rep-bucket";
  
  const getR2Client = () => {
    return new S3Client({
        region: "auto",

        endpoint: `https://${sanitizedConfig.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    
        credentials: {
    
            accessKeyId: sanitizedConfig.R2_ACCESS_KEY,
    
            secretAccessKey: sanitizedConfig.R2_SECRET_KEY,
    
        },
    });
  };
  
  export default class S3 {
    static async get(fileName: string) {
      const file = await getR2Client().send(
        new GetObjectCommand({
          Bucket: R2_BUCKET,
          Key: fileName,
        }),
      );
  
      if (!file) {
        throw new Error("not found.");
      }
  
      return file.Body;
    }
  
    static async put(fileName: string, data: Buffer) {
      const signedUrl = await getSignedUrl(
        getR2Client(),
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: fileName,
        }),
        { expiresIn: 60 },
      );
  
      console.log(signedUrl);
  
      await fetch(signedUrl, {
        method: "PUT",
        body: data,
      });
  
      return `Success`;
    }
  }

export {S3}