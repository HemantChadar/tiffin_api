const { getGeneralPagesById, getGeneralPagesByToken, getGeneralPages, addGeneralPages, updateGeneralPages } = require("../Models/AttrGeneralPages")

  
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

exports.getGeneralPages = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getGeneralPagesById(req?.body?.id);
            if (data?.length >= 1) {
                res.json(successResponse("general pages successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getGeneralPagesByToken(req?.body?.token);
            if (data?.length >= 1) {
                res.json(successResponse("general pages successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getGeneralPages();
            if (data?.length >= 1) {
                res.json(successResponse("general pages successfully get", data))
            } else {
                res.json(errorResponse("general pages is not availble "))
            }
        } 

    } catch (error) {
        res.json(errorResponse(error))
    }
}


exports.addGeneralPages = async (req, res) => {
    let data = [];
    try {
        data = await addGeneralPages(req.body);
        const user = await getGeneralPagesById(data.insertId);
        res.json(successResponse("data successfully inserted", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}

exports.updateGeneralPages = async (req, res) => {
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
        data = await updateGeneralPages(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getGeneralPagesById(req?.body?.id);
        }
        if (req?.body?.token) {
            user = await getGeneralPagesByToken(req?.body?.token);
        }  
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}