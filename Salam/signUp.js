let app = require("express")();
let http = require("http").Server(app)
let io = require ("socket.io")(http)
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
let port=9090

let obj=require("mongoose");
const { stringify } = require("qs");
obj.Promise=global.Promise
let url="mongodb://localhost:27017/meanstack"
const mogodboption=
    { useNewUrlParser: true, 
    useUnifiedTopology: true
}

//let mongoClient=require("mongodb").MongoClient


obj.connect(url,mogodboption)
let db=obj.connection
db.on("error",(err)=>console.log(err))
db.once("open",()=>{
    var EmpSchema=obj.Schema({
        EmpId:any,
        Fname:String,
        Lname:String,
        Email:any,
        Password:any
      
    });

  var Emp=obj.model("",EmpSchema,"Emp")
  


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signUp.html");
})


app.post("/",(req,res)=>{
    var mydata=new Emp({EmpId: req.body.EmpId, Fname:req.body.Fname,Lname:req.body.Lname, Email:req.body.Email,Password:req.body.Password})
    console.log(req.body)
    mydata.save((err,result)=>{
        if (!err){
            console.log("Record inserted sucessfully"+result)
        }else{
            console.log("err"+err)
        }
    
        })
        io.on("connection",(socket)=>{
            console.log("client connected to app")
            socket.on("Emp massage",(msg)=>{
                console.log(msg)
            })
        })
       //obj.disconnect()
    })
   
})



//app.listen(9090,()=>console.log("running.."));
http.listen(9090,()=>console.log('server run on 9090'))