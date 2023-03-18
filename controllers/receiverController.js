const { getAvailableBloodSamples, makeBloodRequest, getRequestsByBloodType } = require('../services/recieverService');

exports.getAvailableBloodSamples = async (req, res) => {
    try {
        const bloodSamples = await getAvailableBloodSamples();

        res.status(200).json({ data : bloodSamples });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ message : err.message });
    }
}

exports.makeBloodRequest = async (req, res) => {
    try {
        const { user , bloodType, quantity } = req.body;

        if (user.type !== "Receiver") return res.status(400).json({ message : "You Have To Be Registered As A Reciever To Place A Reqquest. Please Contact Our Customer Support If This Is A Error."})

        const bloodRequest = await makeBloodRequest(user._id, bloodType, quantity);

        res.status(200).json({ message : "Your Request Has Been Raised Successfully", data : bloodRequest });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ message : err.message });
    }
}

exports.getRequestsByBloodType = async (req, res) => {
    try {
        const { bloodType } = req.params;

        const requests = await getRequestsByBloodType(bloodType);

        res.status(200).json({ requests : requests });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ message : err.message });
    }
}