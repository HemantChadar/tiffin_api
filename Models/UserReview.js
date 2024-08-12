const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getUserReview = async (body) => { 
    const query = "SELECT * FROM user_review_and_ratings ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body.limit
    let offset = body.offset * body.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getUserReviewById = async (id) => {
    const query = "SELECT * FROM user_review_and_ratings WHERE id=?";
    let refTable = ''


    let = mainData = {}
    let reviewData = await promise_connection(query, [id]);

    if (reviewData[0].ref_type === 'user') { refTable = 'users' }
    if (reviewData[0].ref_type === 'subscription') { refTable = 'user_subscriptions' }
    if (reviewData[0].ref_type === 'order') { refTable = 'orders' }
    if (reviewData[0].ref_type === 'business') { refTable = 'user_businesses' }

    const refQuery = `SELECT * FROM ${refTable} WHERE token=?`;

    let refData = await promise_connection(refQuery, [reviewData[0].token_ref]);
    mainData = { ...reviewData[0], ref: refData }
    console.log("refQuery--",refQuery)
    return mainData;
};

exports.getUserReviewByToken = async (token) => {
    const query = "SELECT * FROM user_review_and_ratings WHERE token=?";
    let refTable = ''
    let = mainData = {}
    let reviewData = await promise_connection(query, [token]);

    if (reviewData[0].ref_type === 'user') { refTable = 'users' }
    if (reviewData[0].ref_type === 'subscription') { refTable = 'user_subscriptions' }
    if (reviewData[0].ref_type === 'order') { refTable = 'orders' }
    if (reviewData[0].ref_type === 'business') { refTable = 'user_businesses' }

    const refQuery = `SELECT * FROM ${refTable} WHERE token=?`;

    let refData = await promise_connection(refQuery, [reviewData[0].token_ref]);
    mainData = { ...reviewData[0], ref: refData }
    console.log("refQuery--",refQuery)
    return mainData;


    // return await promise_connection(query, [token]);
};


exports.addUserReview = async (data) => {
    const fieldsQuery = "DESCRIBE user_review_and_ratings";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_review_and_ratings WHERE token=?";
    let token = CreateToken('ur')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('ur')
    }
    let dataSet = []
    let query = 'INSERT INTO user_review_and_ratings (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
    dataSet.push(CreateSlug("user_review_and_ratings " + timestamp))
    query = query + "`" + "slug" + "`" + ',';

    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUserReview = async (data, keyName, keyValue) => {

    const previousDataQuery = `SELECT * FROM user_review_and_ratings WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_review_and_ratings";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_review_and_ratings SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("user_review_and_ratings " + timestamp))
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