import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
    tutor: {
        type: String,
        required: true,
    },

    tutorId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

    begin: {
        type: Number,
    },

    startDate: {
        type: Date,
    },

    duration: {
        type: Number,
        required: true,
    },

    subject: {
        type: String,
        required: true,
    },

    student: {
        type: String,
    },

    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

    confirmed: {
        type: Boolean,
        default: false,
    },

    confirmationWaitlist: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "User",
        }],
    },

    meetingUrl: {
        type: String,
    },
});

sessionSchema.virtual("reserved").get(function () { return Boolean(this.studentId); });


const Session = mongoose.model("Session", sessionSchema);
export default Session;

/**
 * Sorts sessions by the following criteria, in this order:
 * 1. Sessions reserved by the given user come first
 * 1. Remaining open sessions come first
 * 1. Start time, ascending
 * @param {string} id 
 * @returns A sorting comparator for sessions.
 */
export const compareSessions = id =>
        (a, b) =>
                Number(b.studentId?.toString() === id) - Number(a.studentId?.toString() === id)
                || Number(Boolean(a.studentId)) - Number(Boolean(b.studentId))
                || (a.startDate?.getTime() ?? 0) - (b.startDate?.getTime() ?? 0)
                || (a.begin ?? 0) - (b.begin ?? 0);