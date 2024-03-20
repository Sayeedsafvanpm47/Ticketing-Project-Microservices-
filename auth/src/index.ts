import express from 'express'
import { json } from 'express'

const app = express()
app.use(json())
app.get('/api/users/currentUser',(req,res)=>{
          res.send('hi user')
})
app.listen(3000,()=>console.log('Auth listening to port 3000!!'))
