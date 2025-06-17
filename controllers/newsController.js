import ApiError from "../exceptions/apiErrors.js";
import newsService from "../service/newsService.js";
import {
  ensureDirExists,
  prepareUploadedFiles,
  moveUploadedFiles,
  removeFiles
} from "../utils/fileUtils.js";
import path from "path"

class NewsController {
  async create(req, res, next) {
    const {text, publicationDate, NewsStatusId, UserId} = req.body;

    if (!text || !NewsStatusId) {
      return next(ApiError.BadRequest("Обязательные поля: text, NewsStatusId"));
    }

    const filesRaw = req.files?.documents;

    let files = [];
    if (filesRaw) {
      files = Array.isArray(filesRaw) ? filesRaw : [filesRaw];
    }

    const savedFilePaths = [];

    try {
      const uploadedFiles = await prepareUploadedFiles(files, savedFilePaths);

      const newData = await newsService.create({
        text,
        publicationDate,
        NewsStatusId,
        UserId,
        documents: uploadedFiles
      });

      await moveUploadedFiles(savedFilePaths);

      return res.json(newData);

    } catch (error) {
      removeFiles(savedFilePaths);
      next(error);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { text, publicationDate, NewsStatusId, UserId } = req.body;
    const files = req.files?.documents;
    const savedFilePaths = [];
    console.log(id)

    try {
      const existingNews = await newsService.getOne(id);
      if (!existingNews) {
        return next(ApiError.NotFound("Новость не найдена"));
      }

      const oldFilePaths = existingNews.NewsDocuments.map(doc =>
        path.resolve(process.cwd(), "static/newsDocuments", doc.url)
      );

      const docsForDb = await prepareUploadedFiles(files, savedFilePaths, id);

      await newsService.update(id, {
        text,
        publicationDate,
        NewsStatusId,
        UserId,
        documents: docsForDb,
      });

      removeFiles(oldFilePaths);
      await moveUploadedFiles(savedFilePaths);

      const updatedNews = await newsService.getOne(id);
      return res.json(updatedNews);

    } catch (error) {
      removeFiles(savedFilePaths.map(obj => obj.fullPath));
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const deletedNews = await newsService.delete(id);

      return res.json(deletedNews);
    } catch(error) {
      next(error);
    }
  }

  async getByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const newsList = await newsService.getByStatus(status);
      return res.json(newsList);
    } catch (error) {
      next(error);
    }
  }
}

export default new NewsController();
