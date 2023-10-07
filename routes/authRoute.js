const authController = require('./../controllers/authController');
const express = require('express');

const router = express.Router();

/**
 * @openapi
 * 
 * /api/v1/auth/signup:
 *  post:
 *      tags:
 *      - User Authentication
 *      summary: Register a user
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *          201:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:          
 *                          $ref: '#/components/schemas/CreateUserResponse'          
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * /api/v1/auth/signin:
 *  post:
 *      tags:
 *      - User Authentication
 *      summary: Login a user
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginUser'
 *      responses:
 *          200:
 *              description: Success          
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 * 
 * /api/v1/auth/logout:
 *  get:
 *      tags:
 *      - User Authentication
 *      summary: Log Users Out
 *      description: This logs users out in this system
 *      responses:
 *          200:
 *              description: App is up and running
 * 
 * /api/v1/users/allusers:
 *  get:
 *      tags:
 *      - User Authentication
 *      summary: Get all registered user
 *      description: This is shows all users in this system
 *      responses:
 *          200:
 *              description: App is up and running
 * 
 * '/api/v1/users/{id}':
 *  get:
 *      tags:
 *      - User Authentication
 *      summary: Gets a single user by the userId
 *      parameters:
 *      - name: userId
 *      in: path
 *      description: The users id
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/CreateUserInput'
 *          404:
 *              description: User not Found 
 * 
 * '/api/v1/users/me':
 *  get:
 *      tags:
 *      - User Authentication
 *      summary: Gets a logged in user
 *      description: Gets the logged in Users details
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: User not Found 
 * 
 * /api/v1/users/forgottenpassword:
 *  post:
 *      tags:
 *      - User Authentication
 *      summary: Forgotten user password
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserForgottenPassword'
 *      responses:
 *          200:
 *              description: Success       
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 * 
 * '/api/v1/users/resetpassword/{token}':
 *  patch:
 *      tags:
 *      - User Authentication
 *      summary: Reset user password
 *      parameters:
 *      - name: token
 *      in: path
 *      description: The token sent to your email
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schema/UserResetPassword'
 *          404:
 *              description: User not Found
 * 
 * '/api/v1/auth/{id}/verify/{token}':
 *  get:
 *      tags:
 *      - User Authentication
 *      summary: Verify your email adddress
 *      parameters:
 *      - name: token
 *      - name: id
 *      in: path
 *      description: The email verification was sent to your email
 *      required: true
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: User not Found
 *
 * /api/v1/users/updatepassword:
 *  patch:
 *      tags:
 *      - User Authentication
 *      summary: Change user password
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/updatePassword'
 *      responses:
 *          200:
 *              description: Success       
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *
 * /api/v1/users/myprofile:
 *  patch:
 *      tags:
 *      - User Authentication
 *      summary: Change user profile
 *      description: the photo field should contain the url to the picture
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/userProfile'
 *      responses:
 *          200:
 *              description: Success       
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *  
 * /api/v1/users/deleteAccount:
 *  delete:
 *      tags:
 *      - User Authentication
 *      summary: Delete a user account
 *      description: delete can only work for a logged in user
 *      responses:
 *          200:
 *              description: Success       
 *          409:
 *              description: Conflict
 *          400:
 *              description: Bad Request
 *  
 */


// anybody can access this routes
router.get('/:id/verify/:token', authController.verifyUser)
router.post('/signup', authController.SignUp)
router.post('/signin', authController.Login)
router.post('/forgottenpassword', authController.forgotPassword)
router.patch('/resetpassword/:token', authController.resetPassword)

router.get('/allusers', authController.getAllUsers)
router.get('/logout', authController.logout)

// only logged in users have access to this routes
router.use(authController.protect)
router.patch('/updatepassword',
authController.updatePassword);
router.patch('/myprofile',
authController.updateMe)

// only admins have access to this route
router.use(authController.restrictTo("user", "admin"))
// router.get('/allusers', authController.getAllUsers)
router.get('/:id', authController.protect, authController.getUser)


module.exports = router;