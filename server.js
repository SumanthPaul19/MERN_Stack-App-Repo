//create express app
const exp=require('express')
const app=exp();
const path=require("path")

//connect frontend and backend
app.use(exp.static(path.join(__dirname,'./build/')))

//imports apis
const userApi=require("./APIS/user-api")
const productApi=require("./APIS/product-api")
const adminApi=require("./APIS/admin-api")

//evaluate path to execute specific api based on path
app.use("/user",userApi)
app.use("/product",productApi)
app.use("/admin",adminApi)

//for page reload  error 
app.get('/*', (req, res)=> {
    
    res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

//get mongo client
const mc=require("mongodb").MongoClient;

//database Url
//const databaseUrl="mongodb+srv://sumanthpaul:sumanthpaul@cluster0.uu9fv.mongodb.net/Trainingdb?retryWrites=true&w=majority"

const databaseUrl="mongodb://sumanthpaul:sumanthpaul@cluster0-shard-00-00.uu9fv.mongodb.net:27017,cluster0-shard-00-01.uu9fv.mongodb.net:27017,cluster0-shard-00-02.uu9fv.mongodb.net:27017/Trainingdb?ssl=true&replicaSet=atlas-y8k7y4-shard-0&authSource=admin&retryWrites=true&w=majority"

//connect to db
mc.connect(databaseUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
    if(err){
        console.log("Error in the db connection",err)
    }
    else{
        //get database object
        databaseObj = client.db("Trainingdb")

        //create collection Obj
        let userCollectionObj=databaseObj.collection("usercollection")
        let productCollectionObj=databaseObj.collection("productcollection")
        let adminCollectionObj=databaseObj.collection("admincollection")

        //sharing collection to API's
        app.set("userCollectionObj",userCollectionObj)
        app.set("productCollectionObj",productCollectionObj)
        app.set("adminCollectionObj",adminCollectionObj)

        console.log("Database connected...")
    }
})


//handling unavailble paths
app.use((req,res,next)=>{
    res.send({message:`path ${req.url} is not matched`})
})

//error handling middleware(for syntax errors)
app.use((err,req,res,next)=>{
    res.send({message:err.message})
})




//assign port number
const port=8080;
app.listen(port,()=>console.log(`Server running on port ${port}...`))