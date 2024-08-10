const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getUser = async () => {
    const query = "SELECT * FROM users";
    return await promise_connection(query);
};

exports.getUserById = async (id) => {
    const query = "SELECT * FROM users WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserByToken = async (token) => {
    const query = "SELECT * FROM users WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUser = async (data) => {
    const fieldsQuery = "DESCRIBE users";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM users WHERE token=?";
    let token = CreateToken('us')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('us')
    }
    let dataSet = []
    let query = 'INSERT INTO users (';
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

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUser = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM users WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE users";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE users SET ';
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
    console.log("dataSet--", dataSet)
    console.log("mailQuery--", mailQuery)

    return await promise_connection(mailQuery, dataSet);
};