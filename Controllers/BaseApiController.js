// const requestParam = (param) => {
//     return ({
//         error: true,
//         message: message,
//         data: null
//     })

const { HTTP_BAD_REQUEST, HTTP_OK, checkIsObject, TOKEN, checkIsArray, HTTP_NOT_FOUND, HTTP_RESET_CONTENT } = require("../Conection/constant");

// }

exports.removeNameValuePairs = (inputs) => {
    let params = { ...inputs };
    if (params?.nameValuePairs) {
        params = params?.nameValuePairs;
    }

    if (!checkIsObject(params)) {
        let object = {};
        params?.forEach((value, key) => {
            object.key = value;
        });

        params = { ...object };
    }
    return params;
}

exports.verifyParams = (response, inputs) => {
    let params = { ...inputs };
    // params = request;
    if (params?.nameValuePairs) {
        params = params?.nameValuePairs;
    }

    if (!checkIsObject(params)) {
        let object = {};
        params?.forEach((value, key) => {
            object.key = value;
        });

        params = { ...object };
    }

    if (!params?.device_type) {
        return this.requestParam(response, 'android', "Device type");
    } else if (!params?.tctoken) {
        return this.requestError(response, params?.device_type, "Token required to continue");
    } else if (params?.tctoken !== TOKEN) {
        return this.requestError(response, params?.device_type, "Token given is not valid");
    } else {
        return null;
    }
}

exports.requestParam = (res, deviceType = 'android', params = null, additionalData = null) => {
    if (params) {
        let message = {
            'error': true,
            'message': params + ' required to continue.',
            'data': [],
            'status': HTTP_BAD_REQUEST
        };
        if (deviceType == 'android') {
            message.data = null;
        } else {
            message.data = [];
        }
        if (additionalData && Array.isArray(additionalData)) {
            message = [...message, ...additionalData];
        }
        return res.status(HTTP_OK).json(message);
    } else {
        return res.status(HTTP_OK).json({
            'error': true,
            'message': "NOT FOUND",
            'data': null,
            'status': HTTP_BAD_REQUEST
        });;
    }
}
exports.requestError = (res, deviceType = 'android', params = null, additionalData = null) => {
    if (params) {
        let message = {
            'error': true,
            'message': params,
            'data': [],
            'status': HTTP_BAD_REQUEST
        };
        if (deviceType == 'android') {
            message.data = null;
        } else {
            message.data = [];
        }
        if (additionalData && Array.isArray(additionalData)) {
            message = [...message, ...additionalData];
        }
        return res.status(HTTP_OK).json(message);
    } else {
        return res.status(HTTP_OK).json({
            'error': true,
            'message': "NOT FOUND",
            'data': null,
            'status': HTTP_BAD_REQUEST
        });
    }
}

exports.checkDeviceType = (res, data, dataTitle, deviceType = 'android', action = 'found', additionalData = false) => {
    if (deviceType == 'ios') {
        if (is_array(data)) {
            return this.sendData(res, data, dataTitle, action, additionalData, deviceType);
        } else {
            if (data) {
                dataArray = [data];
            } else {
                dataArray = data;
            }
            return this.sendData(res, dataArray, dataTitle, action, additionalData, deviceType);
        }
    } else {
        return this.sendData(res, data, dataTitle, action, additionalData, deviceType);
    }
}

exports.sendData = (res, data, dataTitle, action = 'found', additionalData = null, deviceType = 'android') => {
    if (data) {
        message = {
            'message': dataTitle + ' ' + action + ' successfully',
            'error': false,
            'data': data,
            'status': HTTP_OK
        };
        if (additionalData && checkIsArray(additionalData)) {
            message = [...message, ...additionalData];
        }
        return res.status(HTTP_OK).json(message);
    } else if (data?.length<=0) {
        message = {
            'error': true,
            'message': dataTitle + ' can not be ' + action + '. Please try later.',
            'status': HTTP_RESET_CONTENT
        };
        if (deviceType == 'android') {
            message.data = null;
        } else {
            message.data = [];
        }
        if (additionalData && checkIsArray(additionalData)) {
            message = [...message, ...additionalData];
        }
        return res.status(HTTP_OK).json(message);
    } else {
        // Set the response and exit
        message = {
            'error': true,
            'message': dataTitle + ' can not be ' + action + '. Please try later.',
            'status': HTTP_NOT_FOUND
        };
        if (deviceType === 'android') {
            message.data = null;
        } else {
            message.data = [];
        }

        if (additionalData && checkIsArray(additionalData)) {
            message = [...message, ...additionalData];
        }
        return res.status(HTTP_OK).json(message);
    }
}



exports.requestSuccess = (res, deviceType = 'android', message = "", dataParam = null) => {
    if (message) {
        message = {
            'error': false,
            'message': message,
            'data': dataParam,
            'status': HTTP_OK
        };
        if (deviceType == 'android') {
            message.data = dataParam;
        } else {
            message.data = dataParam ?? [];
        }
        return res.json(message, HTTP_OK);
    } else {
        return message;
    }
}