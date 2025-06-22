import MembershipService from '../service/membershipService.js';
import { Memberships, MembershipTypes, Statuses } from '../models/index.js';

jest.mock('../models/index.js'); // Мокаем модели

describe('MembershipService.create', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('абонемент успешно создан', async () => {
    const mockInput = {
      name: 'Фитнес 1 месяц',
      price: 2000,
      duration: 30,
      MembershipTypeId: 1,
      StatusId: 1
    };

    const mockCreated = { id: 10, ...mockInput };

    const mockFullData = {
      id: 10,
      name: 'Фитнес 1 месяц',
      price: 2000,
      duration: 30,
      MembershipTypeId: 1,
      StatusId: 1,
      MembershipType: { id: 1, name: 'Месячный' },
      Status: { id: 1, name: 'Активный' }
    };

    // Мокаем создание
    Memberships.create.mockResolvedValue(mockCreated);

    // Мокаем выборку с include
    Memberships.findOne.mockResolvedValue(mockFullData);

    const result = await MembershipService.create(mockInput);

    expect(Memberships.create).toHaveBeenCalledWith(mockInput);
    expect(Memberships.findOne).toHaveBeenCalledWith({
      where: { id: mockCreated.id },
      include: [{ model: MembershipTypes }, { model: Statuses }]
    });

    expect(result).toEqual(mockFullData);
  });
});
