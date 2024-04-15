import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import configServer from './server-config';

import Logger from 'n23-logger';
import db from '../db/db';
import migrateDB from '../db/migrate';
import { PORT } from './config/const';

//  ------------------------- Setup Variables
const app = express();

configServer(app);

const server = app.listen(PORT, async () => {
	await migrateDB();
	const product = await db.query.ProductTable.findFirst({});
	console.log(product);

	Logger.info('Running Status', `Server started on port ${PORT}`);
});

process.setMaxListeners(0);
process.on('unhandledRejection', (err: Error) => {
	Logger.critical('Unhandled rejection', err);
	server.close(() => process.exit(1));
});
