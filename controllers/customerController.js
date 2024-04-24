require('dotenv').config()
const { S3Client, GetObjectCommand, PutObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl, S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");

const cognito = require('../services/cognito');
const { getNewFileName, isTimeGreaterThanFiveMinutes } = require('../utils/index');
const { v4: uuidv4 } = require('uuid');
const ROLE = require('../roles/index');
const chalk = require('chalk');

// S3 Client Setup here
const s3Client = new S3Client({
    signatureVersion: "v4",
});


exports.fileUpload = async(req, res) => {
    const filesData = JSON.parse(JSON.stringify(req.files));
    const eachFiles = Object.keys(filesData)[0];
    const updatedFileName = getNewFileName(filesData);
    const params = {
        Bucket: process.env.STORE_BUCKET_NAME,
        Key: req.headers['userid']+"/"+req.body.location+"/"+updatedFileName,
        Body: Buffer.from(filesData[eachFiles].data.data, "binary"),
        ContentType: filesData[eachFiles].mimetype
    };
    
    const options = {
        partSize: 5 * 1024 * 1024,
        queueSize: 5
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(params), options);

        // Construct the file upload location URL
        const fileLocation = `https://${params.Bucket}/${params.Key}`;
  
        res.send({
            status: 200,
            Location: fileLocation
        })
    } catch (error) {
        console.log('upload ERROR:' + error);
        res.send({
            error: error
        })
    }
}

exports.startUpload = async(req, res) => {
    try {
        const filesData = req.body.fileName;
        const mimetype = req.body.mimetype;
        let params = {
			Bucket: process.env.STORE_BUCKET_NAME,
            Key: req.headers['userid']+"/"+req.body.location+"/"+filesData,
          	ContentType: mimetype
        };

        const uploadData = await s3Client.send(new CreateMultipartUploadCommand(params));
        res.send({ 
            uploadId: uploadData.UploadId 
        });
    } catch(err) {
        res.status(400).send({
            error: "File upload failed !!!",
        });
    }
}

// Get Pre Sign URL
exports.generatePreSignURL = async(req, res) => {
    try {
        const data = JSON.parse(req.body.data);    

        let params = {
            Bucket: process.env.STORE_BUCKET_NAME,
            Key: req.headers['userid']+"/"+req.body.location+"/"+data.key,
            PartNumber: data.partNo,
            UploadId: data.uploadId
        }

        const presignedUrl = await getSignedUrl(s3Client, new UploadPartCommand(params));
        
        res.send({
            data: presignedUrl
        });
    } catch(err) {
        res.status(400).send({
            error: err
        })
    }

}

exports.completeUpload = async(req, res) => {
    try {
         let params = {
             Bucket: process.env.STORE_BUCKET_NAME,
             Key: req.headers['userid']+"/"+req.body.location+"/"+req.body.fileName,
             MultipartUpload: {
                 Parts: req.body.parts
             },
             UploadId: req.body.uploadId
         }
        
 
         const bucket = process.env.STORE_BUCKET_NAME;
         const objectKey = req.headers['userid']+"/"+req.body.location+"/"+req.body.fileName
         const fileUploadLocation = `https://${bucket}/${objectKey}`;
         
         const completeData = await s3Client.send(new CompleteMultipartUploadCommand(params));
         completeData.Location = fileUploadLocation;
         res.send({ data: completeData });
    } 
     
    catch(err)  {
        res.status(400).send({
            error: err
        })
    };
}

exports.sendVerificationCode = async(req, res) => {
    try {
      const result = await cognito.sendOTP_toUser(req.body);
      res.status(200).send(result);
    } catch(err) {
        res.status(400).send({
            message: err
        })
    }
}
