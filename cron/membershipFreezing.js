import cron from 'node-cron';
import { Op } from 'sequelize';
import { UserMembershipFreezings, UserMemberships, Statuses } from '../models/index.js';

export const runFreezingStatusJob = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const frozenStatus = await Statuses.findOne({ where: { name: 'Заморожен' } });
  const activeStatus = await Statuses.findOne({ where: { name: 'Активный' } });
  const finishedStatus = await Statuses.findOne({ where: { name: 'Завершена' } });

  // Активация заморозок
  const toFreeze = await UserMembershipFreezings.findAll({
    where: {
      dateStart: { [Op.gte]: today, [Op.lt]: tomorrow },
      StatusId: activeStatus.id,
    },
  });

  for (const freeze of toFreeze) {
    freeze.StatusId = frozenStatus.id;
    await freeze.save();

    const membership = await UserMemberships.findByPk(freeze.UserMembershipId);
    if (membership) {
      membership.StatusId = frozenStatus.id;
      await membership.save();
    }
  }

  // Разморозка
  const toUnfreeze = await UserMembershipFreezings.findAll({
    where: {
      dateEnd: { [Op.gte]: today, [Op.lt]: tomorrow },
      StatusId: frozenStatus.id,
    },
  });

  for (const freeze of toUnfreeze) {
    freeze.StatusId = finishedStatus.id;
    await freeze.save();

    const membership = await UserMemberships.findByPk(freeze.UserMembershipId);
    if (membership) {
      membership.StatusId = activeStatus.id;
      await membership.save();
    }
  }

  console.log(`[${new Date().toISOString()}] Cron-задача на заморозку отработала`);
};

// Запуск каждый день в 00:00
cron.schedule('0 0 * * *', runFreezingStatusJob);
