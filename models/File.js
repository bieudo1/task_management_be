const mongoose = require('mongoose');
const Schema = mongoose.Schema
const fileSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
        link: {
			type: String,
			required: true,
		},
    },
	{
		timestamps: true,
	}
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
