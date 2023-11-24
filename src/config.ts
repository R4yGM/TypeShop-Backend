import path from 'path';
import dotenv from 'dotenv';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  MONGO_URI: string | undefined;
  STRIPE_SECRET_KEY: string | undefined;
  JWT_SECRET: string | undefined;
  R2_ACCOUNT_ID: string | undefined;
  R2_ACCESS_KEY: string | undefined;
  R2_SECRET_KEY: string | undefined;
  TELEGRAM_BOT: string | undefined;
  FIREBASE_projectId: string | undefined;
  FIREBASE_clientEmail: string | undefined;
  FIREBASE_privateKey: string | undefined;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  STRIPE_SECRET_KEY: string;
  JWT_SECRET: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
  TELEGRAM_BOT: string;
  FIREBASE_projectId: string;
  FIREBASE_clientEmail: string;
  FIREBASE_privateKey: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY: process.env.R2_ACCOUNT_ID,
    R2_SECRET_KEY: process.env.R2_ACCOUNT_ID,
    TELEGRAM_BOT: process.env.TELEGRAM_BOT,
    FIREBASE_projectId: process.env.FIREBASE_projectId,
    FIREBASE_clientEmail: process.env.FIREBASE_clientEmail,
    FIREBASE_privateKey: process.env.FIREBASE_privateKey,

  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
