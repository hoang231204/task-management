module.exports.create = (req,res,next)=>{
    const { title, content, status} = req.body;
    if(!title || !content || !status){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    next();
}
module.exports.update = (req,res,next)=>{
    const { title, content, status} = req.body;
    if(!title && !content && !status){
        return res.status(400).json({ message: 'At least one field is required to update' });
    }
    next();
}