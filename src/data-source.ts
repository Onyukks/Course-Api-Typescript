import {DataSource} from 'typeorm'
import { Course } from './models/course'
import { Lesson } from './models/lesson'
import { User } from './models/user'

export const AppDataSource = new DataSource({
    type:'postgres',
    host:process.env.DB_HOST,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    port:parseInt(process.env.DB_PORT || '5432'),
    database:process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    extra: {
      connectionTimeoutMillis: 30000, // 30 seconds
    },
    entities:[
      Course,
      Lesson,
      User
    ],
    synchronize:true,
    logging:true
})