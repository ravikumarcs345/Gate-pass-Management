const express=require('express')
const { newOrder, getAllOrders, getSingleOrder, getMyOrder, updateOrder, deleteOrder } = require('../controllers/orderController')
const { isAuthenticateUser, isAuthorizeRole } = require('../middleware/authenticate')
const Router=express.Router()


Router.route('/order/new').post(isAuthenticateUser, newOrder)
Router.route('/order/:id').get(isAuthenticateUser,getSingleOrder)
Router.route('/myorders').get(isAuthenticateUser,getMyOrder)
//Admin Router
Router.route('/admin/order').get(isAuthenticateUser,isAuthorizeRole('admin'), getAllOrders)
Router.route('/admin/order/:id').put(isAuthenticateUser,isAuthorizeRole('admin'), updateOrder)
                                .delete(isAuthenticateUser,isAuthorizeRole('admin'), deleteOrder)
module.exports=Router