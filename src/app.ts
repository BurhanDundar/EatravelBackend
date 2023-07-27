import dotenv from 'dotenv';

export const VARIABLES = process.env;
if (process.env.NODE_ENV != "production") {
    dotenv.config();
  }
import { Db, Decimal128, MongoClient, ObjectId } from 'mongodb';
const mongoClient: MongoClient = new MongoClient("mongodb+srv://burhandundar2399:e3LFXjqHibOt4pQp@cluster0.ecqjdit.mongodb.net/");
export const mongodbRead: Db = mongoClient.db("Eatravel");
export const mongodbWrite: Db = mongoClient.db("Eatravel");

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { router as userRouter } from './routes/users/routes';
import { router as authRouter } from './routes/auth/routes';

export const app = express();
const http = require("http");
export const server = http.createServer(app);

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .use('/users', userRouter)
  .use('/auth', authRouter)

app.get('/', (req, res) => {
  res.send('eatravel anasayfa');
});

server.listen(3001, () => {
  console.log('Mobile server started on port 3001');
}); 