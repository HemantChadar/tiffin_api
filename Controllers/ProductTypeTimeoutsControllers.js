const { getProductTypeTimeoutById, getProductTypeTimeoutByToken, getProductTypeTimeout, addProductTypeTimeout, updateProductTypeTimeout } = require("../Models/ProductTypeTimeouts")

 

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

exports.getProductTypeTimeout = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getProductTypeTimeoutById(req.body.id);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getProductTypeTimeoutByToken(req.body.token);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getProductTypeTimeout(req?.body);
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


exports.addProductTypeTimeout = async (req, res) => {
    let data = [];
    try {
        data = await addProductTypeTimeout(req.body);
        const user = await getProductTypeTimeoutById(data.insertId);

        res.json(successResponse("data successfully inserted", user[0]))

    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateProductTypeTimeout = async (req, res) => {
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
        data = await updateProductTypeTimeout(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getProductTypeTimeoutById(req.body.id);
        }
        if (req?.body?.token) {
            user = await getProductTypeTimeoutByToken(req.body.token);
        }  
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}