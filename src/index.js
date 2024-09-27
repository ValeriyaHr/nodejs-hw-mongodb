import setupServer from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';
import createDirIfNotExists from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR } from './constants/index.js';

await initMongoDB();
await createDirIfNotExists(TEMP_UPLOAD_DIR);

setupServer();
