import express from "express"
const router=new express.Router();
router.get("/:type",(req,res) => {
    const renderObject = {
        logged_in: false,
        user: '',
        bucket_name: process.env.AWS_BUCKET_NAME,
        dump_name: process.env.AWS_DUMP_NAME,
        type: req.params.type,
    };
    if (req.isAuthenticated()) {
        renderObject.logged_in = true;
        renderObject.user = req.user.user;
    }
    return res.render("forms/template.ejs",renderObject)
})

export default router;