const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getAdminOffer = async () => {
    const query = "SELECT * FROM attr_admin_offers";
    return await promise_connection(query);
};

exports.getAdminOfferById = async (id) => {
    const query = "SELECT * FROM attr_admin_offers WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getAdminOfferByToken = async (token) => {
    const query = "SELECT * FROM attr_admin_offers WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addAdminOffer = async (data) => {
    const fieldsQuery = "DESCRIBE attr_admin_offers";
    let fieldsName = await promise_connection(fieldsQuery)

    const checkTokenQuery = "SELECT * FROM attr_admin_offers WHERE token=?";
    let token = CreateToken('ao')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('ao')
    }

    let dataSet = []
    let query = 'INSERT INTO attr_admin_offers (';
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

exports.updateAdminOffer = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM attr_admin_offers WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE attr_admin_offers";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE attr_admin_offers SET ';
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