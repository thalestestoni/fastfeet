import Mail from '../../lib/Mail';

class NewCancellation {
  get key() {
    return 'NewCancellation';
  }

  async handle({ data }) {
    const { deliveryman, delivery } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'New Cancellation',
      template: 'newCancellation',
      context: {
        deliveryman: deliveryman.name,
        delivery: delivery.id,
      },
    });
  }
}

export default new NewCancellation();
