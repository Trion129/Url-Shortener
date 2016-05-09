var express = require("express");
var mongodb = require("mongodb");
var app = express();

app.get("/:param(*)",function(req,res){
	res.end(req.params.param);
	if(req.params.param.match(/^http:\/\/.*\.com\/?.*/i)){
		mongodb.MongoClient.connect(process.env.MONGO_URI
			,function(err,db){
				if(err){
					res.end("Error connecting to Database");
					return;
				}
				db.urls.insert({
					_id : process.env.index,
					url : req.params.param
				});
				process.env.index++;
				res.end(JSON.stringify({
					_id : process.env.index - 1,
					url : req.params.param
				}));
			});
	}
	else if(req.params.param.match(/^[0-9]+$/i)){
		mongodb.MongoClient.connect(process.env.MONGO_URI
			,function(err,db){
				if(err){
					res.end("Error connecting to database");
					return;
				}
				var myCursor = db.urls.find({_id: req.params.param});
				var arrayed = myCursor.toArray();
				res.redirect(arrayed[0].url);
				res.end();
			});
	}
	else{
		res.end(JSON.stringify({error : "The parameter is not url or short code"}));
	}
});

app.listen(process.env.PORT || 8080);