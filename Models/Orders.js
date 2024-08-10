const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
let date = new Date()
const currentDate = new Date();
const timestamp = currentDate.getTime();

const promise_connection = promisify(conection.query).bind(conection);

exports.getOrder = async () => {
    const query = "SELECT * FROM orders";
    return await promise_connection(query);
};

exports.getOrderById = async (id) => {
    const query = "SELECT * FROM orders WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getOrderByToken = async (token) => {
    const query = "SELECT * FROM orders WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addOrder = async (data) => {
    const fieldsQuery = "DESCRIBE orders";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM orders WHERE token=?";
    let token = CreateToken('or')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('or')
    }
    let dataSet = []
    let query = 'INSERT INTO orders (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
    dataSet.push(CreateSlug("orders " + timestamp))
    query = query + "`" + "slug" + "`" + ',';
    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';
 
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateOrder = async (data, keyName, keyValue) => {
    const previousDataQuery = `SELECT * FROM orders WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE orders";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE orders SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("orders " + timestamp))
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