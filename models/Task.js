const mongoose = require('mongoose');
const Schema = mongoose.Schema
const taskSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
        description: {
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
        assignee: [{ 
            type:Schema.Types.ObjectId,
            required: false,
            ref: "User",
        }],
        status: { 
            type: String,
            enum: ["pending", "working","review","done","archive"], 
            require: true,
            default: "working"
        },
        review:[{
            type: String,
            required: false,
            default: '',
        }],
        due:{
            type: Number,
            required: true,
        },
        file:[{
            type:Schema.Types.ObjectId,
            required: false,
            ref: 'file',
            default:"",
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
