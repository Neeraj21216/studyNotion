const express=require("express");
const router=express.Router();

//import all controllers 
const {createCourse,showAllCourses,showCourseDetail}=require("../controller/Course");
//how can i make this 
const {auth,isAdmin,isInstructor,isStudent}=require("../middleware/auth");
//category
const {createCategory,showAllCategory} = require('../controller/Category');


//******************************************************************************************************* */
//                      Routes for Course                    
//****************************************************************************************************** */router.post("/createCourse",auth,isInstructor,createCourse);
router.post("/createCourse",auth,isInstructor,createCourse);
router.get("/showAllCourses",showAllCourses);
router.get("/showCourseDetail",showCourseDetail);


//******************************************************************************************************* */
//                      Routes for Categories                    
//****************************************************************************************************** */
router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategory",auth,isAdmin,showAllCategory);



//******************************************************************************************************* */
//                      Routes for Section                   
//****************************************************************************************************** */
const {
    createSection,
    updateSection, 
    deleteSection,
} = require('../controller/Section');

router.post("/createSection",auth,isInstructor,createSection);

router.post("/updateSection",auth,isInstructor,updateSection);
router.delete("/deleteSection",auth,isInstructor,deleteSection);




module.exports=router;

