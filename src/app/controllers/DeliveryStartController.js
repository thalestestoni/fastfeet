import * as Yup from 'yup';
import {
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  setSeconds,
  setHours,
  setMinutes,
  parseISO,
} from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class DeliveryStartController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields validation fails' });
    }

    const date = parseISO(req.body.start_date);

    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    /**
     * Check if start_date is whitin the allowed time.
     */
    const hourStarts = setSeconds(setMinutes(setHours(date, 8), 0), 0);
    const hourEnds = setSeconds(setMinutes(setHours(date, 18), 0), 0);

    if (isBefore(date, hourStarts) || isAfter(date, hourEnds)) {
      return res.status(400).json({ error: 'Out of hours allowed' });
    }

    /**
     * Checks if the deliveryman made more than five deliveries in the day.
     */
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const deliveriesStarts = await Delivery.findAll({
      where: {
        start_date: { [Op.between]: [dayStart, dayEnd] },
      },
    });

    if (deliveriesStarts.length >= 5) {
      return res
        .status(400)
        .json({ error: 'You can only make five deliveries a day.' });
    }

    /**
     * Checks if have a return from database and updates the delivery.
     */
    const { deliveryId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId, {
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new DeliveryStartController();
