const express = require('express');
const passport = require('passport');

const CommissionService = require('../services/commission.service');
const validatorHandler = require('../middleware/validator.handler');
const { checkAdminProfile, checkProfile } = require('../middleware/auth.handler');
const { createCommissionSchema, updateCommissionSchema, getCommissionSchema } = require('../schemas/commission.schema');

const router = express.Router();
const service = new CommissionService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkProfile('admin', 'tier', 'customer'),
  async (req, res, next) => {
    try {
      const commissions = await service.find();
      res.json(commissions);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkProfile('admin', 'tier', 'customer'),
  validatorHandler(getCommissionSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const commission = await service.findOne(id);
      res.json(commission);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkProfile('admin', 'tier'),
  validatorHandler(createCommissionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCommission = await service.create(body);
      res.status(201).json(newCommission);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  checkProfile('admin', 'tier'),
  validatorHandler(updateCommissionSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const commission = await service.update(id, body);
      res.json(commission);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkAdminProfile,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const commission = await service.delete(id);
      res.json(commission);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
