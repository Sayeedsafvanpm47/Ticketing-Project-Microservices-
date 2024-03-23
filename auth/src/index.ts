import express from 'express'
import 'express-async-errors'
import mongoose, { mongo } from 'mongoose'
import cookieSession from 'cookie-session'
import { json } from 'express'
import { currentUserRouter } from './routes/currentuser'
import { signOutRouter } from './routes/signout'
import { signInRouter } from './routes/signin'
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'
import { DatabaseConnectionError } from './errors/database-connection-error'

const app = express()
app.set('trust proxy',true)
app.use(json())
app.use(cookieSession({
          signed: false,
          secure: true,

}))
app.use(currentUserRouter);
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)
// handle not found routes 
app.all('*',async(req,res)=>{
          throw new NotFoundError()
})
app.use(errorHandler)

const start = async ()=>{
          if(!process.env.JWT_KEY) throw new Error('JWT key not defined!')
          try {
                    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
                    console.log('Connected to mongodb!')
          } catch (error) {
                    throw new DatabaseConnectionError()
          }
         
}
start().then(()=>app.listen(3000,()=>console.log('Auth listening to port 3000!!')))

