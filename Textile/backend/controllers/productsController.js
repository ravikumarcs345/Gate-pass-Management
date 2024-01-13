const product = require('../models/models')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const Apifeatures=require('../utils/apiFeatures')

//post products - /api/v1/proucts/new
exports.newProducts = catchAsyncError(async (req, res, next) => {
    const products = await product.create(req.body)
    res.status(201).json({
        success: true,
        products
    })
})

//get products - /api/v1/products
exports.getProducts = async (req, res, next) => {
    const resultpage=2
   const apifeatures=new Apifeatures(product.find(),req.query).search().filter().paginate(resultpage)
    const Products = await apifeatures.query
    res.status(200).json({
        success: true,
        count:Products.length,
        Products
    })
}

//get single products - /api/v1/products/:id
exports.getSingleProducts = async (req, res, next) => {
    const singleProducts = await product.findById(req.params.id)

    if (!singleProducts) {
        return next(new ErrorHandler('data not found ravi', 404));

    }

    res.status(201).json({
        success: true,
        singleProducts
    })

}

//update the data - /api/v1/products/:id
exports.updateData = async (req, res, next) => {
    const getSingleProducts = await product.findById(req.params.id)
    if (!getSingleProducts) {
        res.status(400).json({
            success: false,
            message: "data not found"
        })
    }

    const updateProducts = await product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        updateProducts
    })
}

//delete Products - /api/v1/prducts/:id
exports.deleteProducts = async (req, res, next) => {
    const getSingleProducts = await product.findById(req.params.id)

    if (!getSingleProducts) {
        res.status(404).json({
            seccess: false,
            message: "data not found"
        })
    }
    await getSingleProducts.deleteOne()

    res.status(200).json({
        success: true,
        message: "data deleted"
    })
}