import Mail from '../../lib/Mail';

class NewOrder {
  get key() {
    return 'NewOrder';
  }

  async handle({ data }) {
    const { deliveryman, order } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'New order',
      template: 'newOrder',
      context: {
        deliveryman: deliveryman.name,
        product: order.product,
      },
    });
  }
}

export default new NewOrder();
