import ApiError from "../exceptions/apiErrors.js";
import {MembershipTypes} from "../models/index.js"

class typesController {
  async getAllForMemberships(req, res, next) {
    try {
      const types = await MembershipTypes.findAll();

      return res.json(types);

    } catch(error) {
      next(error)
    }

  }
}

export default new typesController();
