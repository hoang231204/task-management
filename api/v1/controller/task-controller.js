const Task = require('../model/task-model');
module.exports.index = async (req, res) => {
    try{
        const tasks = await Task.find({deleted: false});
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}