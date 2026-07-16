const Task = require('../model/task-model');
//GET /tasks
module.exports.index = async (req, res) => {
    try{
        const tasks = await Task.find({deleted: false});
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