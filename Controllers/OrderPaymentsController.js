const { getOrderPaymentsById, getOrderPaymentsByToken, getOrderPayments, addOrderPayments, updateOrderPayments } = require("../Models/OrderPayments")



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

exports.getOrderPayments = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getOrderPaymentsById(req.body.id);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getOrderPaymentsByToken(req.body.token);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getOrderPayments();
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


exports.addOrderPayments = async (req, res) => {
    let data = [];
    try {
        data = await addOrderPayments(req.body);
        const user = await getOrderPaymentsById(data.insertId);

        res.json(successResponse("data successfully inserted", user[0]))

    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateOrderPayments = async (req, res) => {
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
        data = await updateOrderPayments(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getOrderPaymentsById(req.body.id);
        }
        if (req?.body?.token) {
            user = await getOrderPaymentsByToken(req.body.token);
        }
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}