const conection = require('../Conection/conection');
const { promisify } = require("util");

const promise_connection = promisify(conection.query).bind(conection);

exports.getStateDistrict = async () => {
    const query = "SELECT * FROM attr_state_districts";
    return await promise_connection(query);
};

exports.getStateDistrictById = async (id) => {
    const query = "SELECT * FROM attr_state_districts WHERE id=?";
    return await promise_connection(query, [id]);
};

exports.getStateDistrictByToken = async (token) => {
    const query = "SELECT * FROM attr_state_districts WHERE token=?";
    return await promise_connection(query, [token]);
};

// exports.getStateDistrictByText = async (text) => { 
//     let query = "SELECT * FROM attr_state_districts WHERE name_state LIKE ?";
//     let mailQuery = ''
//     let textArray = text.split(" ")
//     let sendData = []

//     textArray.forEach(element => {
//         query = query + ' AND ' + 'name_state ' + 'LIKE ?';
//         sendData.push('%' + element + '%');
//     })
//     mailQuery = query.substring(0, query.length - 22);

//     console.log("mailQuery--", mailQuery)
//     return await promise_connection(mailQuery, sendData);
// };


exports.getStateDistrictByText = async (text) => {
    let query = "SELECT * FROM attr_state_districts WHERE (name LIKE ? OR name_state LIKE ? OR name_country LIKE ?)";
    let data = [
        '%' + text + '%',
        '%' + text + '%',
        '%' + text + '%'
    ]
    return await promise_connection(query, data);
};

exports.getStateDistrictByText2 = async (text) => {
    let query1 = '(name LIKE ?'
    let query2 = 'OR (name_state LIKE ?'
    let query3 = 'OR (name_country LIKE ?'
    let mailQuery = 'SELECT * FROM attr_state_districts WHERE '
    let and = []
    let textArray = text.split(" ")
    let sendData = []
    let sendData1 = []
    let sendData2 = []
    let sendData3 = []

    textArray.forEach(element => {
        sendData1.push('%' + element + '%');
        sendData2.push('%' + element + '%');
        sendData3.push('%' + element + '%');
        and.push("AND");
    })
    

    and.pop()
    sendData1.forEach(element => { sendData.push(element) });
    sendData2.forEach(element => { sendData.push(element) });
    sendData3.forEach(element => { sendData.push(element) });

    and.forEach(element => {
        query1 = query1 + ' ' + element + ' name ' + 'LIKE ?';
        query2 = query2 + ' ' + element + ' name_state ' + 'LIKE ?';
        query3 = query3 + ' ' + element + ' name_country ' + 'LIKE ?';
    })

    mailQuery = mailQuery + query1 + ') ' + query2 + ') ' + query3 + ')';
    console.log("length---", and)
    console.log("sendData---", sendData)


    return await promise_connection(mailQuery, sendData);
};