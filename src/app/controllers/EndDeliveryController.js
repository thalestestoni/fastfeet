import * as Yup from 'yup';
import Delivery from '../models/Delivery';

class EndDeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields validation fails' });
    }

    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!Delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new EndDeliveryController();
