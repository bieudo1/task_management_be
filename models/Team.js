const mongoose = require('mongoose');
const Schema = mongoose.Schema
const teamSchema = Schema(
    {
        name: { 
            type:String,
            required: true,
        },
        manager: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        workers: { 
            type:Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
)
const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
