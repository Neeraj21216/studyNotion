const cloudinary=require("cloudinary");

exports.cloudinaryConnect=()=>{
    //it s a network call
    try {
        cloudinary.config(
            {
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
            
        }
    )
    } catch (error) {
        console.log("error in cloudinary connection");
        console.log(error);
        
    }
}