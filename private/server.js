var express = require('express');
var path = require('path');
var read = require('fs-readdir-recursive');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 8080;

var paths = read('../public/');
console.log(paths);

function fileOb(name, path, data){
    this.name = name;
    this.path = path;
    this.data = data;
}

function getNameFromPath(path){
    var last = path.lastIndexOf('/');
    if(last == -1)
        return path;
    else
        return path.slice(last+1, path.length);
}

function makeContent(paths){
   var result = [];
   paths.forEach(function(item){
       var ob = new fileOb(getNameFromPath(item), '../public/' + item, null);
       result.push(ob)
   });
   return result;
}

var content = makeContent(paths);
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res, next){
    res.status(200);
    content.forEach(function(item){
        if('index.html' == item.name){
            res.status(200);
            if(!item.data)
               item.data = fs.readFileSync(item.path); 
            res.end(item.data)
        }
    });
    next();
});

app.get('/:fileName', function(req, res, next){
    var name = req.params.fileName;
    content.forEach(function(item){
        if(name == item.name){
            res.status(200);
            if(!item.data){
               item.data = fs.readFileSync(item.path); 
               console.log('file being read now');
            }
            res.end(item.data)
        }
    });
    next();
});

app.get('*', function(req, res, next){
    res.status(404);
    res.end("PAGE NOT FOUND");
});



app.listen(port);
