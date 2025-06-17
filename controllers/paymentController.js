import ApiError from "../exceptions/apiErrors.js"
import yooKassa from "../utils/yookassa.js"
import { v4 as uuidv4 } from 'uuid';
import {
  Memberships,
  Payments,
  PaymentStatuses,
  Statuses,
  UserMemberships,
  UserTrainingPackages
} from "../models/models.js"
import MembershipService from "../service/membershipService.js"
import UserMembershipsService from "../service/userMembershipsService.js"


class PaymentController {
  async create(req, res, next) {
    try {
      const {
        amount,
        paymentMethod = 'Банковская карта',
        type,
        membershipId,
        trainingPackageId,
        returnUrl
      } = req.body;
      const userId = req.user.role === 'Администратор' ? req.body.userId : req.user.id;

      console.log(`\n ${amount} \n`)
      console.log(`\n ${returnUrl} \n`)

      if (
        !amount ||
        !type ||
        (type === 'Абонемент' && !membershipId) ||
        (type === 'Персональная тренировка' && !trainingPackageId)
      ) {
        return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
      }

      if (type === 'Абонемент') {
        const plannedStatus = await Statuses.findOne({ where: { name: 'Запланирован' } });
        const hasPlanned = await UserMemberships.findOne({
          where: {
            UserId: userId,
            StatusId: plannedStatus.id
          }
        });

        if (hasPlanned) {
          return res.status(400).json({ message: 'У вас уже есть запланированный абонемент' });
        }
      }

      const pendingStatus = await PaymentStatuses.findOne({ where: { name: 'Ожидает оплаты' } });

      const paymentData = {
        amount,
        paymentMethod,
        UserId: userId,
        MembershipId: membershipId,
        PaymentStatusId: pendingStatus.id,
        type,
        description: '',
      };

      if (type === 'Абонемент') {
        paymentData.description = `Оплата абонемента`;
      } else if (type === 'Персональная тренировка') {
        paymentData.description = `Оплата персональной тренировки`;
      }

      const paymentRecord = await Payments.create(paymentData);

      const idempotenceKey = uuidv4();

      const response = await yooKassa.createPayment({
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        payment_method_data: {
          type: 'bank_card',
        },
        confirmation: {
          type: 'redirect',
          return_url: returnUrl || `http://localhost:5173/`,
        },
        capture: true,
        description: paymentData.description,
        metadata: {
          paymentId: paymentRecord.id,
          userId,
          membershipId,
          trainingPackageId,
        },
      }, idempotenceKey);

      return res.json({
        confirmation_url: response.confirmation.confirmation_url,
        paymentId: paymentRecord.id,
      });

    } catch (error) {
      next(error);
    }
  }


  async webhook(req, res, next) {
    try {
      console.log('\n ку ку \n')
      // const body = JSON.parse(req.body.toString());

      const body = req.body;

      if (body.event !== 'payment.succeeded') {
        return res.status(200).send('Event ignored');
      }

      const paymentId = body.object.metadata.paymentId;
      const userId = body.object.metadata.userId;
      const membershipId = body.object.metadata.membershipId;
      const trainingPackageId = body.object.metadata.trainingPackageId;

      console.log(`\n ${membershipId} \n`)

      const payment = await Payments.findByPk(paymentId);
      if (!payment) {
        return res.status(404).json({ message: 'Платёж не найден' });
      }

      const paidStatus = await PaymentStatuses.findOne({ where: { name: 'Оплачен' } });
      payment.PaymentStatusId = paidStatus.id;
      await payment.save();

      if (payment.type === 'Абонемент') {
        const membership = await Memberships.findByPk(membershipId);
        if (!membership) return res.status(404).json({ message: 'Абонемент не найден' });

        const [activeStatus, freezingStatus, scheduledStatus] = await Promise.all([
          Statuses.findOne({ where: { name: 'Активный' } }),
          Statuses.findOne({ where: { name: 'Заморожен' } }),
          Statuses.findOne({ where: { name: 'Запланирован' } }),
        ]);

        // Найти последний активный или запланированный абонемент пользователя
        const lastMembership = await UserMemberships.findOne({
          where: {
            UserId: userId,
            StatusId: [activeStatus.id, freezingStatus.id],
          },
          order: [['dateEnd', 'DESC']],
        });

        let dateStart = new Date();
        let statusId = activeStatus.id;

        if (lastMembership && new Date(lastMembership.dateEnd) > new Date()) {
          dateStart = new Date(lastMembership.dateEnd);
          statusId = scheduledStatus.id;
        }

        const dateEnd = new Date(dateStart);
        dateEnd.setDate(dateStart.getDate() + membership.durationDays);
        const qrCode = uuidv4();

        const userMembershipData = {
          UserId: userId,
          name: membership.name,
          MembershipId: membershipId,
          dateStart,
          dateEnd,
          StatusId: statusId,
          freezingDays: membership.freezingDays,
          qrCode
        };

        await UserMemberships.create(userMembershipData);
      } else if (payment.type === 'Персональная тренировка') {
        await UserTrainingPackages.create({
          UserId: userId,
          TrainingPackageId: trainingPackageId,
          StatusId: paidStatus.id,
        });
      }

      res.status(200).send('OK');
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController()