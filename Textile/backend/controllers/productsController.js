const product = require('../models/models')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const Apifeatures = require('../utils/apiFeatures')

//post products - /api/v1/proucts/new
exports.newProducts = catchAsyncError(async (req, res, next) => {
     let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;
    req.body.user = req.user.id
    const products = await product.create(req.body)
    res.status(201).json({
        success: true,
        products
    })
})

//get products - /api/v1/products
exports.getProducts = async (req, res, next) => {
    const resultpage = 4
    let buildQuery = () => {
        return new Apifeatures(product.find(), req.query).search().filter()
    }
    
    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await product.countDocuments({});
    let productsCount = totalProductsCount;

    if(filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }
    
    const Products = await buildQuery().paginate(resultpage).query;

    res.status(200).json({
        success: true,
        count: productsCount,
        resultpage,
        Products
    })
}

//get single products - /api/v1/product/:id
exports.getSingleProducts = async (req, res, next) => {
    const Product = await product.findById(req.params.id).populate('reviews.user','name email')
    if (!Product) {
        return next(new ErrorHandler('data not found ravi', 404));
    }
    res.status(201).json({
        success: true,
        Product
    })
}


//Update Product - api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let Product = await product.findById(req.params.id);

    //uploading images
    let images = []

    //if images not cleared we keep existing images
    if(req.body.imagesCleared === 'false' ) {
        images = Product.images;
    }
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }


    req.body.images = images;
    
    if(!Product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

     Product = await product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        Product
    })

})

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

//create reviews - api/v1/review
exports.updateReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body
    const review = {
        user: req.user.id,
        rating,
        comment
    }
    const Product = await product.findById(productId)

    //finding user already has reviewed
    const isReviewed = Product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })
    if (isReviewed) {
        Product.reviews.forEach(review => {

            //updating review and rating
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    } else {

        //create review
        Product.reviews.push(review)
        Product.numOfReviews = Product.reviews.length
    }

    //find average of product rating
    Product.rating = Product.reviews.reduce((acc, review) => {
        return review.rating + acc
    }, 0) / Product.reviews.length
    Product.rating = isNaN(Product.rating) ? 0 : Product.rating
    await Product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,

    })
})

//Admin : get reviews - api/v1/admin/reviews
exports.getReviews = catchAsyncError(async (req, res, next) =>{
    const products = await product.findById(req.query.id).populate('reviews.user','name email')
    res.status(200).json({
        success: true,
        reviews: products.reviews
    })
})

//Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) =>{
    const products = await product.findById(req.query.productId);
    
    //filtering the reviews which does match the deleting review id
    const reviews = products.reviews.filter(review => {
       return review._id.toString() !== req.query.id.toString()
    });
    //number of reviews 
    const numOfReviews = reviews.length;

    //finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings)?0:ratings;

    //save the product document
    await product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success: true
    })


});

// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) =>{
    const products = await product.find();
    res.status(200).send({
        success: true,
        products
    })
});