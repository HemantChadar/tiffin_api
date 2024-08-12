const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getProductTypeItem = async (body) => { 
    const query = "SELECT * FROM product_type_items ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getProductTypeItemById = async (id) => {
    const query = "SELECT * FROM product_type_items WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getProductTypeItemByToken = async (token) => {
    const query = "SELECT * FROM product_type_items WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addProductTypeItem = async (data) => {
    const fieldsQuery = "DESCRIBE product_type_items";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM product_type_items WHERE token=?";
    let token = CreateToken('pi')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('pi')
    }
    let dataSet = []
    let query = 'INSERT INTO product_type_items (';
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

exports.updateProductTypeItem = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM product_type_items WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE product_type_items";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE product_type_items SET ';
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