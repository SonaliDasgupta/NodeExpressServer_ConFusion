const express= require('express');
const bodyParser= require('body-parser');
const multer=require('multer');
const authenticate = require('../authenticate');
const cors= require('./cors');
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

const storage= multer.diskStorage(
	{
		destination: (req, file, cb)=>{
			cb(null, 'public/images');
		},
		filename: (req, file, cb)=>{
			cb(null, file.originalname)
		}
	});

const imageFileFilter = (req, file, cb)=>{

	if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
		return cb(new Error('You can upload only image files'), false);
	}
	cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();
uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res)=> {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
res.statusCode=403;
res.end('GET not supported on /imageUpload')
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
res.statusCode=403;
res.end('PUT not supported on /imageUpload')
}).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
res.statusCode=403;
res.end('DELETE not supported on /imageUpload')
})
.post(cors.corsWithOptions, authenticate.verifyUser,  upload.single('ImageFile'), (req, res)=>{
if(!authenticate.verifyAdmin(req.user)){
		unlinkAsync(req.file.path);
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');

		return;
	}
	
	res.statusCode= 200;
	res.setHeader('Content-Type','application/json');
	res.json(req.file);


	

});

uploadRouter.use(bodyParser.json());




module.exports= uploadRouter;
