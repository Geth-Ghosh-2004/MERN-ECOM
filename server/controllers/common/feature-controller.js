const Feature = require("../../models/feature");

/* ADD IMAGE */
const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const featureImage = new Feature({ image });
    await featureImage.save();

    res.status(201).json({
      success: true,
      data: featureImage,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

/* GET IMAGES */
const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});
    res.status(200).json({ success: true, data: images });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

/* ✅ DELETE IMAGE */
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;

    await Feature.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Feature image deleted",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

module.exports = {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
};
