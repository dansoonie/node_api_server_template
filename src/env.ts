import * as dotenv from 'dotenv';

dotenv.config();

interface IConfig {
  port: string | number
  database: {
    MONGODB_URI?: string
    MONGODB_DB_MAIN?: string
  }
  secret: string
}

const NODE_ENV: string = process.env.NODE_ENV || 'development'

const dev: IConfig = {
  port: process.env.PORT || 4000,
  database: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
    MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || 'users_db'
  },
  secret: process.env.SECRET || '@QEGTUI'
}

const prod: IConfig = {
  port: process.env.PORT || 4000,
  database: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN
  },
  secret: process.env.SECRET || '@QEGTUI'
}

const test: IConfig = {
  port: process.env.PORT || 4000,
  database: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    MONGODB_DB_MAIN: 'test_users_db'
  },
  secret: process.env.SECRET || '@QEGTUI'
}

const config: {
  [name: string]: IConfig
} = {
  test,
  dev,
  prod
}

export default config[NODE_ENV]
