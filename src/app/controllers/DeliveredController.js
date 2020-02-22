import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveredController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { deliverymanId } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(deliverymanId);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: {
          [Op.ne]: null,
        },
      },
      limit: 20,
      offset: (page - 1) * 20,
      order: [['end_date', 'DESC']],
    });

    return res.json(deliveries);
  }
}

export default new DeliveredController();
