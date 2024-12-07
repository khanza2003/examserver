const express=require('express')
const userController=require('../controllers/userController')
const jwtMiddleware = require('../middleware/jwtMiddleware')


const router=new express.Router()
router.post('/register',userController.registerController)
router.post('/login',userController.loginController)
router.get('/users', jwtMiddleware, userController.listUsersController);
router.get('/users/:id', jwtMiddleware, userController.viewUserDetailsController);

module.exports=router