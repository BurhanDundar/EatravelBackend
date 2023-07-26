import { ObjectId } from 'mongodb';
import { mongodbRead, mongodbWrite } from '../app';

export interface IUSER {
  "_id"?: ObjectId;
  "fullname": string;
  "username": string;
  "email": string;
  "password": string;
  "createdAt"?: number;
  "updatedAt"?: number;
}

const collectionRead = mongodbRead.collection('users');
const collectionWrite = mongodbWrite.collection('users');

export const getUsers = async (): Promise<any> => {
  return collectionRead.find().toArray()
}

export const isUsernameExist = async (username: string): Promise<any> => {
  return collectionRead.findOne(
    {
      "username": username
    },
    {
      "projection": {
        "_id": 1
      }
    }
  )
}