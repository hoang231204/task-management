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
        //sort
        let sort={};
        if(req.query.sortBy && req.query.sortType){
            sort[req.query.sortBy] = req.query.sortType;
        }
        const tasks = await Task
            .find(findQuery)
            .sort(sort)
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
//PATCH /tasks/change-multi
module.exports.changeMulti = async (req, res) =>{
    try{
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch(key){
            case 'status':
                await Task.updateMany({_id: {$in: ids}}, {status: value});
                break;
            case 'deleted':
                await Task.updateMany({_id: {$in: ids}}, {deleted: true});
                break;
            default:
                return res.status(400).json({ message: 'Invalid key' });
        }
        res.json({
            code: 200,
            message: 'Multi update successful'
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//POST /tasks/create
module.exports.create = async (req, res) =>{
    try{
        const { title, content, status } = req.body;
        const newTask = new Task({
            title,
            content,
            status
        });
        await newTask.save();
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}