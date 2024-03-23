import express,{Request,Response} from 'express'
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken'
import { Password } from '../services/password';
const router = express.Router()
router.post('/api/users/signin',[
          body('email').isEmail().withMessage('Email must be valid!')
          ,
          body('password').trim().notEmpty().withMessage('You must enter a password!')
],validateRequest,async (req:Request,res:Response)=>{
const {email,password} = req.body 
const existingUser = await User.findOne({email})
if(!existingUser)
{
          throw new BadRequestError('Invalid Credentials ')
}        
const checkPassword = await Password.compare(existingUser.password,password)
if(!checkPassword)
{
          throw new BadRequestError('Invalid Credentials!')
}

const userJWT = jwt.sign({
          id:existingUser.id,
          email:existingUser.email
},process.env.JWT_KEY!)

req.session = {
          jwt : userJWT 
}
console.log('User signed in successfully')
res.status(201).send(existingUser)

})
export {router as signInRouter};