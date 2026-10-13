const users = require("./users.model")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var CONFIG = require('../../config/config');

exports.register = async function (req, res) {
    try {
        var newRegister = new users(req.body);

        var user = await users.findOne({ email: req.body.email });

        if (user) {
            return res.send({ satus: false, code: 201, message: "This email is already registered", data: user })
        }

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);

        if(!newRegister.password){
            newRegister.password = "123456"
        }

        // now we set user password to hashed password
        newRegister.password = await bcrypt.hash(newRegister.password, salt);

        var register = await newRegister.save();

        if (register) {
            return res.send({ satus: true, code: 200, message: "Register successfully!", data: register })
        } else {
            return res.send({ satus: false, code: 405, message: "Oops somthing went wrong!", data: {} })
        }

    }
    catch (e) {
        return res.send({ satus: false, code: 400, message: "Oops somthing went wrong " + e })
    }
}

exports.login = async function (req, res) {
    try {

        var body = req.body;

        if (!body.email) return res.send({ code: 204, message: 'Please provide email!' });

        if (!body.password) return res.send({ code: 204, message: 'Please Provide password!' });


        const user = await users.findOne({ email: body.email });


        if (user) {
            // check user password with hashed password stored in the database
            const validPassword = await bcrypt.compare(body.password, user.password);

            if (validPassword) {

                // var lastLoginUpdate = await users.findOneAndUpdate({ _id: user._id }, { $set: { lastLogin: Date.now() } })

                const token = await jwt.sign({ user }, 'secret', { expiresIn: 60 * 60 });
                user.token = token;

                return res.send({ code: 200, message: "Login successfully", data: user });
            } else {
                res.send({ code: 400, message: "Invalid Password" });
            }

        } else {
            res.send({ code: 401, message: "User does not exist" });
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

        var Count = await users.countDocuments(where)
        var users = await users.find(where)
            .populate({
                path: 'programId',
                select: ''
            })
            .sort({ _id: -1 })
            .skip(Offset)
            .limit(Items_Per_Page)

        if (users) {
            return res.send({ satus: true, code: 200, message: "Users list successfully!", Count, Page_No, Size: Items_Per_Page, data: users })
        } else {
            return res.send({ satus: false, code: 405, message: "Oops somthing went wrong!", Page_No, Size: Items_Per_Page, data: [] })
        }
    }
    catch (e) {
        return res.send({ satus: false, code: 400, message: "Oops somthing went wrong " + e })
    }
}

exports.update = async function (req, res) {
    try {
        var updateData = req.body;
        var user = await users.findOneAndUpdate({ _id: req.params.id }, { $set: updateData }, { new: true });

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
        var user = await users.findOneAndDelete({ _id: req.params.id });

        if (user) {
            return res.send({ satus: true, code: 200, message: "delete successfully!", data: user })
        } else {
            return res.send({ satus: false, code: 405, message: "Oops somthing went wrong!", data: {} })
        }

    }
    catch (e) {
        return res.send({ satus: false, code: 400, message: "Oops somthing went wrong " + e })
    }
}

exports.details = async function (req, res) {
    try {
        var user = await users.findById(req.params.id)
            .populate({
                path: 'cityId',
                select: 'cityName stateName countryName'
            })
            .populate({
                path: 'educationId',
                select: ''
            })

        if (user) {
            CONFIG.RESPONSE.success.data = user;
            return res.send(CONFIG.RESPONSE.success)
        } else {
            CONFIG.RESPONSE.success.data = {};
            return res.send(CONFIG.RESPONSE.error)
        }

    }
    catch (e) {
        CONFIG.RESPONSE.success.data = {};
        return res.send(CONFIG.RESPONSE.error)
    }
}


exports.forgotPassword = async function (req, res) {
    try {
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);

        // now we set user password to hashed password
        var password = await bcrypt.hash(req.body.newPassword, salt);

        var user = await users.findByIdAndUpdate({ _id: req.body.email }, { $set: { password: password } }, { new: true });

        if (user) {
            return res.send({ satus: true, code: 200, message: "Password updated successfully!", data: user })
        } else {
            return res.send({ satus: false, code: 405, message: "Oops somthing went wrong!", data: {} })
        }

    }
    catch (e) {
        return res.send({ satus: false, code: 400, message: "Oops somthing went wrong " + e })
    }
}

exports.searchUsers = async function (req, res) {
    try {
        if (req.body.searchText) {
            var match = { $or: [{ "name": { $regex: req.body.searchText, $options: "i" } }, { "email": { $regex: req.body.searchText, $options: "i" } }, { "mobile": { $regex: req.body.searchText, $options: "i" } }, { "skillProgramId.skillProgramName": { $regex: req.body.searchText, $options: "i" } }, { "educationId.educationName": { $regex: req.body.searchText, $options: "i" } }] }
        } else {
            var match = {}
        }
        var users = await users.aggregate([
            {
                "$lookup": {
                    "from": 'educations',
                    "localField": "educationId",
                    "foreignField": "_id",
                    "as": "educationId"
                },
                "$lookup": {
                    "from": 'skill-programs',
                    "localField": "skillProgramId",
                    "foreignField": "_id",
                    "as": "skillProgramId"
                }
            },
            { "$unwind": "$educationId" },
            { "$unwind": "$skillProgramId" },
            { "$match": match },
        ])

        return res.send({ satus: true, code: 200, message: "Search user successfully!", data: users })
    }
    catch (e) {
        return res.send({ satus: false, code: 400, message: "Oops somthing went wrong " + e })
    }
}