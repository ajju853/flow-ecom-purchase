
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/inventory', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findOne({ id: req.params.id });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.inventory < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }
    
    product.inventory -= quantity;
    await product.save();
    
    res.json({ success: true, newInventory: product.inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
