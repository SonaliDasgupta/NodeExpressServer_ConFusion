const express= require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route("/").all((req, res, next)=>{
	res.statusCode= 200;
	res.setHeader("Content-Type","text/plain");
	next();
}).get((req, res, next)=>{
	res.end("will send all promotions");
}).post((req, res, next)=> {
	res.end('Will add the promotion: '+req.body.name+' with details: '+req.body.description);
}).put((req, res, next)=> {
	res.statusCode=405;
	res.end('PUT not supported on /promotions');
	
}).delete((req, res, next)=> {
	res.end('Deleting all promotions');
});

promoRouter.route("/:prId").get((req, res, next)=>{
	res.end("will send promotion: "+req.params.prId+" details");
}).post((req, res, next)=> {
	res.statusCode=405;
	res.end('POST not supported on /promotions/'+req.params.prId);
}).put((req, res, next)=> {
	res.write('Updating the promotion: '+req.params.prId+ '\n');
	res.end('Will update the promotion: '+req.body.name+ ' with details '+req.body.description);
	
}).delete((req, res, next)=> {
	res.end('Deleting promotion: '+req.params.prId);
});

module.exports = promoRouter;
