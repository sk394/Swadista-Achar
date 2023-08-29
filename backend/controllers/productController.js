const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require('cloudinary');

//create product --Admin
exports.createProduct = catchAsyncErrors( async (req, res, next) => {
    let images=[];
    if(typeof req.body.images === 'string'){
        images.push(req.body.images);
    }else{
        images = req.body.images;
    }

    const imagesLinks = [];
    for(let i=0; i< images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products',
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});

//get all products
exports.getAllProducts = catchAsyncErrors(async(req, res)=>{

    const resPerPage = 8;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()

    let products = await apiFeature.query;
    let filteredProductsCount = products.length;
    apiFeature.pagination(resPerPage);
    
    products = await apiFeature.query.clone();
    res.status(200).json({
        success: true,
        products,
        productCount,
        resPerPage,
        filteredProductsCount
    })
});

//get single product details
exports.getProductDetails = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product,
        
    });


});

//Get all products (Admin)
exports.getAdminProducts = catchAsyncErrors(async(req, res)=>{

    const products = await Product.find();
    res.status(200).json({
        success: true,
       products
    })
});



//update product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    //delete images associated with the product
    let images=[];
    if(typeof req.body.images === 'string'){
        images.push(req.body.images);
    }else{
        images = req.body.images;
    }

    if(images !== undefined){
        for(let i =0; i< product.images.length; i++){
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
        const imagesLinks = [];
        for(let i=0; i< images.length; i++){
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products',
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

//delete product --Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 500));
    }
    //delete images associated with the product
    for(let i =0; i< product.images.length; i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message:"Product is deleted",
    });
});

//cretae new review or update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach(rev =>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.comment = comment;
                rev.rating = rating;
            }
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;



    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

//get product reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    });
});

//delete product review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if(reviews.length === 0){
        ratings = 0;
    }else{
       ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });



    res.status(200).json({
        success:true,
    });
});