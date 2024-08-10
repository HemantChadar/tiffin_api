const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getUserQueryResponse = async () => {
    const query = "SELECT * FROM user_query_responses";
    return await promise_connection(query);
};

exports.getUserQueryResponseById = async (id) => {
    const query = "SELECT * FROM user_query_responses WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserQueryResponseByToken = async (token) => {
    const query = "SELECT * FROM user_query_responses WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUserQueryResponse = async (data) => {
    const fieldsQuery = "DESCRIBE user_query_responses";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_query_responses WHERE token=?";
    let token = CreateToken('qr')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('qr')
    }
    let dataSet = []
    let query = 'INSERT INTO user_query_responses (';
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

exports.updateUserQueryResponse = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM user_query_responses WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_query_responses";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_query_responses SET ';
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
            } else {
                query = query + element.Field + '=?,';
                dataSet.push(prevData[0][element.Field])
            }
        }
    });
    // dataSet.push(data.id)
    mailQuery = query.substring(0, query.length - 1) + ` WHERE ${keyName}=${keyValue}`;
    console.log("dataSet--", dataSet)
    console.log("mailQuery--", mailQuery)

    return await promise_connection(mailQuery, dataSet);
};