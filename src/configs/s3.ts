// import {
//   DeleteObjectCommand,
//   GetObjectCommand,
//   PutObjectCommand,
//   S3Client,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import CryptoJS from "crypto-js";

// import { IDocument } from "../types/interfaces";

// import env from "./env";

// const bucketName = env.S3_BUCKET_NAME;
// const region = env.S3_BUCKET_REGION;
// const accessKeyId = env.S3_ACCESS_KEY;
// const secretAccessKey = env.S3_SECRET_ACCESS_KEY;
// const encryptionKey = env.ENCRYPTION_KEY;

// export const s3 = new S3Client({
//   credentials: {
//     accessKeyId,
//     secretAccessKey,
//   },
//   region,
// });

// const encryptFilename = (filename: string) => {
//   return CryptoJS.AES.encrypt(filename, encryptionKey).toString();
// };

// export const decryptFilename = (encryptedFilename: string) => {
//   const bytes = CryptoJS.AES.decrypt(encryptedFilename, encryptionKey);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

// export const getSignedURI = async (encryptedFilename: string) => {
//   const Key = decryptFilename(encryptedFilename);
//   try {
//     const params = {
//       Bucket: bucketName,
//       Key,
//     };
//     const command = new GetObjectCommand(params);
//     const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
//     return url;
//   } catch (error) {
//     throw error;
//   }
// };

// // export const getPublicURL = (encryptedFilename: string) => {
// //   if (!encryptedFilename) return "";

// //   const filename = decryptFilename(encryptedFilename);
// //   return `https://${bucketName}.s3.amazonaws.com/${filename}`;
// // };

// export const getPublicURL = (encryptedFilename: string) => {
//   if (!encryptedFilename) return "";

//   const filename = decryptFilename(encryptedFilename);

//   // Use encodeURIComponent to handle spaces and other special characters
//   const encodedFilename = encodeURIComponent(filename).replace(/%20/g, "+");

//   return `https://${bucketName}.s3.amazonaws.com/${encodedFilename}`;
// };


// export const uploadFileToS3 = async (
//   folderName: string,
//   file: Express.Multer.File,
//   fileName = "",
// ) => {
//   const allowedImageMimeTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/gif",
//     "image/bmp",
//     "image/svg",
//     "application/pdf",
//   ];

//   if (!allowedImageMimeTypes.includes(file.mimetype)) {
//     throw new Error(`Unsupported file type: ${file.mimetype}`);
//   }

//   const uniqueFileName = `${folderName}/${fileName}`;

//   const encryptedFileName = encryptFilename(uniqueFileName);

//   const params = {
//     Bucket: bucketName,
//     Key: uniqueFileName,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   try {
//     await s3.send(new PutObjectCommand(params));

//     return {
//       url: encryptedFileName,
//       metadata: {
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size,
//         filename: file.filename,
//       },
//     };
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     throw error;
//   }
// };

// export const uploadFilesToS3 = async (
//   folderName: string,
//   files: Express.Multer.File[],
// ) => {
//   const uploadPromises = [];
//   const allowedImageMimeTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/gif",
//     "image/bmp",
//     "image/svg",
//     "application/octet-stream",
//   ];
//   const allowedVideoMimeTypes = [
//     "video/mp4",
//     "video/mpeg",
//     "video/quicktime",
//     "video/webm",
//     "video/mov",
//     "video/avi",
//     "video/mkv",
//     "video/wmv",
//   ];
//   const allowedDocumentMimeTypes = [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "text/plain",
//     "application/rtf",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "application/vnd.ms-powerpoint",
//     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//     "application/vnd.oasis.opendocument.text",
//     "application/vnd.oasis.opendocument.spreadsheet",
//     "application/vnd.oasis.opendocument.presentation",
//     "text/html",
//     "application/xml",
//   ];

//   const maxImageCount = 26;
//   const maxVideoSizeMB = 100;
//   const maxDocumentSizeMB = 25;

//   const publicUrls: IDocument[] = [];

//   for (const file of files) {
//     if (allowedImageMimeTypes.includes(file.mimetype)) {
//       if (uploadPromises.length >= maxImageCount) {
//         console.error(`Too many images. Maximum allowed: ${maxImageCount}`);
//         continue;
//       }
//     } else if (allowedVideoMimeTypes.includes(file.mimetype)) {
//       const fileSizeMB = file.size / (1024 * 1024);
//       if (fileSizeMB > maxVideoSizeMB) {
//         console.error(
//           `Video file size exceeds maximum allowed (${maxVideoSizeMB}MB)`,
//         );
//         continue;
//       }
//     } else if (allowedDocumentMimeTypes.includes(file.mimetype)) {
//       const fileSizeMB = file.size / (1024 * 1024);
//       if (fileSizeMB > maxDocumentSizeMB) {
//         console.error(
//           `Document file size exceeds maximum allowed (${maxDocumentSizeMB}MB)`,
//         );
//         continue;
//       }
//     } else {
//       console.error(`Unsupported file type: ${file.mimetype}`);
//       continue;
//     }

//     const uniqueFileName = `${folderName}/${file.originalname}`;
//     const encryptedFileName = encryptFilename(uniqueFileName);

//     publicUrls.push({
//       url: encryptedFileName,
//       metadata: {
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size,
//         filename: file.filename,
//       },
//     });

//     const params = {
//       Bucket: bucketName,
//       Key: uniqueFileName,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     const uploadPromise = s3.send(new PutObjectCommand(params));
//     uploadPromises.push(uploadPromise);
//   }

//   try {
//     await Promise.all(uploadPromises);
//     return publicUrls;
//   } catch (error) {
//     console.error("Error uploading files:", error);
//     throw error;
//   }
// };

// export const deleteFileFromS3 = async (urlToDelete: string) => {
//   const decreyptedUrl = decryptFilename(urlToDelete);
//   const params = {
//     Bucket: bucketName,
//     Key: decreyptedUrl,
//   };

//   try {
//     await s3.send(new DeleteObjectCommand(params));
//     return true;
//   } catch (error) {
//     console.error("Error deleting file:", error);
//     throw error;
//   }
// };
