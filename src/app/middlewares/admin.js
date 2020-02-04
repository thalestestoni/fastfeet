import User from '../models/User';

export default async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  if (!user.is_admin) {
    return res.status(401).json({ error: 'User is not admin' });
  }

  return next();
};
