export const checkAdmin = (req,res,next) => {
    if(req.tokenData.status!=="admin"){
        return res.status(403).json({
            status: 403,
            error: "Only admin can do this"
        })
    }
    next();
}