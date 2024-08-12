const { getAdminOffer, getAdminOfferById, getAdminOfferByToken, addAdminOffer, updateAdminOffer } = require("../Models/AttrAdminOffers")




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

exports.getAdminOffer = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getAdminOfferById(req?.body?.id);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getAdminOfferByToken(req?.body?.token);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getAdminOffer(req?.body);
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


exports.addAdminOffer = async (req, res) => {
    let data = [];
    try {
        data = await addAdminOffer(req.body);
        const user = await getAdminOfferById(data.insertId);

        res.json(successResponse("data successfully inserted", user[0]))

    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateAdminOffer = async (req, res) => {
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
        data = await updateAdminOffer(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getAdminOfferById(req?.body?.id);
        }
        if (req?.body?.token) {
            user = await getAdminOfferByToken(req?.body?.token);
        }  
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}