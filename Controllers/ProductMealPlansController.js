const { getProductMealPlanById, getProductMealPlanByToken, getProductMealPlan, addProductMealPlan, updateProductMealPlan } = require("../Models/ProductMealPlans")

 

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

exports.getProductMealPlan = async (req, res) => {
    let data = [];
    try {
        if (req?.body?.id) {
            data = await getProductMealPlanById(req.body.id);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("id is invailid "))
            }
        }
        else if (req?.body?.token) {
            data = await getProductMealPlanByToken(req.body.token);
            if (data?.length >= 1) {
                res.json(successResponse("data successfully get", data[0]))
            } else {
                res.json(errorResponse("token is invailid"))
            }
        } else {
            data = await getProductMealPlan();
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


exports.addProductMealPlan = async (req, res) => {
    let data = [];
    try {
        data = await addProductMealPlan(req.body);
        const user = await getProductMealPlanById(data.insertId);

        res.json(successResponse("data successfully inserted", user[0]))

    } catch (error) {
        res.json(errorResponse(error))

    }
}

exports.updateProductMealPlan = async (req, res) => {
    let keyName = ""
    let keyValue = null
    if (req?.body?.id) {
        keyName = "id"
        keyValue = req.body.id
    }
    if (req?.body?.token) {
        keyName = "token"
        keyValue = req.body.token
    }
    let data = [];
    let user = [];
    try {
        data = await updateProductMealPlan(req.body, keyName, keyValue);
        if (req?.body?.id) {
            user = await getProductMealPlanById(req.body.id);
        }
        if (req?.body?.token) {
            user = await getProductMealPlanByToken(req.body.token);
        }  
        res.json(successResponse("data successfully updated", user[0]))
    } catch (error) {
        res.json(errorResponse(error))
    }
}