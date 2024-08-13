const { checkIsString } = require("./constant");


exports.CreateSlug = (data) => {
    let text = "";
    if (data && checkIsString(data)) {
        let text = data?.replaceAll(" ", "_").toLowerCase()
        text = text?.replace(/[&\/\\#,@+()$~%.'":*?=<>[{}]/g, '');
    }
    return text
}


exports.CreateToken = (text) => {
    let token = text.toLocaleUpperCase() + Math.random().toString(36).substr(2, 20).toLocaleUpperCase().slice(0, 8);

    return token
}



exports.errorResponse = (message) => {
    return ({
        error: true,
        message: message,
        data: null,
        status: 400

    })
}

exports.successResponse = (message, data) => {
    return ({
        error: false,
        message: message,
        data: data,
        status: 200
    })
}

exports.messageForGetData = "details collected successfully"
exports.messageForUpdateData = "details update successfully"
exports.messageForInsertData = "details inserted successfully"

