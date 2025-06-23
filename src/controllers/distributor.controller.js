import distributorModel from "../models/distributor.model";


export const registerDistributor = async (req, res) => {
    const {
        distributorName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        password,
        email,
        address,
    } = req.body;

    const ExistingDistributor = await distributorModel.findOne({
        $or: [
            { mobileNumber },
            { adharNumber },
            { panNumber },
            { email }
        ]
    });
    if (ExistingDistributor) {
        return res.send({ status: false, messsage: "Distributor already exists with this details." })
    }

    if (req.files?.qrPhoto || req.files.qrPhoto.length !== 0) {
        const qrPhoto = req.files.qrPhoto[0].filename;
    }

    if (req.files?.distributorPhoto || req.files.distributorPhoto.length !== 0) {
        const distributorPhoto = req.files.distributorPhoto[0].filename
    }

    const newDistributor = new distributorModel({
        distributorName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        password,
        email,
        address
    })
}
