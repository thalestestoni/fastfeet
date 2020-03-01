import * as Yup from 'yup';
import Problem from '../models/Problem';
import Deliveryman from '../models/Deliveryman';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const problems = await Problem.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(problems);
  }

  async show(req, res) {
    const problem = await Problem.findByPk(req.params.id);

    if (!problem) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    return res.json(problem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields validation fails' });
    }

    const { id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Delivery not found' });
    }
    const problem = await Problem.create({
      delivery_id: id,
      description: req.body.description,
    });

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
