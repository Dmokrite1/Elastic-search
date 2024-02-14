import { Router } from 'express';
import { SearchController } from './controllers/search.controlller.js';

const router: Router = Router();

router.get('/search', SearchController.search);

export { router };
