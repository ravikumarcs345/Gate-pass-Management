const express=require('express')
const router=express.Router()
const {getProducts,newProducts,getSingleProducts, deleteProducts, updateReview, getReviews, deleteReview, getAdminProducts, updateProduct}=require('../controllers/productsController')
const { isAuthenticateUser, isAuthorizeRole } = require('../middleware/authenticate')
const multer=require('multer')
const path=require('path')
const upload = multer({storage: multer.diskStorage({
      destination: function(req, file, cb) {
          cb(null, path.join( __dirname,'..' , 'uploads/product' ) )
      },
      filename: function(req, file, cb ) {
          cb(null, file.originalname)
      }
  }) })
router.route('/products').get( getProducts)
router.route('/product/:id') .get(getSingleProducts)
      
router.route('/review').put(isAuthenticateUser,updateReview)

//Admin routes
router.route('/admin/product/new').post(isAuthenticateUser ,isAuthorizeRole('admin'),upload.array('images'), newProducts)
router.route('/admin/products').get(isAuthenticateUser ,isAuthorizeRole('admin'), getAdminProducts)
router.route('/admin/product/:id').delete(isAuthenticateUser ,isAuthorizeRole('admin'), deleteProducts)
router.route('/admin/product/:id').put(isAuthenticateUser ,isAuthorizeRole('admin'),upload.array('images'), updateProduct)

//Admin Review Routes
router.route('/admin/reviews').get(isAuthenticateUser ,isAuthorizeRole('admin'),getReviews)
router.route('/admin/review').delete(isAuthenticateUser ,isAuthorizeRole('admin'),deleteReview)
module.exports=router