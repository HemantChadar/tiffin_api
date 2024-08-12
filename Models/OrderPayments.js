const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getOrderPayments = async (body) => { 
    const query = "SELECT * FROM order_payments ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getOrderPaymentsById = async (id) => {
    const query = "SELECT * FROM order_payments WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getOrderPaymentsByToken = async (token) => {
    const query = "SELECT * FROM order_payments WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addOrderPayments = async (data) => {
    const fieldsQuery = "DESCRIBE order_payments";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM order_payments WHERE token=?";
    let token = CreateToken('op')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('op')
    }
    let dataSet = []
    let query = 'INSERT INTO order_payments (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';

    dataSet.push(CreateSlug("order_payments " + timestamp))
    query = query + "`" + "slug" + "`" + ',';

    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';
 
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateOrderPayments = async (data, keyName, keyValue) => {
    const previousDataQuery = `SELECT * FROM order_payments WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE order_payments";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE order_payments SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("order_payments " + timestamp))
                query = query + element.Field + '=?,';
            }  else if (element.Field === "updated_at") {
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
    console.log("dataSet--", dataSet)
    console.log("mailQuery--", mailQuery)

    return await promise_connection(mailQuery, dataSet);
};