const Product = require("../../Models/Product");
module.exports = async (req, res, next) => {
  try {
    let { limit, page } = req.query;
    page = page || 1;
    const skip = page ? (page - 1) * limit : 0;
    let option = {};
    // if (cat && cat !== "all") {
    //   option.catSlug = cat;
    // }
    // if (status && status == "available") {
    //   option.available = true;
    // }
    // if (status && status == "not-available") {
    //   option.available = false;
    // }

    const count = await Product.find(option).countDocuments();
    // const pages = count>0?Math.ceil(count / limit)?Math.ceil(count / limit): 1;
    let pages = 0;
    if (count > 0) {
      if (limit) {
        pages = Math.ceil(count / limit);
      } else {
        pages = 1;
      }
    }

    const result = {};
    limit = limit - 0;

    if (page * 1 < pages) {
      result.next = { limit, page: page * 1 + 1 };
    }
    if (page * 1 <= pages && page - 1 != 0) {
      result.previous = { limit, page: page - 1 };
    }

    const products = await Product.find(option)
      .limit(limit * 1)
      .skip(skip);
    return res.status(200).json({ ...result, count, pages, products });
  } catch (error) {
    next(error);
  }
};
