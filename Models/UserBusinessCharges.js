const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getUserBusinessCharge = async (body) => { 
    const query = "SELECT * FROM user_business_charges ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getUserBusinessChargeById = async (id) => {
    const query = "SELECT * FROM user_business_charges WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserBusinessChargeByToken = async (token) => {
    const query = "SELECT * FROM user_business_charges WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUserBusinessCharge = async (data) => {
    const fieldsQuery = "DESCRIBE user_business_charges";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_business_charges WHERE token=?";
    let token = CreateToken('bc')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('bc')
    }
    let dataSet = []
    let query = 'INSERT INTO user_business_charges (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
 
    dataSet.push(CreateSlug("user_business_charges " + timestamp))
    query = query + "`" + "slug" + "`" + ',';

    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';
 
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUserBusinessCharge = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM user_business_charges WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_business_charges";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_business_charges SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("user_business_charges " + timestamp))
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