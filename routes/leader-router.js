const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route("/").all((req, res, next)=>{
	res.statusCode= 200;
	res.setHeader("Content-Type","text/plain");
	next();
}).get((req, res, next)=>{
	res.end("will send all leaders");
}).post((req, res, next)=> {
	res.end('Will add the leader: '+req.body.name+' with details: '+req.body.description);
}).put((req, res, next)=> {
	res.statusCode=405;
	res.end('PUT not supported on /leaders');
	
}).delete((req, res, next)=> {
	res.end('Deleting all leaders');
});

leaderRouter.route("/:leaderId").get((req, res, next)=>{
	res.end("will send leader: "+req.params.leaderId+" details");
}).post((req, res, next)=> {
	res.statusCode=405;
	res.end('POST not supported on /leaders/'+req.params.leaderId);
}).put((req, res, next)=> {
	res.write('Updating the leader: '+req.params.leaderId+ '\n');
	res.end('Will update the leader: '+req.body.name+ ' with details '+req.body.description);
	
}).delete((req, res, next)=> {
	res.end('Deleting leader: '+req.params.leaderId);
});

module.exports = leaderRouter;