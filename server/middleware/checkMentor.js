const checkMentor = (req,res,next) => {
    if(req.tokenData.status!=="mentor"){
        return res.status(403).json({
            status: 403,
            error: "Only mentor can do this"
        })
    }
    next();
}
export default checkMentor;