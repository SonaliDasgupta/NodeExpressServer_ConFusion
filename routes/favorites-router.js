const express= require('express');
const bodyParser= require('body-parser');
const mongoose= require('mongoose');
const cors= require('./cors');
const authenticate= require('../authenticate');

const Favorites = require('../models/favorites');
const favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json());



favoritesRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res)=>{ res.statusCode= 200; })
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
	
	Favorites.findOne({user: req.user})
	.populate('user')
	.populate('dishes')
	.then((favorite)=>{
		//console.log("user : "+req.user._id+" type: "+typeof(req.user._id));
		if(favorite!=null){
		console.log("for username: "+favorite.user.username);
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);
	}
	else{
		res.statusCode=200;
		res.end('You have no favorites');
	}
	}
	
	, (err) => next(err)).catch((err)=> next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	Favorites.findOne({user: req.user})
	.then((favorite)=>{
	if(favorite==null){
		Favorites.create({user: req.user}).then((favorite)=>{
			for(var i=0; i< req.body.length; i++){
		favorite.dishes.push(req.body[i]);
	}
	favorite.save().then((favorite)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);
	},(err)=> next(err))
	.catch((err)=> next(err));
	},(err)=>next(err))
	.catch((err)=>next(err));	
		}
		else{
	for(var i=0; i< req.body.length; i++){
		favorite.dishes.push(req.body[i]);
	}
	favorite.save().then((favorite)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);
	},(err)=> next(err))
	.catch((err)=>next(err))
}
	
},((err)=>next(err)))
	.catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	res.statusCode= 405;
	res.end('PUT not allowed on /favorites endpoint');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	
	Favorites.remove({user: req.user}).then((favorite)=>{
		res.statusCode= 200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);

}, (err)=> next(err))
	.catch((err)=> next(err));
});


favoritesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res)=>{ res.statusCode= 200; })
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
	Favorites.findOne({user: req.user})
	.populate('user')
	.populate('dishes').then((favorite)=>{
		
				
				for(var j=0; j<favorite.dishes.length;j++){
					if(favorite.dishes[j]._id.equals(req.params.dishId)){
						res.statusCode= 200;
						res.setHeader('Content-Type','application/json');
						res.json(favorite.dishes[j]);
						return;
					}
				}
				
					res.statusCode=403;
					
					res.end('Could not find the dish in your favorites list');
				
			}
		
	, (err)=> next(err))
	.catch((err)=> next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	Favorites.findOne({user: req.user}).then((favorite)=>{

		console.log('favorite for '+req.user+" is "+favorite);
		if(favorite){
		console.log('user found with username: '+favorite._id);
		if(favorite.dishes!=null && favorite.dishes.lastIndexOf(req.params.dishId)==-1){
		favorite.dishes.push(req.params.dishId);
		favorite.save().then((favorite)=> {
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json(favorite);
		}, (err)=>next(err))
		.catch((err)=> next(err));
		}
	}
		else{
		Favorites.create({user: req.user})
	.then((favorite)=>{
		console.log("Created favorite: ",favorite);
		
		favorite.dishes.push(req.params.dishId);
		favorite.save().then( (favorite)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);	
		}, (err)=> next(err));
		
	}, (err)=>next(err)).catch((err)=> next(err));
	

		}

}, (err)=> next(err))})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	res.statusCode= 405;
	res.end('PUT not allowed on /favorites/'+req.params.dishId+' endpoint');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
	Favorites.findOne({user: req.user})
	.then((favorite)=>{
		
				favorite.dishes.remove(req.params.dishId);
				favorite.save()
				.then((favorite)=>{
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json(favorite);
				},(err)=> next(err))
				.catch((err)=> next(err));
			},(err)=>next(err))
	.catch((err)=> next(err));
});
			
		
	

module.exports= favoritesRouter;