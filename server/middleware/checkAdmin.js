export const checkAdmin = (req,res,next) => {
    if(req.tokenData.status!=="admin"){
        return res.status(401).json({
            status: 401,
            error: "Only admin can do this"
        })
    }
    next();
}