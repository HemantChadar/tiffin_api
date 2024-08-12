const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getOrderProductType = async (body) => { 
    const query = "SELECT * FROM order_product_types ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getOrderProductTypeById = async (id) => {
    const query = "SELECT * FROM order_product_types WHERE id=?";
    const orderQuery = "SELECT * FROM orders WHERE token=?";
    let = mainData = {}
    let productType = await promise_connection(query, [id]);
    let orderData = await promise_connection(orderQuery, [productType[0].token_order]);
    mainData = { ...productType[0], order: orderData }
    return mainData;
};

exports.getOrderProductTypeByToken = async (token) => {
    const query = "SELECT * FROM order_product_types WHERE token=?";

    const orderQuery = "SELECT * FROM orders WHERE token=?";
    let = mainData = {}
    let productType = await promise_connection(query, [token]);
    let orderData = await promise_connection(orderQuery, [productType[0].token_order]);
    mainData = { ...productType[0], order: orderData }
    return mainData;

 
};


exports.addOrderProductType = async (data) => {
    const fieldsQuery = "DESCRIBE order_product_types";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM order_product_types WHERE token=?";
    let token = CreateToken('pt')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('pt')
    }
    let dataSet = []
    let query = 'INSERT INTO order_product_types (';
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

exports.updateOrderProductType = async (data, keyName, keyValue) => {


    const previousDataQuery = `SELECT * FROM order_product_types WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE order_product_types";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE order_product_types SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug(data.title))
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
    console.log("dataSet--", dataSet)
    console.log("mailQuery--", mailQuery)

    return await promise_connection(mailQuery, dataSet);
};