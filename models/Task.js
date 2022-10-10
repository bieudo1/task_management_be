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
        assigner: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        assignee: [{ 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }],
        status: { 
            type: String,
            enum: ["pending", "working","review","done","archive"], 
            require: true
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
        },
        important:{
            type: Boolean,
            required: true,
        },
        urgent:{           
            type: Boolean,
            required: true,
        }
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
