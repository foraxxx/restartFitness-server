import cron from 'node-cron';
import { Op } from 'sequelize';
import { UserMemberships, Statuses } from '../models/index.js';

export const runMembershipStatusJob = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const plannedStatus = await Statuses.findOne({ where: { name: 'Запланирован' } });
  const activeStatus = await Statuses.findOne({ where: { name: 'Активный' } });
  const frozenStatus = await Statuses.findOne({ where: { name: 'Заморожен' } });
  const finishedStatus = await Statuses.findOne({ where: { name: 'Завершён' } });

  const toActivate = await UserMemberships.findAll({
    where: {
      dateStart: { [Op.gte]: today, [Op.lt]: tomorrow },
      StatusId: plannedStatus.id,
    },
  });

  for (const membership of toActivate) {
    membership.StatusId = activeStatus.id;
    await membership.save();
  }

  // Завершение активных и замороженных абонементов, если их дата окончания в прошлом
  const toFinish = await UserMemberships.findAll({
    where: {
      dateEnd: { [Op.gte]: today, [Op.lt]: tomorrow },
      StatusId: { [Op.in]: [activeStatus.id, frozenStatus.id] },
    },
  });

  for (const membership of toFinish) {
    membership.StatusId = finishedStatus.id;
    await membership.save();
  }

  console.log(`[${new Date().toISOString()}] Cron-задача на обновление статусов абонементов отработала`);
};

// Запуск каждый день в 00:00
cron.schedule('0 0 * * *', runMembershipStatusJob);
