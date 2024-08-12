const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getGeneralPages = async (body) => {
    const query = "SELECT * FROM attr_general_pages ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getGeneralPagesById = async (id) => {
    const query = "SELECT * FROM attr_general_pages WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getGeneralPagesByToken = async (token) => {
    const query = "SELECT * FROM attr_general_pages WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addGeneralPages = async (data) => {
    const fieldsQuery = "DESCRIBE attr_general_pages";
    let fieldsName = await promise_connection(fieldsQuery)

    const checkTokenQuery = "SELECT * FROM attr_general_pages WHERE token=?";
    let token = CreateToken('gp')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('gp')
    }


    let dataSet = []
    let query = 'INSERT INTO attr_general_pages (';
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

exports.updateGeneralPages = async (data,keyName,keyValue) => {
    const previousDataQuery = `SELECT * FROM attr_general_pages WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE attr_general_pages";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE attr_general_pages SET ';
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
    return await promise_connection(mailQuery, dataSet);
};