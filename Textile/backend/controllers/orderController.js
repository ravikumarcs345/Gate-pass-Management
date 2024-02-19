const catchAsyncError = require('../middleware/catchAsyncError')
const orderModel = require('../models/orderModel')
const productModel = require('../models/models')
const ErrorHandler = require('../utils/errorHandler')

//create new order - api/v1/order/new
exports.newOrder =  catchAsyncError( async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await orderModel.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
})



//get single order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const singleOrder = await orderModel.findById(req.params.id).populate('user','name email')
    if(!singleOrder){
    return next(new ErrorHandler(`order not found with this id : ${req.params.id}`,400))
    }
    res.status(200).json({
    success:true,
    singleOrder
    })
})

//get loggedin user order - api/v1/myorders
exports.getMyOrder = catchAsyncError(async (req, res, next) => {
    const myorder = await orderModel.find({user:req.user.id})
    res.status(200).json({
    success:true,
    myorder
    })
})

//admin: get All orders - api/v1/orders
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const order = await orderModel.find()
    let totalAmount=0
    order.forEach(amount => {
        totalAmount += amount.totalPrice
    });
    res.status(200).json({
        success: true,
        totalAmount,
        order
    })
})

//Admin: updateOrder - api/v1/admin/order/:Id
exports.updateOrder=catchAsyncError( async(req,res,next)=>{
       const order= await orderModel.findById(req.params.id)
       if(order.orderStatus =='delivered'){
        return next(new ErrorHandler('order has been already delivered',400))
       }

       //updateStock
       order.orderItems.forEach(async orderItem=>{
        await updateStock(orderItem.product,orderItem.quantity)
       })
       order.orderStatus=req.body.orderStatus
       order.deliveredAt=Date.now()
      await order.save()
       res.status(200).json({
        success:true,
        order
       })
})
async function updateStock(productId,quantity){
        const product=await productModel.findById(productId)
        product.stock=product.stock - quantity
        product.save({validateBeforeSave:false})
}

//Admin: delete order - api/v1/admin/order/:id
exports.deleteOrder=catchAsyncError( async(req,res,next)=>{
    const order= await orderModel.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler(`dat not found with this id: ${req.params.id}`,404))
    }
    await order.deleteOne()
    res.status(200).json({
        success:true
    })
})