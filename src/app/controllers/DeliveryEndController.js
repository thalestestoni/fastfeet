import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryEndController {
  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields validation fails' });
    }

    const { signature_id } = req.body;

    if (signature_id) {
      const signatureExists = await File.findByPk(req.body.signature_id);

      if (!signatureExists) {
        return res.status(400).json({ error: 'Signature not found' });
      }
    }

    const delivery = await Delivery.findByPk(req.params.deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new DeliveryEndController();
