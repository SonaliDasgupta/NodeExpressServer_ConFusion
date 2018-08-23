const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');
const cors= require('./cors');
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route("/").options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200); }).get(cors.cors, (req, res, next)=>{
	Leaders.find(req.query)
	.then((leaders)=>{
		res.statusCode= 200;
		res.setHeader('Content-Type','application/json');
		res.json(leaders);
	},(err)=>next(err))
	.catch((err)=> next(err));
}).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
	if(!authenticate.verifyAdmin(req.user)){
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');
		return;
	}
	
	Leaders.create(req.body)
	.then((leader)=>{
		res.statusCode= 200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=> next(err))
	.catch((err) => next(err));
}).put(cors.corsWithOptions, authenticate.verifyUser ,  (req, res, next)=> {
	res.statusCode=405;
	res.end('PUT not supported on /leaders');
	
}).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
	if(!authenticate.verifyAdmin(req.user)){
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');
		return;
	}
	
	Leaders.remove({})
	.then((resp)=>{
		res.statusCode= 200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err)=> next(err))
	.catch((err)=> next(err));
});

leaderRouter.route("/:leaderId").options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200); })
.get(cors.cors, (req, res, next)=>{
	Leaders.findById(req.params.leaderId)
	.then((leader)=>{
		res.statusCode= 200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=> next(err))
	.catch((err)=> next(err));
}).post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {

	res.statusCode=405;
	res.end('POST not supported on /leaders/'+req.params.leaderId);
}).put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next)=> {
	if(!authenticate.verifyAdmin(req.user)){
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');
		return;
	}
	
	Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body},{new: true})
	.then((leader)=>{
		res.statusCode= 200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=> next(err));
	
}).delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
	if(!authenticate.verifyAdmin(req.user)){
		res.statusCode=403;
		res.end('Unauthorized : need admin rights');
		return;
	}
	
	Leaders.findByIdAndRemove(req.params.leaderId)
	.then((resp)=>{
		res.statusCode= 200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err)=> next(err))
	.catch((err)=> next(err));
});

module.exports = leaderRouter;