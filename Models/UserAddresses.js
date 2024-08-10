const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getUserAddresses = async () => {
    const query = "SELECT * FROM user_addresses";
    return await promise_connection(query);
};

exports.getUserAddressesById = async (id) => {
    const query = "SELECT * FROM user_addresses WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserAddressesByToken = async (token) => {
    const query = "SELECT * FROM user_addresses WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUserAddresses = async (data) => {
    const fieldsQuery = "DESCRIBE user_addresses";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_addresses WHERE token=?";
    let token = CreateToken('ua')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('ua')
    }
    let dataSet = []
    let query = 'INSERT INTO user_addresses (';
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

exports.updateUserAddresses = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM user_addresses WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_addresses";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_addresses SET ';
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