import express from "express";
import Session, { compareSessions } from "../model/schema/session.js";
const router = express.Router();

router.get("/fromtutor/:tutor",async (req,res) => {
    var tutor=req.params.tutor;

    var results=await Session.find({tutor}).sort("begin").lean();
    res.status(200).json(results);
})

router.get("/fromstudent/:student",async (req,res) => {
    var student=req.params.student

    var results=await Session.find({student}).sort("begin").lean();
    res.status(200).json(results);
})

router.get("/fromsubject/:subject", async (req,res) => {
    const subjects = req.params.subject.split("|");
    
    const sessions = await Session.find({
        $and: [{
            student: "",
        }],

        $or: subjects.map(subject => ({subject})),
    })
            .sort("begin")
            .lean()
            .select("_id begin duration tutor subject student");
    res.status(200).json(sessions);
})

router.get("/", async (request, response) => {
    const subjects = request.query.subject?.split("|") ?? null;
    const open = request.query.open !== undefined ? request.query.open !== "0" : null;
    const tutors = request.query.tutor?.split("|") ?? null;
    const students = request.query.student?.split("|") ?? null;
    const afterDate = request.query.afterDate ?? null;

    const sessions = (await Session.find({
        $and: [
            subjects ? {
                $or: subjects.map(subject => ({subject})),
            } : {},
            open !== null
                    ? open
                            ? {$or: [
                                {student: ""},
                                {student: request.user?.user},
                            ]}
                            : {student: {$ne: ""}}
                    : {},
            tutors ? {
                $or: tutors.map(tutor => ({tutor})),
            } : {},
            students ? {
                $or: students.map(student => ({student})),
            } : {},
            afterDate ? {
                $or: [
                    {startDate: {$gte: afterDate}},
                    {startDate: undefined},
                ]
            } : {},
        ],
    })
            // .lean()
            .select("_id begin duration tutor subject student startDate confirmed")
    )
            .sort(compareSessions(request.user?.user));
    response.status(200).json(sessions.map(session => session.toJSON({virtuals: true})));
})

router.post("/", async (req,res) => {
    try {
        if (!req.isAuthenticated()) return res.status(401).json({message:"Not logged in!"});
    
        if (!req.user.isTutor) return res.status(401).json({message:"You don't have enough permissions!"});

        const session = new Session({
            begin: req.body.begin,
            duration: req.body.duration,
            tutor: req.user.user,
            subject: req.body.subject,
            startDate: new Date(req.body.startDate),
        });
        await session.save();
        return res.status(200).json(session);
    }catch(e) {
        console.log(e);
        return res.status(400).json({message:"error"})
    }
});

router.post("/edit", async (request, response) => {
    if (!request.isAuthenticated()) return response.status(401).json({message: "Not logged in!"});

    const session = await Session.findById(request.body.sessionId);
    
    if(!session) return response.status(401).json({message:"No such session!"})
    console.log(session.tutor);
    if(session.tutor !== request.user.user) return response.status(401).json({message:"You are not the tutor!"});

    session.startDate = new Date(request.body.startDate);
    session.duration = request.body.duration;

    await session.save();
    return response.status(200).json(session);
});

export default router;