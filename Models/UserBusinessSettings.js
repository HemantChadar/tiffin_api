const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getUserBusinessSetting = async (body) => { 
    const query = "SELECT * FROM user_business_settings ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getUserBusinessSettingById = async (id) => {
    const query = "SELECT * FROM user_business_settings WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserBusinessSettingByToken = async (token) => {
    const query = "SELECT * FROM user_business_settings WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUserBusinessSetting = async (data) => {
    const fieldsQuery = "DESCRIBE user_business_settings";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_business_settings WHERE token=?";
    let token = CreateToken('bs')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('bs')
    }
    let dataSet = []
    let query = 'INSERT INTO user_business_settings (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
    if (data?.title) {
        dataSet.push(CreateSlug(data?.title))
        query = query + "`" + "slug" + "`" + ',';
    }
    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUserBusinessSetting = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM user_business_settings WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_business_settings";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_business_settings SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug(data?.title))
                query = query + element.Field + '=?,';
            } else if (element.Field === "updated_at") {
                dataSet.push(new Date())
                query = query + element.Field + '=?,';
            }
             else {
                query = query + element.Field + '=?,';
                dataSet.push(prevData[0][element.Field])
            }
        }
    });
    // dataSet.push(data.id)
    mailQuery = query.substring(0, query.length - 1) + ` WHERE ${keyName}=${keyValue}`;

    return await promise_connection(mailQuery, dataSet);
};