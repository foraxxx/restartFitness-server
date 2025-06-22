import NewsService from '../service/newsService.js';
import { News, NewsDocuments } from '../models/index.js';

jest.mock('../models/index.js');

describe('NewsService.create', () => {
  afterEach(() => jest.clearAllMocks());

  it('создаёт новость и документы, если они есть', async () => {
    const mockData = {
      text: 'Новость про зал',
      NewsStatusId: 1,
      UserId: 10,
      publicationDate: new Date('2025-06-01'),
      documents: [
        { fileName: 'file1.pdf', filePath: '/files/file1.pdf' },
        { fileName: 'file2.pdf', filePath: '/files/file2.pdf' }
      ]
    };

    const createdNews = {
      id: 42,
      ...mockData,
      publicationDate: mockData.publicationDate
    };

    const finalNews = { ...createdNews, documents: mockData.documents };

    News.create.mockResolvedValue(createdNews);
    NewsDocuments.bulkCreate.mockResolvedValue(undefined);
    jest.spyOn(NewsService, 'getOne').mockResolvedValue(finalNews);

    const result = await NewsService.create(mockData);

    expect(News.create).toHaveBeenCalledWith({
      text: mockData.text,
      NewsStatusId: mockData.NewsStatusId,
      UserId: mockData.UserId,
      publicationDate: mockData.publicationDate
    });

    expect(NewsDocuments.bulkCreate).toHaveBeenCalledWith([
      { ...mockData.documents[0], NewsId: 42 },
      { ...mockData.documents[1], NewsId: 42 }
    ]);

    expect(NewsService.getOne).toHaveBeenCalledWith(42);
    expect(result).toEqual(finalNews);
  });

  it('создаёт новость без документов, если они не переданы', async () => {
    const mockData = {
      text: 'Новость без документов',
      NewsStatusId: 2,
      UserId: 11
    };

    const createdNews = {
      id: 100,
      ...mockData,
      publicationDate: expect.any(Date)
    };

    const finalNews = { ...createdNews, documents: [] };

    News.create.mockResolvedValue(createdNews);
    jest.spyOn(NewsService, 'getOne').mockResolvedValue(finalNews);

    const result = await NewsService.create(mockData);

    expect(News.create).toHaveBeenCalledWith({
      text: mockData.text,
      NewsStatusId: mockData.NewsStatusId,
      UserId: mockData.UserId,
      publicationDate: expect.any(Date)
    });

    expect(NewsDocuments.bulkCreate).not.toHaveBeenCalled();
    expect(NewsService.getOne).toHaveBeenCalledWith(100);
    expect(result).toEqual(finalNews);
  });
});
