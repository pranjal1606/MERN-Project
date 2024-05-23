const mongooese = require("mongoose");
mongooese.connect("mongodb://localhost/MERN_project");
const express = require("express");
const application = express();
const bodyparser = require("body-parser");
const cors = require("cors");

application.use(bodyparser.json());
application.use(bodyparser.urlencoded({extended : true}));

const studentScheme = mongooese.Schema({
    fname : String,
    lname : String,
    city : String,
    email : String
});

const student = mongooese.model("students", studentScheme);

application.use(cors());

application.get("/students", (request, response)=>{
    student.find().then((success)=>{
        response.json(success);
        //console.log(success);
    }, (err)=>{
        response.json({"error": "Error while searching Data"});
    });
});

application.get("/students/:id", (request, response)=>{
    console.log(request.params.id);
    student.findById(request.params.id).then((success)=>{
        response.json(success);
    }, (err)=>{
        response.json({"error": "Error while searching Data"});
    });
});

application.post("/students", (request, response)=>{
    const studentInfo = request.body;
    const newstudent = new student({
        fname : studentInfo.fname,
        lname : studentInfo.lname,
        city : studentInfo.city,
        email : studentInfo.email
    });

    newstudent.save().then((success)=>{
        response.json({"message" : "new Student Created", type : "success", student : studentInfo});
    }, (err)=>{
        response.json({"message" : "Error while insert new Student", type : "error"});
    });
});

application.put("/students/:id", (request, response)=>{
    student.findByIdAndUpdate(request.params.id, {
        "fname":request.body.fname,
        "lname": request.body.lname,
        "city":request.body.city, 
        "email":request.body.email
    }).then((success)=>{
        response.json({"success":"Data Updated with ID "+request.params.id});
    }, (err)=>{
        response.json({"error": "Error while Updating Data"+err});
    });
});

application.delete("/students/:id", (request, response)=>{
    student.deleteOne({_id : request.params.id}).then((success)=>{
        response.json({"success":"Data Deleted with ID "+request.params.id});
    }, (err)=>{
        response.json({"error": "Error while Deleting Data"+err});
    });
});

/*application.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});*/

application.listen(3003);