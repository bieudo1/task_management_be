const mongoose = require('mongoose');
const Schema = mongoose.Schema
const projectSchema = Schema(
	{
        name: { 
            type:String,
            required: true,
        },
        description:{
            type:String,
            required: true,
        },
        status: { 
            type: String,
            enum: ["pending", "working","review","done","archive"], 
            require: true
        },
        task: [{ 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "Task",
        }],
		isDeleted: { type: Boolean, default: false, select: false },
	},
	{
		timestamps: true,
	}
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
