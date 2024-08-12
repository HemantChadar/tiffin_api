const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getUserQueryResponse = async (body) => { 
    const query = "SELECT * FROM user_query_responses ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getUserQueryResponseById = async (id) => {
    const query = "SELECT * FROM user_query_responses WHERE id=?";
 
    const attachmentsQuery = "SELECT * FROM user_query_response_attachments WHERE token_query_response=?";
    let = mainData = {}
    let queryResponse = await promise_connection(query, [id]);
    let queryAttachments = await promise_connection(attachmentsQuery, [queryResponse[0].token]);


    mainData = { ...queryResponse[0], attachments: queryAttachments }
    return mainData;

    // return await promise_connection(query, [id]);
};

exports.getUserQueryResponseByToken = async (token) => {
    const query = "SELECT * FROM user_query_responses WHERE token=?";
    const attachmentsQuery = "SELECT * FROM user_query_response_attachments WHERE token_query_response=?";

    let = mainData = {}
    let queryResponse = await promise_connection(query, [token]);
    let queryAttachments = await promise_connection(attachmentsQuery, [queryResponse[0].token]);


    mainData = { ...queryResponse[0], attachments: queryAttachments }
    return mainData;


    //  return
};


exports.addUserQueryResponse = async (data) => {
    const fieldsQuery = "DESCRIBE user_query_responses";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_query_responses WHERE token=?";
    let token = CreateToken('qr')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('qr')
    }
    let dataSet = []
    let query = 'INSERT INTO user_query_responses (';
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

exports.updateUserQueryResponse = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM user_query_responses WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_query_responses";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_query_responses SET ';
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