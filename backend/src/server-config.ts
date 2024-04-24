import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import fs from 'fs';
import routes from './modules';

import Logger from 'n23-logger';
import { IS_PRODUCTION, IS_WINDOWS, MISC_PATH } from './config/const';
import CustomError, { COMMON_ERRORS } from './errors';
import { Respond, RespondFile } from './utils/ExpressUtils';
import { FileUpload, FileUtils, SingleFileUploadOptions } from './utils/files';

const allowlist = ['http://localhost:5173'];

const corsOptionsDelegate = (req: any, callback: any) => {
	let corsOptions;
	let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

	if (isDomainAllowed) {
		// Enable CORS for this request
		corsOptions = {
			origin: true,
			credentials: true,
			exposedHeaders: ['Content-Disposition'],
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			optionsSuccessStatus: 204,
		};
	} else {
		// Disable CORS for this request
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

export default function (app: Express) {
	//Defines all global variables and constants
	let basedir = __dirname;
	basedir = basedir.slice(0, basedir.lastIndexOf(IS_WINDOWS ? '\\' : '/'));
	if (IS_PRODUCTION) {
		basedir = basedir.slice(0, basedir.lastIndexOf(IS_WINDOWS ? '\\' : '/'));
	}
	global.__basedir = basedir;

	//Initialize all the middleware
	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true, limit: '2048mb' }));
	app.use(express.json({ limit: '2048mb' }));
	app.use(cors(corsOptionsDelegate));
	app.use(express.static(__basedir + 'static'));
	app.route('/api-status').get((req, res) => {
		res.status(200).json({
			success: true,
		});
	});
	app.use((req: Request, res: Response, next: NextFunction) => {
		req.locals = {
			...req.locals,
		};
		res.locals = {
			...res.locals,
		};
		const { headers, body, url } = req;

		Logger.http(url, {
			type: 'request',
			headers,
			body,
			label: headers['client-id'] as string,
			request_id: res.locals.request_id,
		});
		next();
	});

	app.use(routes);

	app.route('/images/:path/:filename').get((req, res, next) => {
		try {
			const path = __basedir + '/static/' + req.params.path + '/' + req.params.filename;
			return RespondFile({
				res,
				filename: req.params.filename,
				filepath: path,
			});
		} catch (err: unknown) {
			console.log(err);

			return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
		}
	});
	app.route('/images').post(async (req, res, next) => {
		const fileUploadOptions: SingleFileUploadOptions = {
			field_name: 'file',
			options: {},
		};

		try {
			const uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);

			const location = req.body.location as string;

			const destination = `${__basedir}/static/${location}/${uploadedFile.filename}`;
			FileUtils.moveFile(uploadedFile.path, destination);

			return Respond({
				res,
				status: 200,
				data: {
					filepath: `${location}/${uploadedFile.filename}`,
				},
			});
		} catch (err: unknown) {
			return next(new CustomError(COMMON_ERRORS.FILE_UPLOAD_ERROR));
		}
	});

	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof CustomError) {
			if (err.status === 500) {
				Logger.http(res.locals.url, {
					type: 'response-error',
					request_id: res.locals.request_id,
					status: 500,
					response: err.error || err,
					headers: req.headers,
					body: req.body,
					label: req.headers['client-id'] as string,
				});
			}

			return res.status(err.status).json({
				success: false,
				status: 'error',
				title: err.title,
				message: err.message,
			});
		}

		Logger.error(`Internal Server Error`, err, {
			type: 'error',
			request_id: res.locals.request_id,
		});
		res.status(500).json({
			success: false,
			status: 'error',
			title: 'Internal Server Error',
			message: err.message,
		});
		next();
	});

	createDir();
}

function createDir() {
	fs.mkdirSync(__basedir + MISC_PATH, { recursive: true });
}
