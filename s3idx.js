/*
** s3idx.js
** generates file index of AWS S3 Bucket dynamically
** 2016.10.26 ichino
*/

'use strict';

var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });
var myBucket = "my_bucket_name";
var idxFile = "files.txt";

exports.handler = function(event, context){
    //var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    //if (key != idxFile){
        var param = {
          Bucket: myBucket,
          MaxKeys: 1000,
        };
        var d = new Date();
        var str = d.toString() + "\n\n";
        s3.listObjects(param).eachPage(function(err, data){
            if(err){
                console.log(err);
            }else{
                if(data){
                    for(var obj of data.Contents){
                        str += obj.Key + "\n";
                    }
                }else{
                    //console.log(str);
                    var param = {
                        Bucket: myBucket,
                        Key: idxFile,
                        Body: str,
                        ContentType: "text/plain",
                    };
                    s3.putObject(param, function(err){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(idxFile + " successfully written");
                        }
                    });
                }
            }
        });
//}
};
