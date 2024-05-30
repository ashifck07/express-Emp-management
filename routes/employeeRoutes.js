const upload=require("../middleware/multer")
const express=require("express");
const router=express.Router();
const {
    getEmployees,
    deleteEmployee,
    getEmployee,
    updateEmployee,
    createEmployee,
    mainHome,
    postavatar,
    viewPage
                    }=require("../controllers/employeeControllers");

router.route("/dashboard").get(mainHome);
router.route("/view.html?").get(viewPage);
router.route("/").get(getEmployees).post(createEmployee);
router.route("/:id").get(getEmployee).put(updateEmployee).delete(deleteEmployee)

router.post("/:id/avatar",upload.single("avatar"),postavatar)

module.exports=router;