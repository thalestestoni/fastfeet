import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveredController from './app/controllers/DeliveredController';
import DeliverymanDeliveriesController from './app/controllers/DeliverymanDeliveriesController';
import DeliveryStartController from './app/controllers/DeliveryStartController';
import DeliveryEndController from './app/controllers/DeliveryEndController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliveryCancelController from './app/controllers/DeliveryCancelController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/recipients/', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post('/files', upload.single('file'), FileController.store);

routes.get(
  '/deliveryman/:deliverymanId/deliveries',
  DeliverymanDeliveriesController.index
);

routes.get(
  '/deliveryman/:deliverymanId/delivered/deliveries',
  DeliveredController.index
);

routes.put('/delivery/:deliveryId/start', DeliveryStartController.update);
routes.put('/delivery/:deliveryId/end', DeliveryEndController.update);

routes.post('/delivery/:id/problems', DeliveryProblemController.store);

routes.use(adminMiddleware);

routes.post('/recipients', RecipientController.store);

routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id', DeliverymanController.show);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.destroy);

routes.get('/delivery/:id/problems', DeliveryProblemController.show);
routes.get('/delivery/problems', DeliveryProblemController.index);

routes.delete('/problem/:id/cancel-delivery', DeliveryCancelController.destroy);

routes.get('/delivery', DeliveryController.index);
routes.get('/delivery/:id', DeliveryController.show);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.destroy);

export default routes;
