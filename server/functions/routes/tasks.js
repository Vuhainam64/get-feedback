const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// Middleware kiểm tra vai trò
const checkAdminRole = async (req, res, next) => {
    const adminId = req.body.adminId; // Lấy userId từ request hoặc thông tin người dùng được lưu trong session
    try {
        const userDoc = await db.collection("user").doc(adminId).get();
        if (userDoc.exists) {
            const userRoleId = userDoc.data().roleId;
            if (userRoleId === 1698024103953) { // Kiểm tra xem roleId của "admin" là gì
                // Nếu vai trò của người dùng là "admin", cho phép tiếp tục
                next();
            } else {
                return res.status(403).send({
                    success: false,
                    msg: "Permission denied. User is not an admin.",
                });
            }
        } else {
            return res.status(404).send({
                success: false,
                msg: "User not found.",
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error: ${err}`,
        });
    }
};

// Route tạo task 
router.post('/createTask/:userId', checkAdminRole, async (req, res) => {

    const userId = req.params.userId;

    const {
        feedbackStatus,
        feedbackId,
    } = req.body;

    if (!feedbackStatus || !feedbackId) {
        return res.status(400).json({
            error: "Feedback status and ID are required"
        });
    }

    try {
        switch (feedbackStatus) {
            case "Not Verify":
                description = `Verify feedback ${feedbackId}`
                newFeedbackStatus = "Validating"
                break;
            case "Verify":
                description = `Processing feedback ${feedbackId}`
                newFeedbackStatus = "Validated"
                break;
            default:
                break;
        }

        const updateFeedbackStatus = {
            Status: newFeedbackStatus,
            updatedAt: new Date().getTime(),
        }

        const newTask = {
            employeeId: userId,
            feedbackId,
            description,
            status: 'Processing',
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        };

        const taskDocRef = await db.collection('tasks').add(newTask);

        const feedbackDoc = await db.collection('feedbacks').doc(feedbackId).get();
        const {
            statusId
        } = feedbackDoc.data();
        const feedbackStatusDocRef = await db.collection('feedbackstatus').doc(statusId).update(updateFeedbackStatus);

        return res.status(201).json({
            id: taskDocRef.id,
            updatedFeedbackStatusId: feedbackStatusDocRef.id,
            message: "Task created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating task');
    }
});


module.exports = router;