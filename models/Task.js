const mongoose = require('mongoose');
const Schema = mongoose.Schema
const taskSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
        project:{type:Schema.Types.ObjectId,
            required: true,
            ref: "Project",},
        assigner: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        assignee: { 
            type:Schema.Types.ObjectId,
            required: false,
            ref: "User",
        },
        status: { 
            type: String,
            enum: ["rework","working","review","done","archive"], 
            require: true,
            default: "working"
        },
        review:[{
            type: String,
            required: false,
        }],
        dueAt:{
            type: Date,
            required: true,
        },
        doneAt:{
            type: Date,
        },
        reviewAt:[{
            type: Date,
        }],
        file:[{
            type:Schema.Types.ObjectId,
            required: false,
            ref: 'file',
        }],
        progress:{
            type: Number,
            max: 100,
            min: 0,
            required: true,
            default:0
        },
        important:{
            type: Boolean,
            required: true,
            default: false
        },
        urgent:{           
            type: Boolean,
            required: true,
            default: false
        },
		isDeleted: { type: Boolean, default: false, select: false },
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
