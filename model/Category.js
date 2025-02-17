const mongoose=require("mongoose");
//do we need extra 
const CategorySchema=new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   description:{
    type:String,
    required:true,
   },
   course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
   }
   //its name has to change
});
module.exports=mongoose.model("Category",CategorySchema);