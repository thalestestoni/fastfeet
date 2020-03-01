import Queue from '../../lib/Queue';
import NewCancellation from '../jobs/NewCancellation';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveryCancelController {
  async destroy(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    delivery.canceled_at = new Date();

    const deliveryman = await Deliveryman.findByPk(delivery.deliveryman_id);

    await Queue.add(NewCancellation.key, {
      deliveryman,
      delivery,
    });

    return res.json(delivery);
  }
}

export default new DeliveryCancelController();
