import cors from 'cors';
import express from 'express';
import { readFile } from 'fs/promises';
import { router } from './app.router.js';
import { importCSV } from './import-data.js';
import { DatabaseService } from './services/database.service.js';

export async function init () {
  const app = express();

  app.use(cors());

  await DatabaseService.init();

  const data = await importCSV();
  const mapping = JSON.parse(await readFile('data/mapping.json', 'utf-8'));

  // first, delete the index
  await DatabaseService.client?.indices.delete({
    index: 'abex',
    ignore_unavailable: true,
  });
  // recreate the mapping
  await DatabaseService.client?.indices.create({
    index: 'abex',
    mappings: mapping.mappings,
  });

  // import the data
  for (const doc of data) {
    await DatabaseService.client?.index({
      index: 'abex',
      body: doc,
    });
  }

  app.use('/api', router);

  return new Promise((res, rej) => {
    app.listen(8000, () => {
      res(undefined);
    });
  });
}
