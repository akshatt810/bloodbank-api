const mongoose = require('mongoose');
const BloodSample = require('../models/bloodSample');
const { getBloodSamples, addBloodSample, updateBloodSample, deleteBloodSample, getRequestsBloodType } = require('../services/hospitalService');

require('../services/hospitalService')

const hospitalController = {};

hospitalController.getBloodSamples = async (req, res) => {
    try {
        const { _id }  = req.body.user;

        const bloodSamples = await getBloodSamples(_id);
        res.status(200).json({ data : bloodSamples });
    } catch(err) {
        console.log(err.message);
        return res.status(400).json({ message : err.message })
    }
}

hospitalController.addBloodSample = async (req, res) => {
    try {
        const { user } = req.body;
        const { bloodType, quantity } = req.body;

        const expiryTime = new Date(req.body.expiresAt ?? Date.now() + 35 * 24 * 60 * 60 * 1000);
        
        if (user.type !== "Hospital")
            return res.status(401).json({ message : "You Need To Be Registered As A Hospital To Add A Sample. Please Contact Our Customer Care In Case Of Any Isuue."});

        const bloodSample = await addBloodSample(user._id, quantity, bloodType, expiryTime );

        res.status(200).json({ data : bloodSample });
    } catch(err) {
        console.log(err.message);
        return res.status(400).json({ message : err.message })
    }
}

hospitalController.updateBloodSample = async (req, res) => {
    try {
        const { user } = req.body;
        const { id } = req.params;
        const { bloodType, quantity, expiresAt } = req.body;

        const sampleId = new mongoose.Types.ObjectId(id);
        const bloodSample = await updateBloodSample(sampleId, user._id, bloodType, quantity, expiresAt);

        res.status(200).json({ data : bloodSample });
    } catch(err) {
        console.log(err.message);
        return res.status(400).json({ message : err.message })
    }
}

hospitalController.deleteBloodSample = async (req, res) => {
   try {
        const { hospitalId } = req.body.user;
        const { id } = req.params;

        const check = await deleteBloodSample(id, hospitalId);

        if (check)
        res.status(200).json({ message : "Blood Sample Successfully Deleted"});
    } catch(err) {
        console.log(err.message);
        return res.status(400).json({ message : err.message });
    }
}

hospitalController.getRequestsByBloodType = async (req, res) => {
    try {
        const { hospitalId } = req.user;
        const { bloodType } = req.params;

        const requests = await getRequestsBloodType(hospitalId, bloodType);

        res.status(200).json({ data: requests });
    } catch(err) {
        console.log(err.message);
        return res.status(400).json({ message : err.message });
    }
};

module.exports = hospitalController;