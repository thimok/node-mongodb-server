const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    title: { 
        type: String, 
        required: true 
    }, 
    value: { 
        type: Number, 
        min: 5, 
        max: 20 
    },
    meta: {
        likes: [String],
        birth: { 
            type: Date, 
            default: new Date() 
        }
    }
},{
    timestamps: true
});


const User = mongoose.model('user', UserSchema);

const user = new User({
    name: 'Robin', 
    title: 'Mr.',
    age: 16,
    meta: {
        likes: ['one', 'two', 'three', 'four']
    }
}).save();


module.exports = User;