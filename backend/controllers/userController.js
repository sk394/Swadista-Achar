const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const crypto = require('crypto');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js');
const cloudinary = require('cloudinary');

//Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder:'avatars',
        width:150,
        crop:'scale',
    });
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        },
    });
     sendToken(user, 201, res);
   
});

//login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    //checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
    

});

//logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success:true,
        message:'Logged out',
    });
});

//forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler('User not found with this email', 404));
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, then ignore it`;

    try {
        await sendEmail({
            email:user.email,
            subject:'Achaar Password Recovery',
            message,
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message, 500));
    }
});

//reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //creating token hash
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400));
    }

    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match', 400));
    }

    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);

});

//get currently logged in user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});

//update password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    if (req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match', 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});

//update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    };

    //update avatar
    if(req.body.avatar !== " "){
        const user = await User.findById(req.user.id);
        const image_id = user.avatar.public_id; //this is the id of the image that is already present in the database
        await cloudinary.v2.uploader.destroy(image_id); //this will delete the image from the cloudinary database
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder:'avatars',
            width:150,
            crop:'scale',
        });
        newUserData.avatar = {
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        };

    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});

//get all users--Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });
});

//get user details--Admin
exports.getUserDetailsAdmin = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user,
    });
});

//update user profile--Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };
   
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});

//delete user--Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 400));
    }

    //remove avatar from cloudinary
    const image_id = user.avatar.public_id; //this is the id of the image that is already present in the database
    await cloudinary.v2.uploader.destroy(image_id); //this will delete the image from the cloudinary database
    


    await User.deleteOne();

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    });
});