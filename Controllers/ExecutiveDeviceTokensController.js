const { getExecutiveDeviceTokenById, getExecutiveDeviceTokenByToken, getExecutiveDeviceToken, addExecutiveDeviceToken, updateExecutiveDeviceToken } = require("../Models/ExecutiveDeviceTokens")

  
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

exports.getExecutiveDeviceToken = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getExecutiveDeviceTokenById(req.body.id);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getExecutiveDeviceTokenByToken(req.body.token);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getExecutiveDeviceToken(req?.body);
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


exports.addExecutiveDeviceToken = async (req, res) => {
    let data = [];
    try {
        data = await addExecutiveDeviceToken(req.body);
        const user = await getExecutiveDeviceTokenById(data.insertId);

        res.json(successResponse("data successfully inserted", user[0]))

    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateExecutiveDeviceToken = async (req, res) => {
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
        data = await updateExecutiveDeviceToken(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getExecutiveDeviceTokenById(req.body.id);
        }
        if (req?.body?.token) {
            user = await getExecutiveDeviceTokenByToken(req.body.token);
        }  
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}