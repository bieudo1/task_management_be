const mongoose = require('mongoose');
const Schema = mongoose.Schema
const fileSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
		author: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        link: {
			type: String,
			required: true,
		},
		targetType:{
            type:String,
            required: true,
            enum:["Project","Task"]
        },
        targetId: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "targetType",
        },
    },
	{
		timestamps: true,
	}
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
