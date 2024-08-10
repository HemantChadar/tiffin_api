const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getUserBusiness = async () => {
    const query = "SELECT * FROM user_businesses";
    return await promise_connection(query);
};

exports.getUserBusinessById = async (id) => {
    const query = "SELECT * FROM user_businesses WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserBusinessByToken = async (token) => {
    const query = "SELECT * FROM user_businesses WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUserBusiness = async (data) => {
    const fieldsQuery = "DESCRIBE user_businesses";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_businesses WHERE token=?";
    let token = CreateToken('ub')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('ub')
    }
    let dataSet = []
    let query = 'INSERT INTO user_businesses (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
    if (data?.name) { 
        dataSet.push(CreateSlug(data?.name))
        query = query + "`" + "slug" + "`" + ',';
    }
    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';
 
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUserBusiness = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM user_businesses WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_businesses";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_businesses SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug(data?.name))
                query = query + element.Field + '=?,';
            } else {
                query = query + element.Field + '=?,';
                dataSet.push(prevData[0][element.Field])
            }
        }
    });
    // dataSet.push(data.id)
    mailQuery = query.substring(0, query.length - 1) + ` WHERE ${keyName}=${keyValue}`;

    return await promise_connection(mailQuery, dataSet);
};