'use strict';

console.log('Loading function');

var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });
var idxFile = "files.txt";

exports.handler = function(event, context){
    var bucket = event.Records[0].s3.bucket.name;
    var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    var params = {
        Bucket: bucket,
        Key: key,
    };
    s3.getObject(params, function(err, data){
        var msg;
        if (err) {
            console.log(err);
            msg = "Error getting object " + key + " from bucket " + bucket + ".";
            console.log(msg);
            //context.fail(msg);
        } else {
            if (key != idxFile){
                s3.listObjects({Bucket: 'test-icn'}, function(err, data){
                    if(err){
                        msg = "Error listing objects ... " ;
                        console.log(msg);
                    }else{
                        var arr = [];
                        for(var obj of data.Contents){
                            arr.push(obj.Key);
                        }
                        var str = arr.join("\n");
                        //console.log(str);
                        var param = {
                            Bucket: "test-icn",
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
                });
            }
        }
    });
};
