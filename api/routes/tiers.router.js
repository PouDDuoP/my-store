const express = require("express");
const TierService = require("../services/tier.service");
const validatorHandler = require("../middleware/validator.handler");
const { createTierSchema, updateTierSchema, getTierSchema } = require('../schemas/tier.schema');

const router = express.Router();
const service = new TierService();

router.get('/', async (req, res, next) => {
  try {
    const tiers = await service.find();
    res.json(tiers);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getTierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const tier = await service.findOne(id);
      res.json(tier);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createTierSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTier = await service.create(body);
      res.status(201).json(newTier);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getTierSchema, 'params'),
  validatorHandler(updateTierSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const tier = await service.update(id, body);
      res.json(tier);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getTierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
