// const aws = require('aws-sdk');
// const multerS3 = require('multer-s3');
// const multer = require('multer');

// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   region: process.env.AWS_REGION,
// });

// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: 'your-bucket-name',
//     acl: 'public-read',
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `admin-profiles/${Date.now()}_${file.originalname}`);
//     },
//   }),
// });

// module.exports = upload;
