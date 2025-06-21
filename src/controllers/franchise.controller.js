import franchiseModel from "../models/franchise.model";


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
    console.log(newSchema)

}
