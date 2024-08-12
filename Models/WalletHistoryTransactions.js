const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getHistoryTransaction = async (body) => {
    const query = "SELECT * FROM user_wallet_history_transactions ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getHistoryTransactionById = async (id) => {
    const query = "SELECT * FROM user_wallet_history_transactions WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getHistoryTransactionByToken = async (token) => {
    const query = "SELECT * FROM user_wallet_history_transactions WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addHistoryTransaction = async (data) => {
    const fieldsQuery = "DESCRIBE user_wallet_history_transactions";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_wallet_history_transactions WHERE token=?";
    let token = CreateToken('ht')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('ht')
    }
    let dataSet = []
    let query = 'INSERT INTO user_wallet_history_transactions (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';

    dataSet.push(CreateSlug("user_wallet_history_transactions " + timestamp))
    query = query + "`" + "slug" + "`" + ',';

    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateHistoryTransaction = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM user_wallet_history_transactions WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_wallet_history_transactions";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_wallet_history_transactions SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("user_wallet_history_transactions " + timestamp))
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