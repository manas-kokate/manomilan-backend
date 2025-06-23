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
        address
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
}
