import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'NewDelivery';
  }

  async handle({ data }) {
    const { deliveryman, delivery } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'New Delivery',
      template: 'newDelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
      },
    });
  }
}

export default new NewDelivery();
