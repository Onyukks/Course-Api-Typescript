import * as dotenv from 'dotenv'

const result = dotenv.config()

if(result.error){
    console.log('Error loading enviroment variables. Aborting...')
    process.exit(1)
}

import 'reflect-metadata'
import * as express from 'express'
import userRoute from './routes/user.route'
import coursesRoute from './routes/courses.route'
import { logger } from './logger'
import { AppDataSource } from './data-source'
import { DefaultErrorHandler } from './middlewares/defaultErrorHandler'
import { protectedRoute } from './middlewares/protectedRoute'

const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()


function setupExpress() {

    app.use(cors({origin:true}));

    app.use(bodyParser.json());
    app.use(cookieParser())

    app.use('/api/user',userRoute)
    app.use('/api/courses',protectedRoute,coursesRoute)

    app.use(DefaultErrorHandler)

}

function startServer() {
    app.listen(process.env.PORT,()=>logger.info(`Server is Up and Running on http://localhost:${process.env.PORT}  `))
}



AppDataSource.initialize()
    .then(() => {
        logger.info(`The datasource has been initialized successfully.`);
        setupExpress();
        startServer();
    })
    .catch(err => {
        logger.error(`Error during datasource initialization.`, err);
        process.exit(1);
    })