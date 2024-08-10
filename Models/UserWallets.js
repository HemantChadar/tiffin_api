const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const currentDate = new Date();
    const timestamp = currentDate.getTime();
const promise_connection = promisify(conection.query).bind(conection);

exports.getUserWallet = async () => {
    const query = "SELECT * FROM user_wallets";
    return await promise_connection(query);
};

exports.getUserWalletById = async (id) => {
    const query = "SELECT * FROM user_wallets WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getUserWalletByToken = async (token) => {
    const query = "SELECT * FROM user_wallets WHERE token=?";
    return await promise_connection(query, [token]);
};


exports.addUserWallet = async (data) => {
    const fieldsQuery = "DESCRIBE user_wallets";
    let fieldsName = await promise_connection(fieldsQuery)
    const checkTokenQuery = "SELECT * FROM user_wallets WHERE token=?";
    let token = CreateToken('uw')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('uw')
    }
    let dataSet = []
    let query = 'INSERT INTO user_wallets (';
    let mailQuery = ''
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + "`" + element.Field + "`" + ',';
            dataSet.push(data[element.Field])
        }
    });
    dataSet.push(token)
    query = query + "`" + "token" + "`" + ',';
      
        dataSet.push(CreateSlug("user_wallets " + timestamp))
        query = query + "`" + "slug" + "`" + ',';
    
    mailQuery = query.substring(0, query.length - 1) + ') VALUE (?)';

    console.log("dataSet---", dataSet)
    console.log("mailQuery---", mailQuery)
    return await promise_connection(mailQuery, [dataSet]);
};

exports.updateUserWallet = async (data,keyName,keyValue) => {

    const previousDataQuery = `SELECT * FROM user_wallets WHERE ${keyName}=?`;
    const fieldsQuery = "DESCRIBE user_wallets";
    let prevData = await promise_connection(previousDataQuery, [keyValue])
    let fieldsName = await promise_connection(fieldsQuery)
    let query = 'UPDATE user_wallets SET ';
    let mailQuery = ''
    let dataSet = []
    fieldsName.forEach(element => {
        if (element.Field in data) {
            query = query + element.Field + '=?,';
            dataSet.push(data[element.Field])
        }
        else {
            if (element.Field === "slug") {
                dataSet.push(CreateSlug("user_wallets " + timestamp))
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