import cron from 'node-cron';
import { Op } from 'sequelize';
import { News, NewsStatuses } from '../models/index.js';

// Запускаем задачу каждую минуту
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    const statusPostponed = await NewsStatuses.findOne({
      where: { name: 'Отложено' }
    });

    const postponedNews = await News.findAll({
      where: {
        NewsStatusId: statusPostponed.id,
        publicationDate: {
          [Op.lte]: now,
        },
      },
    });

    const statusPublished = await NewsStatuses.findOne({
      where: { name: 'Опубликовано' }
    });

    for (const news of postponedNews) {
      news.NewsStatusId = statusPublished.id;
      await news.save();
      console.log(`Новость "${news.id}" опубликована автоматически.`);
    }
  } catch (err) {
    console.error('Ошибка в cron-задаче публикации:', err);
  }
});
