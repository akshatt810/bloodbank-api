const BloodRequest = require("../models/bloodRequest");
const BloodSample = require("../models/bloodSample");

exports.getRequestsByBloodType = async (bloodType) => {
    const bloodRequests = await BloodRequest.find({ bloodType }).populate().lean().exec();
    
    return bloodRequests;
}

exports.getAvailableBloodSamples = async (req, res) => {
    const bloodSamples = await BloodSample.aggregate([
        { $match: {
        availableQuantity: { $gt: 0 },
        expiresAt: { $gt: new Date() }
        }},
        { $lookup: {
        from: 'users',
        localField: 'hospitalId',
        foreignField: '_id',
        as: 'hospital'
        }},
        { $unwind: '$hospital' },
        { $project: {
        _id: 0,
        bloodType: 1,
        quantity: 1,
        availableQuantity: 1,
        createdAt: 1,
        expiresAt: 1,
        isExpired: { $gt: [ '$expiresAt', new Date() ] },
        isExhausted: { $lte: [ '$availableQuantity', 0 ] },
        hospital: { _id: 1, name: 1, email: 1 }
        }}
    ]);
    
    return bloodSamples;
}

exports.makeBloodRequest = async (userId, bloodType, quantity) => {
    const bloodSample = await BloodSample.findOne({
      bloodType,
      availableQuantity: { $gte: quantity },
      expiresAt: { $gt: new Date() }
    }).sort({ availableQuantity: 1 }).limit(1);;
  
    if (!bloodSample) {
      throw new Error('No Blood Sample Available For The Blood Type Requested')
    }
  
    bloodSample.availableQuantity -= quantity;
  
    const bloodRequest = new BloodRequest({
      sampleId : bloodSample._id,
      receiverId : userId,
      bloodType,
      quantity,
      hospitalId: bloodSample.hospitalId,
      createdAt: new Date(),
    });
  
    await bloodRequest.save();
    await bloodSample.save();
  
    return bloodRequest;
  }