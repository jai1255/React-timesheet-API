var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://surya:surya@ds149700.mlab.com:49700/hyrtimesheet',['users']);

router.get('/users', function(req, res, next){
    db.users.find(function(err, tasks){
        if(err){
            res.send(err);
        }
        res.json(tasks);
    });
});

router.put('/checkuser', function(req, res, next){
    var user = req.body;
    console.log(user);
    db.users.findOne({email:user.email, password:user.password},function(err, user){
        if(err){
            res.send(err);
            console.log(err);
        }
        
        res.json(user);
    });

});
router.put('/saveuser', function(req, res, next){
    var emp = req.body;
    console.log(emp.email);
    console.log(emp.firstname);
    console.log(emp.password);
     var senderEmail = emp.email;
  var helper = require('sendgrid').mail;
  var from_email = new helper.Email('bhar4th@gmail.com');
  var to_email = new helper.Email(senderEmail);
  var subject = 'Hyr time sheet';
  var content = new helper.Content('text/plain', 'Hello ' + emp.firstname + ',\n you can login http://www.hyrglobalsource.com/ \n E-mail:'  + emp.email + ',\n Password :' + emp.password);
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')("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");
  var request = sg.emptyRequest({
    method: 'POST',
    path: 'https://api.sendgrid.com/v3/mail/send',
    body: mail.toJSON(),
  });
  sg.API(request, function (error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
  console.log("Mailed");
    db.users.save({emp},function(err, user){
        if(err){
            res.send(err);
            console.log(err);
        }
        
        res.json(emp);
    });

});

//add timesheets for user
router.put('/updateTimesheets', function(req, res, next){
    var data = req.body;
   
    if(!data){
        res.status(400);
        res.json({
            "error":"bad Data"
        });
    }else{
        db.users.update({_id: mongojs.ObjectId(data.userId)},
                        { $addToSet: { timesheets: { $each:data.timesheets } } },{} , 
                        function(err, resp){
                            if(err){
                                res.send(err);
                            }
                            res.json(resp);
        });
    }
    
});


module.exports = router;