const cron = require("node-cron");
const orderController = require("../../apiServices/order/controller");
const statisticController = require("../../apiServices/statistic/controller");
const offerController = require("../../apiServices/offer/controller");
//$ cleaner de "procesed" orders -> cada hora
cron.schedule("1 * * * *", async () => {
  //? Cada 1 hora checkea el "status" de cada order si esta failed y paso 1 hora
  //? de su creacion la pasa a status "cancelled"
  try {
    console.log("CLEANING");
    await orderController.checkOrderStatus();
  } catch (error) {
    throw new Error(error.message);
  }
});

//$ generar statistics -> cada dia
cron.schedule("0 0 * * *", async () => {
  try {
    await statisticController.generateAllStatistics();
    console.log("STATISTICS GENERATED");
  } catch (error) {
    throw new Error(error.message);
  }
});

//$ offers automation -> cada dia
//const offers = cron.schedule("0 0 * * *", async () => {
const offers = cron.schedule("* * * * *", async () => {
  try {
    console.log("AUTOMATED OFFER CHANGED");
    await offerController.nextOffer();
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = { offers };
/*

const url_taskMap = {};
const task = cron.schedule('*****',()=>{
    Foo the bar..
});
url_taskMap[url] = task;
for some condition in some code
let my_job = url_taskMap[url];
my_job.stop();
*/
