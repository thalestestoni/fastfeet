import * as Yup from 'yup';
import Order from '../models/Order';

class StartOrderController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields validation fails' });
    }

    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      attributes: ['id', 'product', 'start_date', 'end_date'],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    await order.update(req.body);

    return res.json(order);
  }
}

export default new StartOrderController();
