import MembershipService from "../service/membershipService.js"
import ApiError from "../exceptions/apiErrors.js"
import {MembershipTypes, Roles, Statuses, Trainers, UserMembershipFreezings, UserMemberships} from "../models/index.js"
import {Op} from "sequelize"
import userMembershipsService from "../service/userMembershipsService.js"
import { v4 as uuidv4 } from 'uuid';

class UserMembershipsController {
  async create(req, res, next) {
    try {
      const {id: MembershipId} = req.params
      const {user} = req
      const membershipData = await MembershipService.getOne(MembershipId)

      if (membershipData.Status.name !== 'Активный') {
        return next(ApiError.BadRequest('Абонемент не найден'))
      }

      const status = await Statuses.findOne({where: {name: 'Активный'}})

      const {durationDays, name, freezingDays} = membershipData
      let now = new Date()
      now.setDate(now.getDate())
      const dateStart = now.toISOString().split('T')[0]
      now.setDate(now.getDate() + durationDays)
      const dateEnd = now.toISOString().split('T')[0]
      const qrCode = uuidv4();

      const userMembershipData = await userMembershipsService.create(
        {
          MembershipId,
          UserId: user.id,
          StatusId: status.id,
          dateStart, dateEnd,
          dateOrder: dateStart,
          freezingDays,
          name: name,
          qrCode: qrCode
        })


      // return res.json({...userMembershipData.toJSON(), message: 'Абонемент успешно оформлен!'})
      return res.json(userMembershipData)

    } catch(error) {
      next(error)
    }
  }

  async freezingMembership(req, res, next) {
    try {
      const {membershipId, dateStart, dateEnd} = req.body
      const {user} = req
      const membership = await UserMemberships.findByPk(membershipId, {include: [{model: Statuses}, {model: UserMembershipFreezings}]});
      if (!membership) throw new Error('Абонемент не найден');

      if (dateEnd <= dateStart) throw new Error('Дата окончания должна быть позже даты начала');

      const freezingDays = Math.ceil((new Date(dateEnd) - new Date(dateStart)) / (1000 * 60 * 60 * 24));

      if (freezingDays < 7) throw new Error('Минимальный срок заморозки — 7 дней');

      const maxFreezeDays = membership.freezingDays;
      if (freezingDays > maxFreezeDays) throw new Error(`Максимальный срок заморозки — ${maxFreezeDays} дней`);

      const status = await Statuses.findOne({where: {name: 'Заморожен'}});
      const plannedStatus = await Statuses.findOne({where: {name: 'Запланирован'}});
      const freezingStatus = await Statuses.findOne({ where: { name: 'Активный' } });

      const existingFreeze = await UserMembershipFreezings.findOne({
        where: {
          UserMembershipId: membership.id,
          StatusId: {
            [Op.in]: [freezingStatus.id, plannedStatus.id]
          }
        }
      });

      if (existingFreeze) {
        throw new Error('У вас уже есть одна активная или запланированная заморозка. Дождитесь её окончания.');
      }

      const overlappingFreeze = await UserMembershipFreezings.findOne({
        where: {
          UserMembershipId: membershipId,
          [Op.or]: [
            {
              dateStart: { [Op.between]: [dateStart, dateEnd] }
            },
            {
              dateEnd: { [Op.between]: [dateStart, dateEnd] }
            },
            {
              [Op.and]: [
                { dateStart: { [Op.lte]: dateStart } },
                { dateEnd: { [Op.gte]: dateEnd } },
              ]
            }
          ],
          StatusId: status.id,
        }
      });

      if (overlappingFreeze) throw new Error('Уже есть заморозка, пересекающаяся по времени');

      // Создаём заморозку
      const newFreeze = await UserMembershipFreezings.create({
        UserMembershipId: membershipId,
        dateStart,
        dateEnd,
        freezingDays,
        StatusId: freezingStatus.id,
      });

      membership.dateEnd = new Date(membership.dateEnd.getTime() + freezingDays * 24 * 60 * 60 * 1000);
      membership.freezingDays = membership.freezingDays - freezingDays;

      // const updated = await membership.save();

      // const updated = await UserMemberships.findByPk(membershipId, {include: [{model: Statuses}, {model: UserMembershipFreezings}]});

      const planned = await UserMemberships.findOne({where: {StatusId: plannedStatus.id}});

      if (planned) {
        planned.dateStart = new Date(planned.dateStart.getTime() + freezingDays * 24 * 60 * 60 * 1000);
        planned.dateEnd = new Date(planned.dateEnd.getTime() + freezingDays * 24 * 60 * 60 * 1000);
        await planned.save();
      }


      // Сдвигаем дату начала и окончания запланированного абонемента (если есть)
      // console.log(`\n dateEnd: ${updated.dateEnd} \n`)
      // const plannedMembership = await UserMemberships.findOne({
      //   where: {
      //     UserId: membership.UserId,
      //     dateStart: { [Op.gt]: updated.dateEnd },
      //     StatusId: plannedStatus.id,
      //   }
      // });

      // if (plannedMembership) {
      //   plannedMembership.dateStart = new Date(plannedMembership.dateStart.getTime() + freezingDays * 24 * 60 * 60 * 1000);
      //   plannedMembership.dateEnd = new Date(plannedMembership.dateEnd.getTime() + freezingDays * 24 * 60 * 60 * 1000);
      //   await plannedMembership.save();
      // }

      // const updatedPlannedMembership = await UserMemberships.findOne({where: {
      //     UserId: membership.UserId,
      //     StatusId: plannedStatus.id,
      //   }},
      //   {include: [{model: Statuses}]});

      const updatedMemberships = await UserMemberships.findAll({
        where: { UserId: user.id },
        include: [
          { model: Statuses },
          { model: UserMembershipFreezings }
        ]
      });

      return res.json(updatedMemberships);
    } catch(error) {
        next(error)
    }
  }

  async getOne(req, res, next) {
    try {

    } catch(error) {
      next(error)
    }
  }

  async getAllUserMemberships(req, res, next) {
    try {
      const {user} = req

      const userMembershipsData = await userMembershipsService.getAllUserMemberships(user.id)
      return res.json(userMembershipsData)
    } catch(error) {
      next(error)
    }
  }
}

export default new UserMembershipsController()