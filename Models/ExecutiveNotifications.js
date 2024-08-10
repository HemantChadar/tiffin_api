const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');

const promise_connection = promisify(conection.query).bind(conection);

exports.getExecutiveNotification = async () => {
    const query = "SELECT * FROM user_executive_notifications";
    return await promise_connection(query);
};

exports.getExecutiveNotificationById = async (id) => {
    const query = "SELECT * FROM user_executive_notifications WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getExecutiveNotificationByToken = async (token) => {
    const query = "SELECT * FROM user_executive_notifications WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addExecutiveNotification = async (data) => {
    const fieldsQuery = "DESCRIBE user_executive_notifications";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_executive_notifications WHERE token=?";
    let token = CreateToken('en')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('en')
    }
    let dataSet = []
    let query = 'INSERT INTO user_executive_notifications (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
    if (data.title) {
        dataSet.push(CreateSlug(data.title))
        query = query + "`" + "slug" + "`" + ',';
    }
    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateExecutiveNotification = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM user_executive_notifications WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_executive_notifications";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_executive_notifications SET ';
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