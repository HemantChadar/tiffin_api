const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getUserSubscription = async (body) => { 
    const query = "SELECT * FROM user_subscriptions ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getUserSubscriptionById = async (id) => {
    const query = "SELECT * FROM user_subscriptions WHERE id=?";
    let = mainData = {}
    const businessQuery = "SELECT * FROM user_businesses WHERE token=?";
    const planQuery = "SELECT * FROM product_meal_plans WHERE token=?";
    const scheduleQuery = "SELECT * FROM user_subscription_delivery_schedules WHERE token_user_subscription=?";
    let subscription = await promise_connection(query, [id]);
    let businessData = await promise_connection(businessQuery, [subscription[0].token_business]);
    let planData = await promise_connection(planQuery, [subscription[0].token_meal_plan]);
    let scheduleData = await promise_connection(scheduleQuery, [subscription[0].token]);
    mainData = { ...subscription[0], business: businessData, meal_plan: planData, schedules: scheduleData }

    return mainData;
};

exports.getUserSubscriptionByToken = async (token) => {
    const query = "SELECT * FROM user_subscriptions WHERE token=?";
    let = mainData = {}
    const businessQuery = "SELECT * FROM user_businesses WHERE token=?";
    const planQuery = "SELECT * FROM product_meal_plans WHERE token=?";
    const scheduleQuery = "SELECT * FROM user_subscription_delivery_schedules WHERE token_user_subscription=?";
    let subscription = await promise_connection(query, [token]);
    let businessData = await promise_connection(businessQuery, [subscription[0].token_business]);
    let planData = await promise_connection(planQuery, [subscription[0].token_meal_plan]);
    let scheduleData = await promise_connection(scheduleQuery, [subscription[0].token]);
    mainData = { ...subscription[0], business: businessData, meal_plan: planData, schedules: scheduleData }

    return mainData;




    // return await promise_connection(query, [token]);
};


exports.addUserSubscription = async (data) => {
    const fieldsQuery = "DESCRIBE user_subscriptions";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_subscriptions WHERE token=?";
    let token = CreateToken('us')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('us')
    }
    let dataSet = []
    let query = 'INSERT INTO user_subscriptions (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';

    dataSet.push(CreateSlug("user_subscriptions " + timestamp))
    query = query + "`" + "slug" + "`" + ',';

    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUserSubscription = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM user_subscriptions WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_subscriptions";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_subscriptions SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("user_subscriptions " + timestamp))
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