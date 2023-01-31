const { Category } = require("../../services/db/db.js");
const { offers } = require("../../services/cron/cron");
//! VAR que indica el estado de las ofertas automatizada o no
let autoStatus = false;

function getAutoStatus() {
  return autoStatus;
}
function setAutoStatus() {
  autoStatus = !autoStatus;
  if (autoStatus) {
    autoStatus = false;
    offers.stop();
  } else {
    autoStatus = true;
    offers.start();
  }
  return autoStatus;
}

async function nextOffer() {
  try {
    const categories = await Category.findAll({ raw: true });
    let foundIndex = categories.indexOf(
      (category) => category.isOnSale === true
    );
    if (foundIndex === -1) return;
    if (foundIndex < categories.length - 1) {
      foundIndex++;
    } else {
      foundIndex = 0;
    }
    setIsOnSale(categories[foundIndex].name);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function setIsOnSale(name) {
  try {
    const categoryFound = await Category.findOne({
      where: { name },
    });
    if (categoryFound) {
      if (categoryFound.isOnSale) {
        categoryFound.isOnSale = false;
      } else {
        const oldCategoryFound = await Category.findOne({
          where: { isOnSale: true },
        });
        if (oldCategoryFound) {
          oldCategoryFound.isOnSale = false;
          categoryFound.isOnSale = true;
        }
        oldCategoryFound.save();
      }
      categoryFound.save();
      return "SUCCESS";
    }
    return "FAIL";
  } catch (error) {
    throw new Error(error.message);
  }
}

async function setDiscount(name, discountAmmount) {
  try {
    Category.update({ discountAmmount }, { where: { name } });
    return "SUCCESS";
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  autoStatus,
  setIsOnSale,
  setDiscount,
  getAutoStatus,
  setAutoStatus,
  nextOffer,
};
