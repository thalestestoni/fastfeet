import * as Yup from 'yup';
import Delivery from '../models/Delivery';

class StartOrderController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields validation fails' });
    }

    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId, {
      attributes: ['id', 'product', 'start_date', 'end_date'],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new StartOrderController();
