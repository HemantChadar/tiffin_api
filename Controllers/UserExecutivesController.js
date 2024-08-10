const { getUserExecutivesById, getUserExecutivesByToken, getUserExecutives, addUserExecutives, updateUserExecutives } = require("../Models/UserExecutives")

 
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

exports.getUserExecutives = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getUserExecutivesById(req.body.id);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getUserExecutivesByToken(req.body.token);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getUserExecutives();
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


exports.addUserExecutives = async (req, res) => {
    let data = [];
    try {
        data = await addUserExecutives(req.body);
        const user = await getUserExecutivesById(data.insertId); 
        res.json(successResponse("data successfully inserted", user[0]))
    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateUserExecutives = async (req, res) => {
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
        data = await updateUserExecutives(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getUserExecutivesById(req.body.id);
        }
        if (req?.body?.token) {
            user = await getUserExecutivesByToken(req.body.token);
        }  
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}