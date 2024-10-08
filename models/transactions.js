const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        buyers: [{
            type: String,
            required: true
        }]
    }
);

const transactionSchema = new mongoose.Schema(
    {
        tag: {
            type: String,
            required: true
        },
        people: {
            type: Number,
            required: true
        },
        items: [itemSchema],
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;