var express = require("express");
var mongodb = require("mongodb");
var shortid = require("shortid");
var app = express();

app.get("/:param(*)",function(req,res){
	if(req.params.param.match(/^http:\/\/.*\.com\/?.*/i)){
		mongodb.MongoClient.connect(process.env.MONGO_URI || "mongodb://trion:paintball@ds017432.mlab.com:17432/mymongo"
			,function(err,db){
				if(err){
					res.end("Error connecting to Database");
					return;
				}
				var urls = db.collection("urls");
				var genid = shortid.generate();
				urls.find({url: req.params.param}).limit(1).next(function(err,data){
					if(!data){
						urls.insert({
							_id : genid,
							url : req.params.param
						});
						res.end(JSON.stringify({
							_id : genid,
							url : req.params.param
						}));
						return;
					}
					res.end(JSON.stringify(data));
				})
			});
	}
	else if(shortid.isValid(req.params.param)){
		mongodb.MongoClient.connect(process.env.MONGO_URI || "mongodb://trion:paintball@ds017432.mlab.com:17432/mymongo"
			,function(err,db){
				if(err){
					res.end("Error connecting to database");
					return;
				}
				var urls = db.collection("urls");
				urls.find({_id: req.params.param}).limit(1).next(function(err,data){
					if(err){
						res.end("Error getting data");
						return;
					}
					res.redirect(data.url);
					res.end();
				});
			});
	}
	else{
		res.end(JSON.stringify({error : "The parameter is not url or short code"}));
	}
});

app.listen(process.env.PORT || 8080);