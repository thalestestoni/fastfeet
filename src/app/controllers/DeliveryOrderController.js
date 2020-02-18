import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { deliverymanId } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(deliverymanId);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: null,
      },
      limit: 20,
      offset: (page - 1) * 20,
      order: [['created_at', 'ASC']],
    });

    return res.json(orders);
  }
}

export default new DeliveryOrderController();
