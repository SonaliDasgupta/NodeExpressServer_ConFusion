var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy= require('passport-jwt').Strategy;
var ExtractJWT= require('passport-jwt').ExtractJwt;
var jwt= require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');

var config= require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
	return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

var opts= {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport= passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
	console.log("Payload: ",jwt_payload);
	User.findOne({_id: jwt_payload._id}, (err, user)=>{
		if(err){
			console.log("Error : ",err);
			return done(err, false);
		}
		else if(user){
			console.log("Found user");
			return done(null, user);
		}
		else{
			console.log("Not found user");
			return done(null, false);
		}
	})

}));

exports.verifyUser= passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (user)=>{
/*	User.find({'username': user.username}).then((userfound)=>{
		console.log('found user with id : ',userfound.firstname);*/
		return user.admin==true;
/*	},(err)=> next(err))
	.catch((err)=> next(err));*/

	
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({

	clientID: config.facebook.clientId,
	clientSecret: config.facebook.clientSecret
	},
	(accessToken, refreshToken, profile, done)=>{
		User.findOne({facebookId: profile.id}, (err,user)=>{
			if(err){

				return done(err, false);
			}
			else if(user!=null){
				console.log("User found");
				return done(null, user);
			}
			else{
				console.log("saving user");
				user= new User({ username: profile.displayName});
				user.facebookId= profile.id;
				user.firstname = profile.name.givenName;
				user.lastname= profile.name.familyName;
				user.save((err, user)=>{
					if(err){
						return done(err, false);
					}
					else{
						return done(null, user);
					}
				});
			}
		});
	}
));