import { useEffect, useState } from "react";
import "./API.css";

function APICrud() {

    let [fname, setFname] = useState("");
    let [lname, setLname] = useState("");
    let [city, setCity] = useState("");
    let [email, setEmail] = useState("");
    let [id, setID] = useState(0);
    let [status, setStatus] = useState(true);
    let [studentData, setStudentData] = useState([]);

    const APIURL = "http://localhost:3003/students";

    // following function used to store data in API
    function storeData(event) {
        // check for process save / update
        event.preventDefault();
        if (status) {
            // add new data
            fetch(APIURL, {
                method: "POST",
                headers: {
                    "Content-type": "Application/JSON",
                    "Accept": "Application/JSON"
                },
                body: JSON.stringify({ fname, lname, city, email })
            }).then((response) => {
                response.json().then((result) => {
                    //alert("Data Inserted with ID "+result.id);
                    resetForm();
                    loadAllData();
                });
            });
        } else {
            // update data
            if(window.confirm("Are you sure to Update Data ?")){
                fetch(APIURL+"/"+id,{
                    method : "put",
                    headers : {
                        "Content-type" : "Application/json",
                        "Accept" : "Application/json"
                    },
                    body : JSON.stringify({fname, lname, city, email})
                }).then((response)=>{
                    response.json().then((result)=>{
                        resetForm();
                        loadAllData();
                    });
                });
            }
        }
    }

    // function for reset form
    function resetForm() {
        setFname("");
        setLname("");
        setCity("");
        setEmail("");
        setID(0);
        setStatus(true);
    }


    // function for load all data
    function loadAllData() {
        //alert(APIURL);
        fetch(APIURL,{
            mode : 'cors'
        }).then((response) => {
            //alert(response);
            response.json().then((result) => {
                setStudentData(result);
                //console.log(result);
            });
        });
    }

    useEffect(() => {
        loadAllData();
    }, []);


    // delete data
    function deleteData(stdid) {
        //alert(stdid);
        if (window.confirm("Are you sure to delete this Data ?")) {
            fetch(APIURL + "/" + stdid,{
                method : "DELETE"
            }).then((response) => {
                response.json().then((result) => {
                    //alert("Data Deleted with " + stdid + " ID");
                    loadAllData();
                });
            });
        }
    }

    function getDataforUpdate(stdid){
        //alert(stdid);
        fetch(APIURL+"/"+stdid).then((response)=>{
            response.json().then((result)=>{
                setFname(result.fname);
                setLname(result.lname);
                setCity(result.city);
                setEmail(result.email);
                setID(stdid);
                setStatus(false);
            });
        });
    }

    return <>
        <div className="container-fluid">
            <h1 className="text-bg-primary p-4">CRUD API Example</h1>

            <div className="row">
                <div className="col-md-3">
                    <form onSubmit={storeData}>
                        <div className="my-2 form-floating">
                            <input type="text" name="fname" id="fname" required autoFocus className="form-control" placeholder="Enter First Name" onChange={(event) => setFname(event.target.value)} value={fname}></input>
                            <label className="form-label" htmlFor="fname">Enter First Name</label>
                        </div>
                        <div className="my-2 form-floating">
                            <input type="text" name="lname" id="lname" required className="form-control" placeholder="Enter Last Name" onChange={(event) => setLname(event.target.value)} value={lname}></input>
                            <label className="form-label" htmlFor="lname">Enter Last Name</label>
                        </div>
                        <div className="my-2 form-floating">
                            <input type="text" name="city" id="city" required className="form-control" placeholder="Enter City Name" onChange={(event) => setCity(event.target.value)} value={city}></input>
                            <label className="form-label" htmlFor="city">Enter City Name</label>
                        </div>
                        <div className="my-2 form-floating">
                            <input type="email" name="email" id="email" required className="form-control" placeholder="Enter Email Address" onChange={(event) => setEmail(event.target.value)} value={email}></input>
                            <label className="form-label" htmlFor="email">Enter Email Address</label>
                        </div>
                        <div className="my-2">
                            {
                                (status) ?
                                    <>
                                        <input type="submit" value="Add Data" className="btn btn-primary"></input>
                                        <input type="reset" value="Reset" className="btn btn-danger mx-2"></input>
                                    </>
                                    :
                                    <>
                                        <input type="submit" value="Save Data" className="btn btn-primary"></input>
                                        <input type="button" value="Cancel" className="btn btn-danger mx-2" onClick={() => setStatus(true)}></input>
                                    </>
                            }

                        </div>
                    </form>
                </div>
                <div className="col-md-9">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>City</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    studentData.map((student) => <tr>
                                        <td>{student._id}</td>
                                        <td>{student.fname}</td>
                                        <td>{student.lname}</td>
                                        <td>{student.city}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            <button className="btn btn-primary" type="button"><i className="fa fa-pen" onClick={()=>getDataforUpdate(student._id)}></i></button>
                                            <button className="btn btn-danger mx-2" type="button"><i className="fa fa-trash" onClick={() => deleteData(student._id)}></i></button>
                                        </td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default APICrud;