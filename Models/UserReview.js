const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getUserReview = async () => {
    const query = "SELECT * FROM user_review_and_ratings";
    return await promise_connection(query);
};

exports.getUserReviewById = async (id) => {
    const query = "SELECT * FROM user_review_and_ratings WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserReviewByToken = async (token) => {
    const query = "SELECT * FROM user_review_and_ratings WHERE token=?";
    return await promise_connection(query, [token]);
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