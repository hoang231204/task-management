const Task = require('../model/task-model');
const searchHelper = require('../../../helpers/search-helper');
//GET /tasks
module.exports.index = async (req, res) => {
    try{
        let findQuery={};
        if(req.query.status){
            findQuery.status=req.query.status;
        }
        const regex = searchHelper(req.query);
        if(req.query.keyword){
            findQuery.title = regex;
        }
        findQuery.deleted=false;
        const tasks = await Task
            .find(findQuery);
        res.json(tasks);
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