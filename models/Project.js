const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        team: { 
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Team",
        },  
        assigner: { 
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        assignee: [{ 
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        task: [{ 
            type: Schema.Types.ObjectId,
            required: false,
            ref: "Task",
        }],
        file:[{
            type:Schema.Types.ObjectId,
            required: false,
            ref: 'File',
        }],
        status: { 
            type: String,
            enum: ["working","archive"], 
            require: true,
            default:'working'
        },
        dueAt:{
            type: Date,
        },
        dateoffiling:{
            type: Date,
        },
		isDeleted: { type: Boolean, default: false, select: false },
	},
	{
		timestamps: true,
	}
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
