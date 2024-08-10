

exports.CreateSlug = (data) => {
    let text = data.replaceAll(" ", "_").toLowerCase()
    text = text.replace(/[&\/\\#,@+()$~%.'":*?=<>[{}]/g, '');

    return text
}


exports.CreateToken = (text) => {
    let token = text.toLocaleUpperCase() + Math.random().toString(36).substr(2, 20).toLocaleUpperCase().slice(0, 8);

    return token
}