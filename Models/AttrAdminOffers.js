const conection = require('../Conection/conection');
const { promisify } = require("util");
const { CreateSlug, CreateToken } = require('../Conection/HelpingTool');
const { checkKeyExist } = require('../Conection/constant');

const promise_connection = promisify(conection.query).bind(conection);

exports.getAdminOffer = async (body) => {
    const query = "SELECT * FROM attr_admin_offers ORDER BY id DESC LIMIT ? OFFSET ?";
    let limit = body?.limit
    let offset = body?.offset * body?.limit
    return await promise_connection(query, [limit, offset]);
};

exports.getAdminOfferObject = async (fieldName, value) => {
    const query =`SELECT * FROM attr_admin_offers WHERE ${fieldName}=?`;
    let obj = await promise_connection(query,[value]);
    return obj[0]
};

exports.getAdminOfferById = async (id) => {
    const query = "SELECT * FROM attr_admin_offers WHERE id=?";
    // return await promise_connection(query, [id]);
    let obj = await promise_connection(query, [id]);
    return obj[0]
};

exports.getAdminOfferByToken = async (token) => {
    const query = "SELECT * FROM attr_admin_offers WHERE token=?";
    return await promise_connection(query, [token]);

};

exports.getFieldsAdminOffer = async () => {
    // const fieldsQuery = "DESCRIBE attr_admin_offers";
    // const fieldsQuery = "SHOW COLUMNS FROM attr_admin_offers";
    // let res= await promise_connection(fieldsQuery)


    const fieldsQuery = "SELECT column_name FROM information_schema.COLUMNS WHERE table_name LIKE 'attr_admin_offers' ORDER BY ordinal_position"

    let res = await promise_connection(fieldsQuery)

    return res.map(r => r.column_name);
}

exports.addAdminOffer = async (data) => {
    const fieldsQuery = "DESCRIBE attr_admin_offers";
    let fieldsName = await promise_connection(fieldsQuery)

    const checkTokenQuery = "SELECT * FROM attr_admin_offers WHERE token=?";
    let token = CreateToken('ao')
    let checkToken = await promise_connection(checkTokenQuery, [token]);
    if (checkToken?.length > 0) {
        token = CreateToken('ao');
    }

    let dataSet = []
    let query = 'INSERT INTO attr_admin_offers (';
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

exports.updateAdminOffer = async (data, keyName, keyValue) => {

    let prevData =await this.getAdminOfferById(keyValue);
    let fields = await this.getFieldsAdminOffer();
    let dataSet = []
    let query = 'UPDATE attr_admin_offers SET ';
    fields.forEach(element => {
        if (element in data) {
            query = query + element + '=?,';
            dataSet.push(data[element])
        } else {
            // if(checkKeyExist(prevData,element)){
            //     query = query + element + '=?,';
            //     dataSet.push(prevData[element])
            // } 
        }
    });


    // if (checkKeyExist(dataSet, "title")) {
    //     if (prevData?.title !== dataSet[title]) {
    //         dataSet.push(CreateSlug(dataSet[title]))
    //         query = query +  'slug=?,';
    //     } else if (!prevData?.slug) {
    //         dataSet.push(CreateSlug(dataSet[title]))
    //         query = query +  'slug=?,';
    //     }
    // }

    query = query + 'updated_at=?';
    dataSet.push(new Date())

// return {"dataset":dataSet,"prevData":{prevData}};

    // dataSet.push(data.id)
    let mailQuery = query + ` WHERE ${keyName}=${keyValue}`;
    console.log("dataSet--", dataSet)
    console.log("mailQuery--", mailQuery)

    const re = await promise_connection(mailQuery, dataSet);

    return this.getAdminOfferObject(keyName, keyValue)
};