import express from 'express';
import { _register,_login,_forgotPassword,_updatePassword } from './post';

export const router = express.Router();

router
  .post('/register', _register)
  .post('/login', _login)
  .post('/forgotPassword', _forgotPassword)
  .post('/updatePassword', _updatePassword)