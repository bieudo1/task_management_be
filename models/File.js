const mongoose = require('mongoose');
const Schema = mongoose.Schema
const fileSchema = Schema(
	{
		author: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        FileUrl: {
			type: String,
			required: true,
		},
        projectId: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "Project",
        },
        taskId: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "Task",
        },
    },
	{
		timestamps: true,
	}
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
