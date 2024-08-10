const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getProductTypeTimeout = async () => {
    const query = "SELECT * FROM product_type_timeouts";
    return await promise_connection(query);
};

exports.getProductTypeTimeoutById = async (id) => {
    const query = "SELECT * FROM product_type_timeouts WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getProductTypeTimeoutByToken = async (token) => {
    const query = "SELECT * FROM product_type_timeouts WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addProductTypeTimeout = async (data) => {
    const fieldsQuery = "DESCRIBE product_type_timeouts";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM product_type_timeouts WHERE token=?";
    let token = CreateToken('pt')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('pt')
    }
    let dataSet = []
    let query = 'INSERT INTO product_type_timeouts (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
 
    dataSet.push(CreateSlug("product_type_timeouts "+timestamp))
    query = query + "`" + "slug" + "`" + ',';

    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';
 
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateProductTypeTimeout = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM product_type_timeouts WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE product_type_timeouts";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE product_type_timeouts SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("product_type_timeouts "+timestamp))
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