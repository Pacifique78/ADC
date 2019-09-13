export const checkMentor = (req,res,next) => {
    if(req.tokenData.status!=="mentor"){
        return res.status(401).json({
            status: 401,
            error: "Only mentor can do this"
        })
    }
    next();
}