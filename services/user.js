const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const client = new DynamoDBClient({ region: process.env.REGION });
const tableName = process.env.PROD_USERS;
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");


// Initialize the S3 client with IAM role-based credentials
const s3Client = new S3Client({ region: process.env.REGION });

