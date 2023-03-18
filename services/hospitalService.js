const BloodSample = require('../models/bloodSample');

exports.getBloodSamples = async (hospitalId) => {
    const bloodSamples = await BloodSample.find({ hospitalId });

    console.log(bloodSamples)
    
    return bloodSamples;
}

exports.addBloodSample = async (hospitalId, quantity, bloodType, expiryTime) => {
    const bloodSample = new BloodSample({ hospitalId, bloodType, quantity, expiresAt: expiryTime });
    await bloodSample.save();

    return bloodSample;
}

exports.updateBloodSample = async (id, hospitalId, bloodType, quantity, expiresAt) => {
 
    const bloodSample = await BloodSample.findOneAndUpdate( 
        { _id : id, hospitalId, bloodType },
        { $set : { bloodType, quantity: quantity, availableQuantity : quantity, expiresAt }},
        { new : true }
    );

    if (!bloodSample) {
        throw new Error("Blood Sample Not Found.");
    }

    return bloodSample;
}

exports.deleteBloodSample = async (id, hospitalId) => {
    const bloodSample = await BloodSample.findByIdAndDelete ({ _id : id, hospitalId });
    if (!bloodSample) {
        throw new Error("Blood Sample Not Found.");
    }

    return true;
}

exports.getRequestsBloodType = async(hospitalId, bloodType) => {
    const bloodSample = await BloodSample.findOne({ hospitalId, bloodType });

    if (!bloodSample) {
        throw new Error("Blood Sample Not Found.");
    }

    return BloodSample.requests;
}