const jwt=require("jsonwebtoken")

async function authArtist(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

if(!token){
   return res.status(401).json({message: "Unauthorized"})
}
try{
   const decoded=jwt.verify(token,process.env.JWT_SECRET)
    if(decoded.role!="artist"){
    return res.status(403).json({message: "Unauthorized"})
    }
    req.user=decoded
    next()
}catch(err){
   return res.status(401).json({message: "Invalid Token"})
}
}
async function authUser(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({message:"Unauthorized"})
   }
   try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET)
      if(decoded.role!="user" && decoded.role!="artist"){
         return res.status(403).json({message:"Unauthorized"})
      }
      req.user=decoded
      next()
   }
   catch(err){
      res.status(401).json({message:"Invalid Token"})
   }
}

module.exports={authArtist, authUser}