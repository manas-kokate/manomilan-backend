import franchiseModel from "../models/franchise.model.js";


export const registerFranchise = async (req, res) => {
    const {
        franchiseName,
        ownerName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        email,
        address,
        socialMedia
    } = req.body;

    if (!franchiseName || !ownerName || !mobileNumber || !alternateNumber || !adharNumber || !panNumber || !email || !address || !socialMedia) {
        return res.send({ status: false, message: "All fields required" })
    }

    const existingUser = await franchiseModel.findOne({
        $or: [{ adharNumber }, { panNumber }, { email }, { mobileNumber }]
    })

    if (existingUser) {
        return res.send({ status: false, message: "Sorry user already exists." })
    }

    let franchisePhoto = '';
    let qrPhoto = '';
    try {
        if (
            (req.files?.franchisePhoto || req.files.franchisePhoto.length !== 0) && (req.files?.qrPhoto || req.files.qrPhoto.length !== 0)) {
            franchisePhoto = req.files.franchisePhoto[0].filename;
            qrPhoto = req.files.qrPhoto[0].filename;
        }
    } catch (error) {
        franchisePhoto = '';
        qrPhoto = '';
    }

    const newSchema = new franchiseModel({
        franchiseName,
        ownerName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        email,
        address,
        socialMedia,
        franchisePhoto,
        qrPhoto
    })

    await newSchema.save()

    return res.send({ status: false, message: "Franchise regisered successfully" });

}

export const loginFranchise = async (req, res) => {
    const { identifier, mobileNumber } = req.body;

    if (!identifier || !mobileNumber) {
        return res.send({ status: false, message: "Mobile number and identifier are required" });
    }

    // identifier can be adharNumber, panNumber, or email
    const franchise = await franchiseModel.findOne({
        mobileNumber,
        $or: [
            { adharNumber: identifier },
            { panNumber: identifier },
            { email: identifier },
            { mobileNumber: identifier }
        ]
    });

    if (!franchise) {
        return res.send({ status: false, message: "Invalid credentials" });
    }

    return res.send({ status: true, message: "Login successful", data: franchise });
};

export const updateFranchiseProfile = async (req, res) => {
    const { franchiseId } = req.params;
    const updateData = req.body;

    if (!franchiseId) {
        return res.send({ status: false, message: "Franchise ID is required" });
    }

    if (!updateData) {
        return res.send({ status: false, message: "Please send update data" })
    }

    try {
        const existingFranchise = await franchiseModel.findById(franchiseId);

        if (!existingFranchise) {
            return res.send({ status: false, message: "Franchise not found" });
        }

        // Handle file uploads
        if (req.files?.franchisePhoto?.[0]) {
            updateData.franchisePhoto = req.files.franchisePhoto[0].filename;
        }

        if (req.files?.qrPhoto?.[0]) {
            updateData.qrPhoto = req.files.qrPhoto[0].filename;
        }

        const updatedFranchise = await franchiseModel.findByIdAndUpdate(
            franchiseId,
            updateData,
            { new: true }
        );

        return res.send({ status: true, message: "Profile updated successfully", data: updatedFranchise });

    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong", error: error.message });
    }
};
