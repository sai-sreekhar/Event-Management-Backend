const Events = require("./../models/events.models");
const Registrations = require("./../models/registrations.models");
const AppError = require("./../utils/appError.utils");
const { errorCodes } = require("./../utils/constants.utils");

async function getMyHostedEvents(hostId) {
  const myHostedEvents = await Events.find({ hostId: hostId });
  return myHostedEvents;
}

async function hostNewEvent(
  name,
  description,
  date,
  time,
  location,
  image,
  limit,
  price,
  hostId
) {
  const newEvent = await Events.create({
    name,
    description,
    date,
    time,
    location,
    image,
    limit,
    price,
    hostId,
  });

  return newEvent;
}

async function updateMyEventDetails(
  eventId,
  name,
  description,
  date,
  time,
  location,
  image,
  limit,
  price,
  hostId
) {
  //check if event exists
  const event = await Events.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", 404, errorCodes.EVENT_ID_NOT_FOUND);
  }

  //check if event is hosted by user
  if (event.hostId != hostId) {
    throw new AppError(
      "You are not authorized to update this event",
      403,
      errorCodes.USER_NOT_AUTHORIZED
    );
  }

  //update event
  const updatedEvent = await Events.findByIdAndUpdate(
    eventId,
    {
      name,
      description,
      date,
      time,
      location,
      image,
      limit,
      price,
    },
    { new: true }
  );

  return updatedEvent;
}

async function deleteMyHostedEvent(eventId, hostId) {
  //check if event exists
  const event = await Events.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", 404, errorCodes.EVENT_ID_NOT_FOUND);
  }

  //check if event is hosted by user
  if (event.hostId != hostId) {
    throw new AppError(
      "You are not authorized to delete this event",
      403,
      errorCodes.USER_NOT_AUTHORIZED
    );
  }

  console.log("deleting event");
  //delete event
  await Events.findByIdAndDelete(eventId);
  return event._id;
}

async function getMyHostedEventRegistrations(eventId, userId) {
  //check if event exists
  const event = await Events.findById(eventId);
  if (!event) {
    throw new AppError("Event not found", 404, errorCodes.EVENT_ID_NOT_FOUND);
  }

  //check if event is hosted by user
  if (event.hostId != userId) {
    throw new AppError(
      "You are not authorized to view this event",
      403,
      errorCodes.USER_NOT_AUTHORIZED
    );
  }

  //get event registrations
  const eventRegistrations = await Registrations.find({ eventId: eventId });
  return eventRegistrations;
}

module.exports = {
  getMyHostedEvents,
  hostNewEvent,
  updateMyEventDetails,
  deleteMyHostedEvent,
  getMyHostedEventRegistrations,
};
