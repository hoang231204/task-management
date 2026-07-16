const Task = require('../model/task-model');
const searchHelper = require('../../../helpers/search-helper');
const paginationHelper = require('../../../helpers/pagination-helper');
//GET /tasks
module.exports.index = async (req, res) => {
    try{
        let findQuery={};
        //filer status
        if(req.query.status){
            findQuery.status=req.query.status;
        }
        //search keyword
        const regex = searchHelper(req.query);
        if(req.query.keyword){
            findQuery.title = regex;
        }
        //filter deleted
        findQuery.deleted=false;
        //pagination
        const countData = await Task.find(findQuery).countDocuments();
        const pagination = paginationHelper(req.query,countData);
        const tasks = await Task
            .find(findQuery)
            .skip(pagination.skipPage)
            .limit(pagination.limitPage);
        res.json({
            tasks: tasks,
            pagination: pagination
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//GET /tasks/detail/:id
module.exports.detail = async (req, res) =>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task || task.deleted){
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//PATCH /tasks/change-status/:id
module.exports.changeStatus = async (req, res) =>{
    try{
        const id = req.params.id;
        const newStatus = req.body.status;
        await Task.updateOne({_id: id}, {status: newStatus});
        res.json({
            code: 200,
            message: 'Status updated successfully'
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}