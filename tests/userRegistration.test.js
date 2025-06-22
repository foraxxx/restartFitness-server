import ApiError from '../exceptions/apiErrors.js';
import UserService from '../service/userService.js';
import { Users, Roles } from '../models/index.js';
import TokenService from '../service/tokenService.js';
import UserDTO from '../dto/userDTO.js';


jest.mock('../models/index.js', () => ({
  Users: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Roles: {
    findOne: jest.fn(),
  },
}));

jest.mock('../service/tokenService.js', () => ({
  generateTokens: jest.fn(),
  saveToken: jest.fn(),
}));

jest.mock('../dto/userDTO.js', () => {
  return jest.fn().mockImplementation((user) => user);
});

describe('UserService.registration', () => {
  afterEach(() => jest.clearAllMocks());

  it('пользователь с таким номером уже существует', async () => {
    Users.findOne.mockResolvedValue({ id: 1 }); // пользователь найден

    await expect(UserService.registration('Иван', 'Иванов', '+79999999999'))
      .rejects
      .toThrow('Пользователь с таким номером уже существует');
  });

  it('пользователь успешно зарегистрирован', async () => {
    Users.findOne.mockResolvedValue(null); // пользователь не найден
    Roles.findOne.mockResolvedValue({ id: 1, name: 'Пользователь' });

    const mockUser = {
      id: 2,
      name: 'Иван',
      surName: 'Иванов',
      number: '79111111111',
      RoleId: 1
    };

    Users.create.mockResolvedValue(mockUser);

    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    TokenService.generateTokens.mockReturnValue(mockTokens);
    TokenService.saveToken.mockResolvedValue();

    const result = await UserService.registration('Иван', 'Иванов', '79111111111');

    expect(result).toEqual({
      ...mockTokens,
      user: {
        id: 2,
        name: 'Иван',
        surName: 'Иванов',
        number: '79111111111',
        role: 'Пользователь'
      },
    });

    expect(Users.create).toHaveBeenCalledWith({
      name: 'Иван',
      surName: 'Иванов',
      number: '79111111111',
      RoleId: 1
    });

    expect(TokenService.generateTokens).toHaveBeenCalledWith(expect.objectContaining({
      id: 2,
      name: 'Иван',
      surName: 'Иванов',
      number: '79111111111',
      role: 'Пользователь'
    }));

    expect(TokenService.saveToken).toHaveBeenCalledWith(2, 'refresh-token');
  });
});
