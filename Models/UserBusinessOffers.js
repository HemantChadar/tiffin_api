const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getUserBusinessOffer = async () => {
    const query = "SELECT * FROM user_business_offers";
    return await promise_connection(query);
};

exports.getUserBusinessOfferById = async (id) => {
    const query = "SELECT * FROM user_business_offers WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserBusinessOfferByToken = async (token) => {
    const query = "SELECT * FROM user_business_offers WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUserBusinessOffer = async (data) => {
    const fieldsQuery = "DESCRIBE user_business_offers";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_business_offers WHERE token=?";
    let token = CreateToken('bo')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('bo')
    }
    let dataSet = []
    let query = 'INSERT INTO user_business_offers (';
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

exports.updateUserBusinessOffer = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM user_business_offers WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_business_offers";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_business_offers SET ';
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