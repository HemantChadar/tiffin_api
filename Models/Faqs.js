const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getFaq = async (body) => {
    const query = "SELECT * FROM faqs ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);

};

exports.getFaqById = async (id) => {
    const query = "SELECT * FROM faqs WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getFaqByToken = async (token) => {
    const query = "SELECT * FROM faqs WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addFaq = async (data) => {
    const fieldsQuery = "DESCRIBE faqs";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM faqs WHERE token=?";
    let token = CreateToken('fq')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('fq')
    }
    let dataSet = []
    let query = 'INSERT INTO faqs (';
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

exports.updateFaq = async (data, keyName, keyValue) => {
    const previousDataQuery = `SELECT * FROM faqs WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE faqs";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE faqs SET ';
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
            }
            else if (element.Field === "updated_at") {
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