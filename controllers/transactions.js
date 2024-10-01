const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Transaction = require('../models/transactions.js');
const router = express.Router();

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const transaction = await Transaction.create(req.body);
        transaction._doc.creator = req.user;

        res.status(201).json(transaction);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({}).populate('owner').sort({ createdAt: 'desc' });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId).populate('owner').populate('owner');
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId)

        // Update
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.transactionId,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);

        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.transactionId);
        res.status(200).json(deletedTransaction);
    } catch (error) {
        res.status(500).json(error);
    }
});

// CRUD on items --------------------------------------------------------------------------------------------

router.post('/:transactionId/items', async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const transaction = await Transaction.findById(req.params.transactionId);
        transaction.items.push(req.body);
        await transaction.save();

        console.log(transaction)

        // Find the newly created item:
        const newItem = transaction.items[transaction.items.length - 1];

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:transactionId/items', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        const items = transaction.items;
        res.status(200).json({ items });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:transactionId/items/:itemId', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        const item = transaction.items.id(req.params.itemId);
        item.name = req.body.name;
        item.price = req.body.price;
        item.buyers = req.body.buyers;
        await transaction.save();
        res.status(200).json({ item });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:transactionId/items/:itemId', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        transaction.items.remove({ _id: req.params.itemId });
        await transaction.save();
        res.status(200).json({ transaction });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;