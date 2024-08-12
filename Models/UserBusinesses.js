const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getUserBusiness = async (body) => { 
    const query = "SELECT * FROM user_businesses ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getUserBusinessById = async (id) => {
    const query = "SELECT * FROM user_businesses WHERE id=?";



    const chargeQuery = "SELECT * FROM user_business_charges WHERE token_business=?";
    const userQuery = "SELECT * FROM users WHERE token=?";

    let = mainData = {}
    let businessData = await promise_connection(query, [id]);
    let chargeData = await promise_connection(chargeQuery, [businessData[0].token]);
    let userData = await promise_connection(userQuery, [businessData[0].token_user]);



    mainData = { ...businessData[0], user: userData, charges: chargeData }

    return mainData;




    // return await promise_connection(query, [id]);
};

exports.getUserBusinessByToken = async (token) => {
    const query = "SELECT * FROM user_businesses WHERE token=?";



    const chargeQuery = "SELECT * FROM user_business_charges WHERE token_business=?";
    const userQuery = "SELECT * FROM users WHERE token=?";

    let = mainData = {}
    let businessData = await promise_connection(query, [token]);
    let chargeData = await promise_connection(chargeQuery, [businessData[0].token]);
    let userData = await promise_connection(userQuery, [businessData[0].token_user]);



    mainData = { ...businessData[0], user: userData, charges: chargeData }

    return mainData;



    // return await promise_connection(query, [token]);
};


exports.addUserBusiness = async (data) => {
    const fieldsQuery = "DESCRIBE user_businesses";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_businesses WHERE token=?";
    let token = CreateToken('ub')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('ub')
    }
    let dataSet = []
    let query = 'INSERT INTO user_businesses (';
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

exports.updateUserBusiness = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM user_businesses WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_businesses";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_businesses SET ';
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