import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port({ default: 8000 }),
  NODE_ENV: str({ choices: ["development", "staging", "production"] }),
  MONGODB_URI: str(),

  ACCESS_TOKEN_SECRET: str(),

  PLIVO_AUTH_ID: str(),
  PLIVO_AUTH_TOKEN: str(),
  PLIVO_PHLO_ID: str(),

  S3_BUCKET_NAME: str(),
  S3_BUCKET_REGION: str(),
  S3_ACCESS_KEY: str(),
  S3_SECRET_ACCESS_KEY: str(),

  ENCRYPTION_KEY: str(),

  ONE_SIGNAL_APP_ID: str(),
  ONE_SIGNAL_API_KEY: str(),
});

export default env;
