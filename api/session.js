import express from "express";
import User from "../model/schema/user.js";
import Session, { compareSessions } from "../model/schema/session.js";
import {allowLoggedInOnly, allowTutorOnly} from "../util/express-middleware.js";
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

router.get("/",
    allowLoggedInOnly,
    async (request, response) => {
        const subjects = request.query.subject?.split("|") ?? null;
        const open = request.query.open !== undefined ? request.query.open !== "0" : null;
        const tutorIds = request.query.tutorId?.split("|") ?? null;
        const studentIds = request.query.studentId?.split("|") ?? null;
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
                tutorIds ? {
                    $or: tutorIds.map(tutorId => ({tutorId})),
                } : {},
                studentIds ? {
                    $or: studentIds.map(studentId => ({studentId})),
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
                .select("_id tutorId begin startDate duration subject meetingUrl studentId confirmed")
        )
                .sort(compareSessions(request.user?._id.toString()));

        const pickUserProps = user => {
            if (!user) return user;

            const {_id, name: {full}, user: username} = user;
            return {_id, name: full, user: username};
        };

        const sessionsResponse = await Promise.all(sessions.map(async session => {
            const sessionJson = session.toJSON({virtuals: true});
            await Promise.all([
                (sessionJson.tutor = pickUserProps(
                        (await User.findById(session.tutorId)
                                .select("_id name user")
                        )
                        ?.toJSON({virtuals: ["name.full"]})
                )),
                (sessionJson.student = pickUserProps(
                        (await User.findById(session.studentId)
                                .select("_id name user")
                        )
                        ?.toJSON({virtuals: ["name.full"]})
                )),
            ]);
            return sessionJson;
        }));
        response.status(200).json(sessionsResponse);
    },
);

router.post("/",
    allowTutorOnly,
    async (req, res) => {
        try {
            const session = new Session({
                begin: req.body.begin,
                duration: req.body.duration,
                tutorId: req.user._id,
                subject: req.body.subject,
                startDate: new Date(req.body.startDate),
            });
            await session.save();
            return res.status(200).json(session);
        }catch(e) {
            console.log(e);
            return res.status(400).json({message:"error"})
        }
    },
);

router.post("/edit",
    allowTutorOnly,
    async (request, response) => {
        const session = await Session.findById(request.body.sessionId);
        
        if(!session) return response.status(401).json({message:"No such session!"})
        if(session.tutor !== request.user.user) return response.status(401).json({message:"You are not the tutor!"});

        session.subject = request.body.subject;
        session.startDate = new Date(request.body.startDate);
        session.duration = request.body.duration;
        session.meetingUrl = request.body.meetingUrl;

        await session.save();
        return response.status(200).json(session);
    },
);

export default router;