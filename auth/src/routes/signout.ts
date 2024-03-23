import express from 'express'

const router = express.Router()
router.get('/api/users/signout',async (req,res)=>{
req.session = null 
console.log('User logged out successfully!')
res.send({})
})
export {router as signOutRouter};