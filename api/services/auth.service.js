const boom = require("@hapi/boom");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('./../config/config');

const UserService = require('./user.service');
const service = new UserService();


class AuthService {

  async getUser(username, password) {
    const user = await service.findByUsername(username);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      profile: user.profile
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return{
      user,
      token
    };
  }

  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      // port: 587,
      secure: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
    await transporter.sendMail({
      from: config.emailUser, // sender address
      to: `${user.email}`, // list of receivers
      subject: "Hello ✔ Job Oportunity", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    return { message: 'mail sent' };
  }
}

module.exports = AuthService;
