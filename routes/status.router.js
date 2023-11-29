const express = require("express");
const StatusService = require("../services/status.service");
const validatorHandler = require("../middleware/validator.handler");
const { createStatusSchema, updateStatusSchema, getStatusSchema } = require('../schemas/status.schema');

const router = express.Router();
const service = new StatusService();

router.get('/', async (req, res, next) => {
  try {
    const status = await service.find();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getStatusSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const status = await service.findOne(id);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createStatusSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newStatus = await service.create(body);
      res.status(201).json(newStatus);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getStatusSchema, 'params'),
  validatorHandler(updateStatusSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const status = await service.update(id, body);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getStatusSchema, 'params'),
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
