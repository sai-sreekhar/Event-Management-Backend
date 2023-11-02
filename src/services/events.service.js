const Events = require("./../models/events.models");
const AppError = require("./../utils/appError.utils");
const { errorCodes } = require("./../utils/constants.utils");

async function getAllEventsBriefInfo() {
  const events = await Events.find().select("name description image");
  return events;
}

async function getEventById(id) {
  const event = await Events.findById(id);
  if (!event) {
    throw new AppError("Event not found", 404, errorCodes.EVENT_ID_NOT_FOUND);
  }

  return event;
}

module.exports = {
  getAllEventsBriefInfo,
  getEventById,
};
