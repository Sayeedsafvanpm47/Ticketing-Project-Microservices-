import express,{Request,Response} from 'express'
import { body,validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken'
const router = express.Router()
router.post('/api/users/signup',[body('email').isEmail().withMessage('Email must be valid'),body('password').trim().isLength({min:4,max:20}).withMessage('Password must be between 4 and 20 charecters')],validateRequest,async (req:Request,res:Response)=>{


const {email,password} = req.body
const existingUser = await User.findOne({email})
if(!existingUser)
{
          
          console.log('User created Successfully')
          const user = User.build({email,password})
          await user.save()
          //generate json web token and store it on ssession object
          const userJwt = jwt.sign({
                id: user.id,
                email: user.email
          },process.env.JWT_KEY!)
          req.session = {
                jwt: userJwt 
           }
          return res.status(201).send(user)
}
else
{
          throw new BadRequestError('Email already exists!')
          
}

})
export {router as signUpRouter};