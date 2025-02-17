const express = require("express");
const router = express.Router();

const {updateProfile,updateDisplayPicture,deleteAccount,getAllUserDetails}=require("../controller/Profile");const { get } = require("mongoose");
4
const {auth}=require("../middleware/auth");

//******************************************************************************** */
//                      Routes for Profile
//********************************************************************************** */

router.put("/updateProfile",auth,updateProfile);
router.put("/updateDisplayPicture",auth,updateDisplayPicture);
router.delete("/deleteAccount",auth,deleteAccount);
router.get("/getAllUserDetails",auth,getAllUserDetails);
module.exports=router;

