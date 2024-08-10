const { getAdminSettings, getAdminSettingsById, getAdminSettingsByToken, addAdminSettings, updateAdminSetting } = require("../Models/AttrAdminSettings")



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
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getAdminSettingsById(req?.body?.id);
            if (data?.length >= 1) {
                res.json(successResponse("data settings successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getAdminSettingsByToken(req?.body?.token);
            if (data?.length >= 1) {
                res.json(successResponse("data settings successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getAdminSettings();
            if (data?.length >= 1) {
                res.json(successResponse("data settings successfully get", data))
            } else {
                res.json(errorResponse("data settings is not availble "))
            }
        }

    } catch (error) {
        res.json(errorResponse(error))
    }
}


exports.addAdminSettings = async (req, res) => {
    let data = [];
    try {
        data = await addAdminSettings(req.body);
        const user = await getAdminSettingsById(data.insertId);

        res.json(successResponse("data successfully inserted", user[0]))

    } catch (error) {
        res.json(errorResponse(error))

    }
}


exports.updateAdminSetting = async (req, res) => {
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
        data = await updateAdminSetting(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getAdminSettingsById(req?.body?.id);
        }
        if (req?.body?.token) {
            user = await getAdminSettingsByToken(req?.body?.token);
        }
        res.json(successResponse("data settings successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}