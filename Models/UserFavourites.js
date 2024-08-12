const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getUserFavourite = async (body) => { 
    const query = "SELECT * FROM user_favourites ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getUserFavouriteById = async (id) => {
    const query = "SELECT * FROM user_favourites WHERE id=?";
    let refTable = ''
    let = mainData = {}
    let favourite = await promise_connection(query, [id]);
    if (favourite[0].ref_type === 'business') { refTable = 'user_businesses' }
    if (favourite[0].ref_type === 'meal_plan') { refTable = 'product_meal_plans' }
    const refQuery = `SELECT * FROM ${refTable} WHERE token=?`;
    let refData = await promise_connection(refQuery, [favourite[0].token_ref]);
    mainData = { ...favourite[0], ref: refData }
    return mainData;
};

exports.getUserFavouriteByToken = async (token) => {
    const query = "SELECT * FROM user_favourites WHERE token=?";
    let refTable = ''
    let = mainData = {}
    let favourite = await promise_connection(query, [token]);
    if (favourite[0].ref_type === 'business') { refTable = 'user_businesses' }
    if (favourite[0].ref_type === 'meal_plan') { refTable = 'product_meal_plans' }
    const refQuery = `SELECT * FROM ${refTable} WHERE token=?`;
    let refData = await promise_connection(refQuery, [favourite[0].token_ref]);
    mainData = { ...favourite[0], ref: refData }
    return mainData;
};


exports.addUserFavourite = async (data) => {
    const fieldsQuery = "DESCRIBE user_favourites";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_favourites WHERE token=?";
    let token = CreateToken('uf')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('uf')
    }
    let dataSet = []
    let query = 'INSERT INTO user_favourites (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';

    dataSet.push(CreateSlug("user_favourites " + timestamp))
    query = query + "`" + "slug" + "`" + ',';

    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUserFavourite = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM user_favourites WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_favourites";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_favourites SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("user_favourites " + timestamp))
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