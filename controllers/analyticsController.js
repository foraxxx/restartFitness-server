import {Users, UserMemberships, Payments, Reviews, Memberships, Statuses, MembershipTypes} from '../models/models.js'
import { Op, fn, col, literal, Sequelize } from 'sequelize';
import sequelize from "../db.js"

class AnalyticsController {
  async getDashboardData(req, res) {
    try {
      const clientsCount = await Users.count();

      const activeMemberships = await UserMemberships.count({
        where: {
          dateEnd: {
            [Op.gte]: new Date(),
          },
        },
      });

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyIncomeResult = await Payments.sum('amount', {
        where: {
          paymentDate: {
            [Op.gte]: startOfMonth,
          },
        },
      });

      const startOf = new Date();
      startOf.setMonth(0);
      startOf.setDate(1);
      startOf.setHours(0, 0, 0, 0);

      const yearlyIncomeResult = await Payments.sum('amount', {
        where: {
          paymentDate: {
            [Op.gte]: startOf,
          },
        },
      });

      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);

      const newClients = await Users.count({
        where: {
          createdAt: {
            [Op.gte]: lastMonth,
          },
        },
      });

      const reviewsCount = await Reviews.count();

      const statusPublished = await Statuses.findOne({where: {name: "Опубликован"}})

      const publishedReviews = await Reviews.count({
        where: {
          StatusId: statusPublished.id,
        },
      });

      const averageRating = await Reviews.findOne({
        attributes: [[fn('AVG', col('rating')), 'avgRating']],
        raw: true,
      });

      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

      const incomeData = await Payments.findAll({
        attributes: [
          [fn('TO_CHAR', col('"Payments"."paymentDate"'), 'Mon'), 'month'],
          [fn('SUM', col('amount')), 'income'],
        ],
        where: {
          paymentDate: {
            [Op.gte]: startOfYear,
            [Op.lt]: endOfYear,
          },
        },
        group: [literal('TO_CHAR("Payments"."paymentDate", \'Mon\')')],
        order: [literal('MIN("Payments"."paymentDate")')],
        raw: true,
      });
      const membershipTypeData = await UserMemberships.findAll({
        attributes: [
          [col('Membership.name'), 'type'],
          [fn('COUNT', col('UserMemberships.id')), 'value'],
        ],
        include: [{ model: Memberships, attributes: [] }],
        group: ['Membership.name'],
        raw: true,
      });

      const [popularMembershipsRaw] = await sequelize.query(`
        SELECT 
          m.id, 
          m.name, 
          COUNT(um.id) AS sales
        FROM "Memberships" m
        JOIN "UserMemberships" um ON um."MembershipId" = m.id
        GROUP BY m.id, m.name
        ORDER BY sales DESC
        LIMIT 3
      `);

      const newUsersData = await Users.findAll({
        attributes: [
          [fn('TO_CHAR', col('Users.createdAt'), 'DD.MM'), 'date'],
          [fn('COUNT', '*'), 'users'],
        ],
        group: [literal(`TO_CHAR("Users"."createdAt", 'DD.MM')`)],
        order: [literal(`MIN("Users"."createdAt")`)],
        raw: true,
      });

      const usersWithMultiplePurchases = await UserMemberships.findAll({
        attributes: ['UserId', [fn('COUNT', '*'), 'count']],
        group: ['UserId'],
        having: literal('COUNT(*) > 1'),
        raw: true,
      });
      const repeatPurchaseRate = (usersWithMultiplePurchases.length / clientsCount) * 100;

      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const inactiveClients = await Users.findAll({
        attributes: ['id', 'name', 'surName'],
        include: [
          {
            model: UserMemberships,
            attributes: [],
            where: {
              dateEnd: { [Op.lt]: sixtyDaysAgo },
            },
            required: true,
          },
        ],
        raw: true,
      });

      return res.json({
        clientsCount,
        activeMemberships,
        monthlyIncome: monthlyIncomeResult || 0,
        yearlyIncome: yearlyIncomeResult || 0,
        newClients,
        reviewsCount,
        publishedReviews,
        averageRating: Number(averageRating?.avgRating || 0).toFixed(1),
        incomeData,
        membershipTypeData,
        popularMemberships: popularMembershipsRaw,
        newUsersData,
        repeatPurchaseRate: repeatPurchaseRate.toFixed(1),
        inactiveClients,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Ошибка при получении аналитики' });
    }
  }
}

export default new AnalyticsController();
