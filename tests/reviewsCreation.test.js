import ReviewsService from '../service/reviewsService.js';
import { Statuses, Reviews } from '../models/index.js';

jest.mock('../models/index.js');

describe('ReviewsService.create', () => {
  afterEach(() => jest.clearAllMocks());

  it('должен создать отзыв со статусом "На проверке"', async () => {
    // Подготовка моков
    const mockStatus = { id: 1, name: 'На проверке' };
    Statuses.findOne.mockResolvedValue(mockStatus);

    const mockReviewData = {
      description: 'Отличный зал!',
      rating: 5,
      isAnonymous: false,
      UserId: 42
    };

    const mockCreatedReview = {
      id: 123,
      ...mockReviewData,
      StatusId: mockStatus.id
    };

    Reviews.create.mockResolvedValue(mockCreatedReview);

    // Вызов
    const result = await ReviewsService.create(mockReviewData);

    // Проверки
    expect(Statuses.findOne).toHaveBeenCalledWith({ where: { name: 'На проверке' } });
    expect(Reviews.create).toHaveBeenCalledWith({
      ...mockReviewData,
      StatusId: mockStatus.id
    });
    expect(result).toEqual(mockCreatedReview);
  });
});
