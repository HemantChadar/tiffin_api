const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getUserDeviceToken = async () => {
    const query = "SELECT * FROM user_device_tokens";
    return await promise_connection(query);
};

exports.getUserDeviceTokenById = async (id) => {
    const query = "SELECT * FROM user_device_tokens WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserDeviceTokenByToken = async (token) => {
    const query = "SELECT * FROM user_device_tokens WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUserDeviceToken = async (data) => {
    const fieldsQuery = "DESCRIBE user_device_tokens";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_device_tokens WHERE token=?";
    let token = CreateToken('dt')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('dt')
    }
    let dataSet = []
    let query = 'INSERT INTO user_device_tokens (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';

    dataSet.push(CreateSlug("user_device_tokens " + timestamp))
    query = query + "`" + "slug" + "`" + ',';

    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUserDeviceToken = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM user_device_tokens WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_device_tokens";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_device_tokens SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("user_device_tokens " + timestamp))
                query = query + element.Field + '=?,';
            } else {
                query = query + element.Field + '=?,';
                dataSet.push(prevData[0][element.Field])
            }
        }
    });
    mailQuery = query.substring(0, query.length - 1) + ` WHERE ${keyName}=${keyValue}`;

    return await promise_connection(mailQuery, dataSet);
};