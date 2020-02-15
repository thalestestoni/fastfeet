import * as Yup from 'yup';

import Order from '../models/Order';
import File from '../models/File';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import NewOrder from '../jobs/NewOrder';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const order = await Order.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(order);
  }

  async show(req, res) {
    const order = await Order.findByPk(req.params.id, {
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields validation fails' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);
    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Delivery man does not exists' });
    }

    const order = await Order.create(req.body);

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    await Queue.add(NewOrder.key, {
      deliveryman,
      order,
    });

    return res.json(order);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    if (order.end_date) {
      return res.status(401).json({
        error: 'You cannot update a order that has already been completed',
      });
    }

    if (order.canceled_at) {
      return res.status(401).json({
        error: 'You cannot update a order that is canceled',
      });
    }

    if (req.body.recipient_id) {
      const recipientExists = await Recipient.findByPk(req.body.recipient_id);

      if (!recipientExists) {
        return res.status(400).json({ error: 'Recipient does not exists' });
      }
    }

    if (req.body.deliveryman_id) {
      const deliverymanExists = await Deliveryman.findByPk(
        req.body.deliveryman_id
      );

      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman does not exists' });
      }
    }

    if (req.body.signature_id) {
      const signatuerExists = await File.findOne({
        where: { id: req.body.signature_id },
      });

      if (!signatuerExists) {
        return res.status(400).json({ error: 'Signature does not exists' });
      }
    }

    await order.update(req.body);

    return res.json(order);
  }

  async destroy(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found ' });
    }

    await order.destroy();

    return res.send();
  }
}

export default new OrderController();
