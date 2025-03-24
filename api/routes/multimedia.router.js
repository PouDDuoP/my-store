const express = require("express");
const passport = require("passport");

const MultimediaService = require("../services/multimedia.services");
const validatorHandler = require("../middleware/validator.handler");
const { checkAdminProfile, checkProfile } = require("../middleware/auth.handler");
const { createMultimediaSchema, updateMultimediaSchema, getMultimediaSchema } = require("../schemas/multimedia.schema");

const router = express.Router();
const service = new MultimediaService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier', 'customer'),
  async (req, res, next) => {
    try {
      const multimedia = await service.find();
      res.json(multimedia);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/filter', (req, res) => {
  res.send('Soy un filter');
});

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier', 'customer'),
  validatorHandler(getMultimediaSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const multimedia = await service.findOne(id);
      res.json(multimedia);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkAdminProfile,
  validatorHandler(createMultimediaSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newMultimedia = await service.create(body);
      res.status(201).json(newMultimedia);
    } catch (error) {
      next(error);
    }

  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin', 'tier'),
  validatorHandler(getMultimediaSchema, 'params'),
  validatorHandler(updateMultimediaSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const multimedia = await service.update(id, body);
      res.json(multimedia);
    } catch (error) {
      next(error);
    }
  }
);

// router.put('/:id', (req, res) => {
//   const { id } = req.params;
//   const body = req.body;
//   res.json({
//     message: 'put update',
//     data: body,
//     id
//   });
// });

router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkProfile('admin'),
  validatorHandler(getMultimediaSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch(error) {
      next(error);
    }
  }
);

module.exports = router;
