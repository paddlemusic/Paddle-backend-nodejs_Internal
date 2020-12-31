
const authenticate = require('../middleware/authenticate');
const {authSchema} = require('../middleware/userSchema');
const UserService = require('../services/userService')
const util = require('../utils/utils');
const bcrypt = require("bcrypt");
const config = require('../config/constants');
//import moment from 'moment';
//import uuidv4 from 'uuid/v4';
const Helper=require('./Helper');
//import Helper from './Helper';
const User = require('../models/user');
const authenticate = require('../middleware/authenticate')
const UserService = require('../services/userService')
const util = require('../utils/utils')
const config = require('../config/constants')
const userService = new UserService()

class UserController {
  async signup (req, res) {
    console.log("signup api called");
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    authSchema.validateAsync(req.body).then(()=>{
      const hashed = Helper.hashPassword(req.body.password);
      console.log(hashed);
      req.body.password = hashed;
    });
    console.log(req.body);
  //  validator.schema.signup.validateUser(req.body).then(() =>{
    //  const hashPassword = Helper.hashPassword(req.body.password);
      //console.log(hashPassword);
   // });

    //saving  a new user
    /*const user=new User({
      name:req.body.name,
      email:req.body.email,
      password:hashPassword
    });
    user
    .save()
    .then(result=>{
      console.log(result);
      res.status(201).json({
        message:"user created"
      });
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        error:err
      });
    });*/
    /*console.log("signup called 1"+req.body.email);
      console.log("signup called 2");
      User.find({email: req.body.email})
      .exec()
      .then(user=>{
        if(user.length>=1){
          return res.status(409).json({
            message:"mail exists"
          });
        }
        else{
          bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
              return res.status(500).json({
                error:err
              });
            }
            else{
              const user=new User({
                email:req.body.email,
                password:hash
              });
              user
              .save()
              .then(result=>{
                console.log(result);
                res.status(201).json({
                  message:"user created"
                });
              })
              .catch(err=>{
                console.log(err);
                res.status(500).json({
                  error:err
                });
              });
            }
          });
        }
      });*/
    
  }

  async socialMediaSignup (req, res) {
    try {
      if (req.user) {
        // console.log("User is:", req.user);
        const token = authenticate.getToken({ _id: req.user.id })
        const userData = {
          name: req.user.displayName,
          username: req.user.id,
          social_user_id: req.user.id,
          email: req.user.emails[0].value,
          role: '1'
        }
        const isUserExist = await userService.isUserAlreadyExist({ social_user_id: userData.social_user_id })
        if (isUserExist) {
          util.successResponse(res, config.SUCCESS,
            config.LOGIN_SUCCESSFULLY, { token: token })
        } else {
          const data = await userService.socialMediaSignup(userData)
          if (data) {
            util.successResponse(res, config.SUCCESS,
              config.LOGIN_SUCCESSFULLY, { token: token })
          }
        }
      }
    } catch (err) {
      console.log('Error is:', err)
      throw err
    }
  }
}

module.exports = UserController
