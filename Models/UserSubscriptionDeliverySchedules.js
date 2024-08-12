const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
    const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getSubscriptionDeliverySchedule = async (body) => {  
    const query = "SELECT * FROM user_subscription_delivery_schedules ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getSubscriptionDeliveryScheduleById = async (id) => {
    const query = "SELECT * FROM user_subscription_delivery_schedules WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getSubscriptionDeliveryScheduleByToken = async (token) => {
    const query = "SELECT * FROM user_subscription_delivery_schedules WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addSubscriptionDeliverySchedule = async (data) => {
    const fieldsQuery = "DESCRIBE user_subscription_delivery_schedules";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_subscription_delivery_schedules WHERE token=?";
    let token = CreateToken('ds')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('ds')
    }
    let dataSet = []
    let query = 'INSERT INTO user_subscription_delivery_schedules (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
      
        dataSet.push(CreateSlug("user_subscription_delivery_schedules " + timestamp))
        query = query + "`" + "slug" + "`" + ',';
     
    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateSubscriptionDeliverySchedule = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM user_subscription_delivery_schedules WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_subscription_delivery_schedules";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_subscription_delivery_schedules SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("user_subscription_delivery_schedules " + timestamp))
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