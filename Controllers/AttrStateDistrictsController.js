const { getStateDistrictById, getStateDistrictByToken, getStateDistrict, getStateDistrictByText, getStateDistrictByText2 } = require("../Models/AttrStateDistricts")


const errorResponse = (message) => {
    return ({
        error: true,
        message: message,
        data: null
    })
}

const successResponse = (message, data) => {
    return ({
        error: false,
        message: message,
        data: data
    })
}

exports.getStateDistrict = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getStateDistrictById(req?.body?.id);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid hhh"))
            }
        }
        else if (req?.body?.token) {
            data = await getStateDistrictByToken(req?.body?.token);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else if (req?.body?.search_text) {
            data = await getStateDistrictByText2(req?.body?.search_text);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data))
            } else {
                res.json(errorResponse("search_text dose not match"))
            }
        }
        else {
            data = await getStateDistrict();
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data))
            } else {
                res.json(errorResponse("data is not availble "))
            }
        } 
    } catch (error) {
        res.json(errorResponse(error))
    }
}