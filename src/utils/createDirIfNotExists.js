import fs from 'node:fs/promises';

const createDirIfNotExists = async (dir) => {
  try {
    await fs.access(dir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dir);
    } else {
      throw error;
    }
  }
};

export default createDirIfNotExists;
