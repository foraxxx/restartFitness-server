import ApiError from "../exceptions/apiErrors.js";
import {
  News,
  NewsDocuments,
  NewsStatuses,
  Users
} from "../models/index.js";
import { Op } from "sequelize";
import path from "path"
import {removeFiles} from "../utils/fileUtils.js"

class NewsService {
  async create(data) {
    const { text, NewsStatusId, UserId, documents, publicationDate } = data;

    const news = await News.create({
      text,
      NewsStatusId,
      UserId,
      publicationDate: publicationDate || new Date()
    });

    if (documents && documents.length) {
      const docs = documents.map(doc => ({
        ...doc,
        NewsId: news.id
      }));
      await NewsDocuments.bulkCreate(docs);
    }

    return this.getOne(news.id);
  }

  async update(id, data) {
    const { text, NewsStatusId, UserId, documents, publicationDate } = data;

    const news = await this.getOne(id);
    if (!news) {
      throw ApiError.NotFound("Новость не найдена");
    }

    await news.update({
      text,
      NewsStatusId,
      UserId,
      publicationDate: publicationDate || new Date()
    });

    await NewsDocuments.destroy({
      where: { NewsId: id }
    });

    if (documents && documents.length) {
      const docs = documents.map(doc => ({
        ...doc,
        NewsId: id
      }));
      await NewsDocuments.bulkCreate(docs);
    }

    return this.getOne(id);
  }

  async getOne(id) {
    const newsData = await News.findOne({
      where: { id },
      include: [
        { model: NewsDocuments, attributes: ['url', 'type'] },
        { model: NewsStatuses, attributes: ['id', 'name'] },
        { model: Users, attributes: ['id', 'name', 'surName'] }
      ]
    });

    return newsData;
  }

  async getByStatus(statusKey) {
    const statusMap = {
      published: "Опубликовано",
      postponed: "Отложено",
      archived: "Архивировано"
    };

    const statusName = statusMap[statusKey.toLowerCase()];

    if (!statusName) {
      throw ApiError.BadRequest("Недопустимый статус новости");
    }

    const newsList = await News.findAll({
      include: [
        {
          model: NewsStatuses,
          where: { name: statusName },
          attributes: ["id", "name"]
        },
        {
          model: NewsDocuments,
          attributes: ["id", "url", "type"]
        },
        {
          model: Users,
          attributes: ["id", "name", "surName"]
        }
      ],
      order: [["publicationDate", "ASC"]]
    });

    return newsList;
  }



  async delete(id) {
    const newsData = await this.getOne(id);

    if (!newsData) {
      throw ApiError.NotFound("Новость не найдена");
    }

    if (newsData.NewsDocuments && newsData.NewsDocuments.length) {
      const filePaths = newsData.NewsDocuments.map(doc =>
        path.resolve(process.cwd(), "static/newsDocuments", doc.url)
      );

      removeFiles(filePaths);

      await NewsDocuments.destroy({ where: { NewsId: id } });
    }

    await News.destroy({ where: { id } });
    await NewsDocuments.destroy({ where: { NewsId: id } });

    return newsData;
  }
}

export default new NewsService();
