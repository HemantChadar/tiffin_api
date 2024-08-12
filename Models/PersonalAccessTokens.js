const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getPersonalAccessToken = async (body) => { 
    const query = "SELECT * FROM personal_access_tokens ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getPersonalAccessTokenById = async (id) => {
    const query = "SELECT * FROM personal_access_tokens WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getPersonalAccessTokenByToken = async (token) => {
    const query = "SELECT * FROM personal_access_tokens WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addPersonalAccessToken = async (data) => {
    const fieldsQuery = "DESCRIBE personal_access_tokens";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM personal_access_tokens WHERE token=?";
    let token = CreateToken('at')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('at')
    }
    let dataSet = []
    let query = 'INSERT INTO personal_access_tokens (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
    // if (data.name) { 
    //     dataSet.push(CreateSlug(data.name))
    //     query = query + "`" + "slug" + "`" + ',';
    // }
    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updatePersonalAccessToken = async (data,keyName,keyValue) => { 
    const previousDataQuery = `SELECT * FROM personal_access_tokens WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE personal_access_tokens";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE personal_access_tokens SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            // if (element.Field === "slug") {
            //     dataSet.push(CreateSlug(data.name))
            //     query = query + element.Field + '=?,';
            // } else {
            //     query = query + element.Field + '=?,';
            //     dataSet.push(prevData[0][element.Field])
            // }
            query = query + element.Field + '=?,';
            dataSet.push(prevData[0][element.Field])
        }
    }); 
    mailQuery = query.substring(0, query.length - 1) + ` WHERE ${keyName}=${keyValue}`;
    console.log("dataSet--", dataSet)
    console.log("mailQuery--", mailQuery)

    return await promise_connection(mailQuery, dataSet);
};