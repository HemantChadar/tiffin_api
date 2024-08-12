const { getUserBusinessById, getUserBusinessByToken, getUserBusiness, addUserBusiness, updateUserBusiness } = require("../Models/UserBusinesses")
 
const errorResponse = (message) => {
    return ({
        error: true,
        message: message,
        data: null
    })
}

const successResponse = (message, data) => {
    return ({
        error: false,
        message: message,
        data: data
    })
}

exports.getUserBusiness = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getUserBusinessById(req.body.id);
            if (data) {
                res.json(successResponse("data successfully get", data))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getUserBusinessByToken(req.body.token);
            if (data) {
                res.json(successResponse("data successfully get", data))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getUserBusiness(req?.body);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data))
            } else {
                res.json(errorResponse("data is not availble "))
            }
        } 

    } catch (error) {
        res.json(errorResponse(error))
    }
}


exports.addUserBusiness = async (req, res) => {
    let data = [];
    try {
        data = await addUserBusiness(req.body);
        const user = await getUserBusinessById(data.insertId);

        res.json(successResponse("data successfully inserted", user[0]))

    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateUserBusiness = async (req, res) => {
    let keyName = ""
    let keyValue = null
    if (req?.body?.id) {
        keyName = "id"
        keyValue = req.body.id
    }
    if (req?.body?.token) {
        keyName = "token"
        keyValue = req.body.token
    }
    let data = [];
    let user = [];
    try {
        data = await updateUserBusiness(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getUserBusinessById(req.body.id);
        }
        if (req?.body?.token) {
            user = await getUserBusinessByToken(req.body.token);
        }  
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}