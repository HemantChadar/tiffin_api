const { checkIsNumber, checkIsset, checkIsObject, checkIsString } = require("../Conection/constant");
const { messageForGetData, messageForInsertData, messageForUpdateData } = require("../Conection/HelpingTool");
const { getAdminSettings, getAdminSettingsById, getAdminSettingsByToken, addAdminSettings, updateAdminSetting } = require("../Models/AttrAdminSettings");
const { requestParam, verifyParams, removeNameValuePairs, requestError, checkDeviceType } = require("./BaseApiController");


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


exports.getAdminSettings = async (req, res) => {
    // try {
    const params = removeNameValuePairs(req?.body);
    const checkVerfy = verifyParams(res, req?.body);
    if (checkVerfy) {
        // res.json(errorResponse("id is invailid "));
    } else if (checkIsset(params?.id)) {
        if (!checkIsNumber(params?.id)) {
            requestError(res, params?.device_type, "id must be numberic");
        } else {
            let data = await getAdminSettingsById(params?.id);
            if (checkIsObject(data)) {
                checkDeviceType(res, data, "admin setting", params?.device_type, "get");
            } else {
                requestError(res, params?.device_type, "id is not vailid");
            }
        }
    }
    else if (checkIsset(params?.token)) {
        if (!checkIsString(params?.token)) {
            requestError(res, params?.device_type, "token must be string");
        } else {
            let data = await getAdminSettingsByToken(params?.token);
            if (checkIsObject(data)) {
                checkDeviceType(res, data, "admin setting", params?.device_type, "get");
            } else {
                requestError(res, params?.device_type, "token is not vailid");
            }
        }
    } else {
        if (!params?.limit) {
            requestParam(res, params?.device_type, "limit")
        } else if (!checkIsNumber(params?.limit)) {
            requestError(res, params?.device_type, "limit must be numberic")
        } else if (!checkIsset(params?.offset)) {
            requestParam(res, params?.device_type, "offset")
        } else if (!checkIsNumber(params?.offset)) {
            requestError(res, params?.device_type, "offset must be numberic")
        } else {
            let data = await getAdminSettings(params);
            checkDeviceType(res, data, "admin setting", params?.device_type, "get");
            // requestError(res, params?.device_type, "success")
        }
    }

    // } catch (error) {
    //     res.json(errorResponse(error))
    // }
}


exports.addAdminSettings = async (req, res) => {
    const params = removeNameValuePairs(req?.body);
    const checkVerfy = verifyParams(res, req?.body);
    let data = [];

    if (checkVerfy) {

    } else {
        if (!checkIsset(params?.title)) {
            requestParam(res, params?.device_type, "title")
        } else if (!checkIsString(params?.title)) {
            requestError(res, params?.device_type, "title must be string")
        } else if (!checkIsset(params?.options)) {
            requestParam(res, params?.device_type, "options")
        } else if (!checkIsString(params?.options)) {
            requestError(res, params?.device_type, "options must be string")
        }
        // else if (!checkIsset(params?.type)) {
        //     requestParam(res, params?.device_type, "type")
        // } else if (!checkIsString(params?.type)) {
        //     requestError(res, params?.device_type, "type must be string")
        // }
        // else if (!checkIsset(params?.value_type)) {
        //     requestParam(res, params?.device_type, "value_type")
        // } else if (!checkIsString(params?.value_type)) {
        //     requestError(res, params?.device_type, "value_type must be string")
        // }
        else if (!checkIsset(params?.value)) {
            requestParam(res, params?.device_type, "value")
        } else if (!checkIsString(params?.value)) {
            requestError(res, params?.device_type, "value must be string")
        }

        else if (!checkIsset(params?.title_group)) {
            requestParam(res, params?.device_type, "title_group")
        } else if (!checkIsString(params?.title_group)) {
            requestError(res, params?.device_type, "title_group must be string")
        }
        else if (!checkIsset(params?.login_user_id)) {
            requestParam(res, params?.device_type, "login_user_id")
        } else if (!checkIsNumber(params?.login_user_id)) {
            requestError(res, params?.device_type, "login_user_id must be number")
        }

        else if (!checkIsset(params?.login_user_type)) {
            requestParam(res, params?.device_type, "login_user_type")
        } else if (!checkIsString(params?.login_user_type)) {
            requestError(res, params?.device_type, "login_user_type must be string")
        }
        else {
            data = await addAdminSettings(params);
            const user = await getAdminSettingsById(data.insertId);
            checkDeviceType(res, user, "admin setting", params?.device_type, "insert");
        }
    }

}


exports.updateAdminSetting = async (req, res) => {
    const params = removeNameValuePairs(req?.body);
    const checkVerfy = verifyParams(res, req?.body);
    let data = [];
    let user = [];

    if (checkVerfy) {

    } else {

        if (params?.id) {
            if (!checkIsNumber(params?.id)) {
                requestError(res, params?.device_type, "id must be number")
            } else if (!checkIsset(params?.login_user_id)) {
                requestParam(res, params?.device_type, "login_user_id")
            } else if (!checkIsNumber(params?.login_user_id)) {
                requestError(res, params?.device_type, "login_user_id must be number")
            }

            else if (!checkIsset(params?.login_user_type)) {
                requestParam(res, params?.device_type, "login_user_type")
            } else if (!checkIsString(params?.login_user_type)) {
                requestError(res, params?.device_type, "login_user_type must be string")
            } else {
                data = await updateAdminSetting(params, 'id', params?.id);
                user = await getAdminSettingsById(params?.id);
                checkDeviceType(res, user, "admin setting", params?.device_type, "update");

            }
        } else if (params?.token) {
            if (!checkIsString(params?.token)) {
                requestError(res, params?.device_type, "token must be string")
            } else if (!checkIsset(params?.login_user_id)) {
                requestParam(res, params?.device_type, "login_user_id")
            } else if (!checkIsNumber(params?.login_user_id)) {
                requestError(res, params?.device_type, "login_user_id must be number")
            }

            else if (!checkIsset(params?.login_user_type)) {
                requestParam(res, params?.device_type, "login_user_type")
            } else if (!checkIsString(params?.login_user_type)) {
                requestError(res, params?.device_type, "login_user_type must be string")
            } else {
                data = await updateAdminSetting(params, 'token', params?.token);
                user = await getAdminSettingsByToken(params?.token);
                checkDeviceType(res, user, "admin setting", params?.device_type, "update");
            }
        }
        // console.log("user--", user)
        // console.log("data--", data)

        // let keyName = ""
        // let keyValue = null
        // if (req?.body?.id) {
        //     keyName = "id"
        //     keyValue = req.body.id
        // }
        // if (req?.body?.token) {
        //     keyName = "token"
        //     keyValue = req.body.token
        // }


        // data = await updateAdminSetting(req.body, keyName, keyValue);
        // if (req?.body?.id) {
        //     user = await getAdminSettingsById(req?.body?.id);
        // }
        // if (req?.body?.token) {
        //     user = await getAdminSettingsByToken(req?.body?.token);
        // }
        // res.json(successResponse("attr_admin_settings " + messageForUpdateData, user[0]));

    }
}