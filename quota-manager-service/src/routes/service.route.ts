import { Router } from 'express';
import { logger } from '../utils/logger.utils';
import { post } from '../controllers/service.controller';

const serviceRouter = Router();

serviceRouter.post('/', async (req, res) => {
  try {
    logger.info('Executing cart update extension');
    await post(req, res);
    logger.info('Cart update extension executed');
  } catch (e) {
    res.status(500);
  }
  res.send();
});

export default serviceRouter;
