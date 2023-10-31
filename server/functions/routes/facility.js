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

router.post("/createCampus", checkAdminRole, async (req, res) => {
    try {
        const {
            campusName,
            tag
        } = req.body;

        // Validate input
        if (!campusName || !tag) {
            return res.status(400).json({
                message: "Campus or tag name is required",
            });
        }

        const campusData = {
            campusName,
            tag
        };

        // Add a new campus document
        const campusRef = await db.collection("campus").add(campusData);
        const campusId = campusRef.id;

        res.status(201).json({
            campusId,
            message: "Campus created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// Create a New Room
router.post("/createRoom", checkAdminRole, async (req, res) => {
    try {
        const {
            campusId,
            roomName
        } = req.body;

        // Validate input
        if (!campusId || !roomName) {
            return res.status(400).json({
                message: "Campus ID and room name are required",
            });
        }

        const roomData = {
            campusId,
            roomName,
        };

        // Add a new room document
        const roomRef = await db.collection("room").add(roomData);
        const roomId = roomRef.id;

        res.status(201).json({
            roomId,
            message: "Room created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// Create a New Facility
router.post("/createFacility", checkAdminRole, async (req, res) => {
    try {
        const {
            roomId,
            facilityName
        } = req.body;

        // Validate input
        if (!roomId || !facilityName) {
            return res.status(400).json({
                message: "Room ID and facility name are required",
            });
        }

        const facilityData = {
            roomId,
            facilityName,
        };

        // Add a new facility document
        const facilityRef = await db.collection("facility").add(facilityData);
        const facilityId = facilityRef.id;

        res.status(201).json({
            facilityId,
            message: "Facility created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// Get All Campuses
router.get("/getAllCampuses", async (req, res) => {
    try {
        const campusesSnapshot = await db.collection("campus").get();
        const campuses = [];

        campusesSnapshot.forEach((doc) => {
            const campusData = doc.data();
            const campusId = doc.id;
            campuses.push({
                campusId,
                ...campusData
            });
        });

        res.status(200).json({
            success: true,
            data: campuses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
});

// Get All Rooms in a Campus
router.get("/getAllRoomsInCampus/:campusId", async (req, res) => {
    try {
        const campusId = req.params.campusId;

        // Query the rooms collection to get all rooms in the specified campus
        const roomsSnapshot = await db.collection("room")
            .where("campusId", "==", campusId)
            .get();

        const rooms = [];

        roomsSnapshot.forEach((doc) => {
            const roomData = doc.data();
            const roomId = doc.id;
            rooms.push({
                roomId,
                ...roomData
            });
        });

        res.status(200).json({
            success: true,
            data: rooms,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
});

router.get("/getAllFacilityInRoom/:roomId", async (req, res) => {
    try {
        const roomId = req.params.roomId;

        // Query the facilities collection to get all facilities in the specified room
        const facilitiesSnapshot = await db.collection("facility")
            .where("roomId", "==", roomId)
            .get();

        const facilities = [];

        facilitiesSnapshot.forEach((doc) => {
            const facilityData = doc.data();
            const facilityId = doc.id;
            facilities.push({
                facilityId,
                ...facilityData
            });
        });

        res.status(200).json({
            success: true,
            data: facilities, // Update this variable to facilities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
});

module.exports = router;