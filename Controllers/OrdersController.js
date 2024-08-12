const { getOrderById, getOrderByToken, getOrder, addOrder, updateOrder } = require("../Models/Orders")


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

exports.getOrder = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getOrderById(req.body.id);
            if (data) {
                res.json(successResponse("data successfully get", data))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getOrderByToken(req.body.token);
            if (data) {
                res.json(successResponse("data successfully get", data))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getOrder(req?.body);
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


exports.addOrder = async (req, res) => {
    let data = [];
    try {
        data = await addOrder(req.body);
        const user = await getOrderById(data.insertId);

        res.json(successResponse("data successfully inserted", user[0]))

    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateOrder = async (req, res) => {
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
        data = await updateOrder(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getOrderById(req.body.id);
        }
        if (req?.body?.token) {
            user = await getOrderByToken(req.body.token);
        }
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}