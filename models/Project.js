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
        assigner: { 
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: { 
            type: String,
            enum: ["working","done","archive"], 
            require: true,
            default:'working'
        },
		isDeleted: { type: Boolean, default: false, select: false },
	},
	{
		timestamps: true,
	}
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
