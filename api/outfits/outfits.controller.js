const outfits = require("./outfits.model")
var CONFIG = require('../../config/config');



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



