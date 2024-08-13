const { checkIsNumber, checkIsset, checkIsString, checkIsObject } = require("../Conection/constant");
const { messageForGetData, messageForInsertData, messageForUpdateData } = require("../Conection/HelpingTool");
const { getAdminOffer, getAdminOfferById, getAdminOfferByToken, addAdminOffer, updateAdminOffer, getFieldsAdminOffer } = require("../Models/AttrAdminOffers");
const { removeNameValuePairs, verifyParams, requestError, requestParam, checkDeviceType } = require("./BaseApiController");


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
                res.json(successResponse("attr_admin_offers " + messageForGetData, data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getAdminOfferByToken(req?.body?.token);
            if (data?.length >= 1) {
                res.json(successResponse("attr_admin_offers " + messageForGetData, data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            if (!req?.body.limit && !req?.body.offset) {
                res.json(errorResponse("limit and offset required to continue "))
            } else {
                data = await getAdminOffer(req?.body);
                if (data?.length >= 1) {
                    res.json(successResponse("attr_admin_offers " + messageForGetData, data))
                } else {
                    res.json(errorResponse("data is not availble "))
                }
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
        res.json(successResponse("attr_admin_offers " + messageForInsertData, user[0]));

    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateAdminOffer = async (req, res) => {

    const params = removeNameValuePairs(req?.body);
    const checkVerfy = verifyParams(res, req?.body);
    let data = [];
    let user = [];

    if (checkVerfy) {

    } else if (!checkIsset(params?.login_user_id)) {
        requestParam(res, params?.device_type, "login_user_id")
    } else if (!checkIsNumber(params?.login_user_id)) {
        requestError(res, params?.device_type, "login_user_id must be number")
    }
    else if (!checkIsset(params?.login_user_type)) {
        requestParam(res, params?.device_type, "login_user_type")
    } else if (!checkIsString(params?.login_user_type)) {
        requestError(res, params?.device_type, "login_user_type must be string")
    } else if (checkIsset(params?.id)) {
        if (!checkIsNumber(params?.id)) {
            requestError(res, params?.device_type, "id must be number")
        } else if (!checkIsset(params?.values)) {
            requestParam(res, params?.device_type, "values")
        } else if (!checkIsObject(params?.values)) {
            requestError(res, params?.device_type, "values must be object")
        } else {
            let values = removeNameValuePairs(params?.values);
            let dataSet = {};

            let fields = await getFieldsAdminOffer();
            fields?.forEach(field => {
                if (field in values) {
                    dataSet={...dataSet, [field]:values[field]}
                }
            }); 
            data = await updateAdminOffer(dataSet, "id", params?.id);
            checkDeviceType(res, data, "admin offer", params?.device_type, "update");
        }
    }
    else if (checkIsset(params?.token)) {
        if (!checkIsString(params?.token)) {
            requestError(res, params?.device_type, "token must be string")
        } else {
            let values = removeNameValuePairs(params?.values);
            let dataSet = [];

            let fields = [];
            fields?.forEach(field => {
                if (field in values) {
                    dataSet.push(values[field])
                }
            });

            data = await updateAdminOffer(dataSet, "token", params?.token);

            checkDeviceType(res, user, "admin offer", params?.device_type, "update");
        }
    } else {


    }

}