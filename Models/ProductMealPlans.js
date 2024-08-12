const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getProductMealPlan = async (body) => { 
    const query = "SELECT * FROM product_meal_plans ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getProductMealPlanById = async (id) => {
    const query = "SELECT * FROM product_meal_plans WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getProductMealPlanByToken = async (token) => {
    const query = "SELECT * FROM product_meal_plans WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addProductMealPlan = async (data) => {
    const fieldsQuery = "DESCRIBE product_meal_plans";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM product_meal_plans WHERE token=?";
    let token = CreateToken('mp')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('mp')
    }
    let dataSet = []
    let query = 'INSERT INTO product_meal_plans (';
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

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateProductMealPlan = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM product_meal_plans WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE product_meal_plans";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE product_meal_plans SET ';
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
    console.log("dataSet--", dataSet)
    console.log("mailQuery--", mailQuery)

    return await promise_connection(mailQuery, dataSet);
};