import * as Yup from 'yup';
import Problem from '../models/Problem';

class ProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const problems = await Problem.findAll();

    return res.json(problems);
  }
}

export default new ProblemController();
