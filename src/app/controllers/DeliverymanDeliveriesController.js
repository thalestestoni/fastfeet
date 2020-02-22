import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliverymanDeliveriesOrderController {
  async index(req, res) {
    const { deliverymanId } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(deliverymanId);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: null,
      },
      limit: 20,
      offset: (page - 1) * 20,
      order: [['created_at', 'ASC']],
    });

    return res.json(deliveries);
  }
}

export default new DeliverymanDeliveriesOrderController();
