const mongose = require('mongoose');
const taskSchema = new mongose.Schema({
    title: String,
    status: {
        type: String,
        enum: ['initial', 'doing', 'finished','not-finished'],
        default: 'initial'
    },
    content: String,
    timeStart: Date,
    timeFinish: Date,
    deleted:{
        type: Boolean,
        default: false
    },
    deletedAt: Date
},{
    timestamps: true
})
const Task = mongose.model('Task', taskSchema,'tasks');
module.exports = Task;