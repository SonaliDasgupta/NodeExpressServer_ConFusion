const express= require('express');
const bodyParser = require('body-parser');
const authenticate= require('../authenticate');
const cors= require('./cors');

const promoRouter = express.Router();
const Promotions = require('../models/promotions');
promoRouter.use(bodyParser.json());
promoRouter.route("/")
.options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200); })
.get(cors.cors, (req, res, next)=>{
	Promotions.find({})
	.then((promos)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promos);
	},(err)=> next(err))
	.catch((err)=> next(err));
}).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
	if(!authenticate.verifyAdmin(req.user)){
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');
		return;
	}
	Promotions.create(req.body)
	.then((promo)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promo);
	},(err)=>next(err))
	.catch((err)=> console.log(err));
}).put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
	res.statusCode=405;
	res.end('PUT not supported on /promotions');
	
}).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
	if(!authenticate.verifyAdmin(req.user)){
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');
		return;
	}
	Promotions.remove({})
	.then((resp)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err)=>next(err))
	.catch((err)=>next(err));
});

promoRouter.route("/:prId")
.options(cors.corsWithOptions, (req,res)=> {res.sendStatus(200); })
.get(cors.cors, (req, res, next)=>{
	Promotions.findById(req.params.prId)
	.then((promo)=>{
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(promo);
	},(err)=>next(err))
	.catch((err)=> next(err));
}).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {

	res.statusCode=405;
	res.end('POST not supported on /promotions/'+req.params.prId);
}).put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
	if(!authenticate.verifyAdmin(req.user)){
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');
		return;
	}
	
	Promotions.findByIdAndUpdate(req.params.prId, {$set: req.body}, {new: true})
	.then((promo)=>{
		res.statusCode= 200;
		res.setHeader('Content-Type','application/json');
		res.json(promo);
	},(err)=>next(err))
	.catch((err)=> next(err));
	
}).delete(cors.corsWithOptions,  authenticate.verifyUser,  (req, res, next)=> {
	if(!authenticate.verifyAdmin(req.user)){
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');
		return;
	}
	
	Promotions.findByIdAndRemove(req.params.prId)
	.then((resp)=> {
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err)=> next(err))
	.catch((err)=>next(err));
});

module.exports = promoRouter;
