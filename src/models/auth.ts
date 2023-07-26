import { ObjectId } from 'mongodb';
import { mongodbRead, mongodbWrite } from '../app';
import { IUSER } from './users';

export interface ISIGNUP {
  "fullname": string;
  "username": string;
  "hashedPassword": string;
  "email": string;
}

const collectionRead = mongodbRead.collection('users');
const collectionWrite = mongodbWrite.collection('users');

export const signup = async (signupInfo: ISIGNUP) => {
  const emailRegex = new RegExp('^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9_\-]@[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]\.[a-zA-Z]+$', 'gm');
  if (emailRegex.test(signupInfo.email)) {
  }

  const emailExists = await userEmailExists(signupInfo.email);
  if (emailExists == null) {

    const userData: IUSER = {
      "fullname": signupInfo.fullname,
      "username": signupInfo.username,
      "email": signupInfo.email,
      "password": signupInfo.hashedPassword,
      "createdAt": new Date().getTime(),
      "updatedAt": new Date().getTime()
    }

    const user = await createUser(userData);
    
    // check this place
    if(user.insertedId){
        return {
          "status": "ok",
          "msg": "success",
        }
    } else {
        return {
            "status": "error",
            "msg": "user could not be added",
          }
    }

  }
  else {
    return {
      "status": "error",
      "msg": "Email exists"
    };
  }
}

export const forgotPassword = async (email: string, hashedPassword: string): Promise<any> => {
  const user = await checkEmail(email);

  const result = {
    "status": "ok",
    "msg": ""
  };

  if (user) {
    updatePasswordByUserId(user._id, hashedPassword).then();
    result.msg = `${user.fullname}`;
  }
  else {
    result.status = 'error';
    result.msg = "Email doesn\'t exists";
  }

  return Promise.resolve(result);
}


export const userEmailExists = async (email: string): Promise<any> => {
    return collectionRead.findOne({ "email": email });
}

export const createUser = async (user: IUSER): Promise<any> => {
    return collectionWrite.insertOne(user);
}

export const checkEmail = async (email: string): Promise<any> => {
  const user = await collectionRead.findOne(
      {
          "email": email
      },
      {
          "projection": {
              "_id": 1,
              "password": 1,
              "fullname": 1,
              "username": 1,
          }
      }
  )
  return Promise.resolve(user);
}

export const updatePasswordByUserId = async (userId: ObjectId, hashedPassword: string): Promise<any> => {
  return collectionWrite.findOneAndUpdate(
      { "_id": userId },
      {
          "$set": {
              "password": hashedPassword
          }
      }
  )
}

export const getHashedPassword = async (userId: string): Promise<any> => {
  const user = await collectionRead.findOne(
      {
          "_id": new ObjectId(userId),
      },
      {
          "projection": {
              "_id": 0,
              "password": 1
          }
      }
  )

  const password = user ? user.password : "";
  return Promise.resolve(password);

}

export const updatePassword = async (userId: string, hashedPassword: string): Promise<any> => {
  const result = {
      "status": "error",
      "msg": "",
      "data":{}
  }

  const checkUser = await getUserById(
      new ObjectId(userId)
  )
  if (!checkUser) {
      result.status = "User does not exist";
  }
  else {
      let data = await collectionWrite.findOneAndUpdate(
          { "_id": new ObjectId(userId) },
          {
              "$set": {
                  "password": hashedPassword,
                  'updatedAt': new Date().getTime()
              }
          }
      );
      result.data = data
      result.status = "ok"

  }
  return Promise.resolve(result);
}

export const getUserById = async (userId: ObjectId): Promise<any> => {
  let user = await collectionRead.findOne(
    { "_id": userId }
  );
  return Promise.resolve(user)
}