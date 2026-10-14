const outfits = require("./outfits.model")
const users = require("../users/users.model")
const wardrobes = require("../wardrobes/wardrobes.model")
var CONFIG = require('../../config/config');
const cloudinary = require("../../config/cloudinary");
const multer = require("multer");
const mongoose = require("mongoose");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    }
});

exports.uploadMiddleware = upload.single("media");

exports.uploadImg = async function (req, res) {
    try {
        var userId = req.body.userId;
        var wardrobeId = req.body.wardrobeId;

        // 1. userId required validation
        if (!userId) {
            return res.send({
                status: false,
                code: 400,
                message: "userId is required"
            });
        }

        if (!wardrobeId) {
            return res.send({
                status: false,
                code: 400,
                message: "wardrobeId is required"
            });
        }

        if (!req.file) {
            return res.send({
                status: false,
                code: 400,
                message: "Please select an image or video"
            });
        }

        const isImage = req.file.mimetype.startsWith("image/");

        if (!isImage) {
            return res.send({
                status: false,
                code: 400,
                message: "Only images are allowed"
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "online-wardrobe/media/" + userId + "/" + wardrobeId,
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            stream.end(req.file.buffer);
        });

        return res.send({
            status: true,
            code: 200,
            message: "Media uploaded successfully",
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                resourceType: result.resource_type,
                format: result.format,
                size: result.bytes
            }
        });

    } catch (error) {
        console.error("Upload error:", error);

        return res.send({
            status: false,
            code: 500,
            message: "Media upload failed"
        });
    }
};

exports.add = async function (req, res) {
    try {
        var body = req.body;

        // Record does not exist, create a new one
        var newOutfit = await outfits.create(body);

        return res.send({
            status: true,
            code: 200,
            message: "Wardrobe added successfully!",
            data: newOutfit
        });

    } catch (e) {
        return res.send({
            status: false,
            code: 400,
            message: "Oops, something went wrong: " + e.message,
            data: {}
        });
    }
};


exports.update = async function (req, res) {
    try {
        var updateData = req.body;
        var user = await outfits.findOneAndUpdate({ _id: req.params.id }, { $set: updateData }, { new: true });

        if (user) {
            return res.send({ satus: true, code: 200, message: "Update successfully!", data: user })
        } else {
            return res.send({ satus: false, code: 405, message: "Oops somthing went wrong!", data: {} })
        }

    }
    catch (e) {
        return res.send({ satus: false, code: 400, message: "Oops somthing went wrong " + e })
    }
}

exports.delete = async function (req, res) {
    try {
        var body = req.body;
        var data = await outfits.deleteOne({ _id: req.params.id });

        if (data) {
            return res.send({ satus: true, code: 200, message: "Update successfully!", data: data })
        } else {
            return res.send({ satus: false, code: 405, message: "Oops somthing went wrong!", data: {} })
        }

    }
    catch (e) {
        return res.send({ satus: false, code: 400, message: "Oops somthing went wrong " + e })
    }
}


exports.getUserOutfits = async function (req, res) {
    try {
        var body = req.body;
        var Page_No = body.Page_No || 1;// Page Number
        var Items_Per_Page = body.Size || 10; // list of records per page
        // Pagination Limit Code Start
        var Offset = (Page_No - 1) * Items_Per_Page;

        if (!body.userId) {
            return res.status(400).send({
                status: false,
                code: 400,
                message: "userId is required!"
            });
        }

        var wardrobe = await wardrobes.findOne({
            userId: body.userId
        });

        if (!wardrobe) {
            return res.status(404).send({
                status: false,
                code: 404,
                message: "Wardrobe not found!"
            });
        }

        if (req.body.searchText) {
            var where = {
                userId: new mongoose.Types.ObjectId(body.userId),
                wardrobeId: wardrobe._id,
                $or: [
                    { name: { $regex: req.body.searchText, $options: "i" } },
                    { category: { $regex: req.body.searchText, $options: "i" } },
                    { color: { $regex: req.body.searchText, $options: "i" } }
                ]
            };
        } else {
            var where = {
                userId: new mongoose.Types.ObjectId(body.userId),
                wardrobeId: wardrobe._id
            }
        }

        var Count = await outfits.countDocuments(where)
        var data = await outfits.find(where)
            .sort({ _id: -1 })
            .skip(Offset)
            .limit(Items_Per_Page)

        if (data.length > 0) {
            return res.status(200).send({
                status: true,
                code: 200,
                Count, Page_No, Size: Items_Per_Page,
                message: "Data fetched successfully!",
                data: data
            });
        }

        return res.status(200).send({
            status: true,
            code: 200,
            Page_No, Size: Items_Per_Page,
            message: "No outfits found!",
            data: []
        });

    } catch (e) {
        console.error("getUserOutfits error:", e);

        return res.status(500).send({
            status: false,
            code: 500,
            message: "Something went wrong!",
            error: e.message
        });
    }
};


exports.list = async function (req, res) {
    try {
        // User Search
        var Page_No = req.params.Page_No || 1;// Page Number
        var Items_Per_Page = req.params.Size || 10; // list of records per page
        // Pagination Limit Code Start
        var Offset = (Page_No - 1) * Items_Per_Page;
        if (req.body.searchText) {
            var where = {
                $or: [
                    { name: { $regex: req.body.searchText, $options: "i" } },
                    { email: { $regex: req.body.searchText, $options: "i" } }]
            };
        } else {
            var where = {}
        }

        var Count = await outfits.countDocuments(where)
        var data = await outfits.find(where)
            .sort({ _id: -1 })
            .skip(Offset)
            .limit(Items_Per_Page)

        if (data) {
            return res.send({ satus: true, code: 200, message: "data list successfully!", Count, Page_No, Size: Items_Per_Page, data: data })
        } else {
            return res.send({ satus: false, code: 405, message: "Oops somthing went wrong!", Page_No, Size: Items_Per_Page, data: [] })
        }
    }
    catch (e) {
        return res.send({ satus: false, code: 400, message: "Oops somthing went wrong " + e })
    }
}



