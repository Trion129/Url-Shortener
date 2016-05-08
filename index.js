var express = require("express");
var mongodb = require("mongodb");
var app = express();

app.get("/:param",function(req,res){
	if(req.param.param.match(/^http:\/\/.*\.com\/?.*/i)){
		mongodb.MongoClient.connect(process.env.MONGO_URI
			,function(err,db){
				if(err){
					res.end("Error connecting to Database");
					return;
				}
				db.urls.insert({
					_id : process.env.index,
					url : req.param.param
				});
				process.env.index++;
				res.end(JSON.stringify({
					_id : process.env.index - 1,
					url : req.param.param
				}));
			});
	}
	else if(req.param.param.match(/^[0-9]+$/i)){
		mongodb.MongoClient.connect(process.env.MONGO_URI
			,function(err,db){
				if(err){
					res.end("Error connecting to database");
					return;
				}
				var myCursor = db.urls.find({_id: req.param.param});
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