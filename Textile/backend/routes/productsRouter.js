const express=require('express')
const router=express.Router()
const {getProducts,newProducts,getSingleProducts, updateData, deleteProducts}=require('../controllers/productsController')
//const { isAuthenticateUser } = require('../middleware/authenticate')

router.route('/products').get( getProducts)
router.route('/product/new').post(newProducts)
router.route('/product/:id')
      .get(getSingleProducts)
      .put(updateData)
      .delete(deleteProducts)

module.exports=router