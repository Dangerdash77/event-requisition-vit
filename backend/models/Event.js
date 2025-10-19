import mongoose from 'mongoose';
// const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  proposedBy: String,
  eventTitle: String,
  eventDescription: String,
  associationType: String,
  associationId: String,
  eventTypeId: String,
  eventTypeName: String,
  eventSubTypeId: String,
  eventCategoryId: String,
  eventLevel: String,
  startDate: Date,
  endDate: Date,
  startTime: String,
  endTime: String,
  noOfDays: Number,
  expectedParticipants: Number,
  eventMode: String,
  onlineVenue: String,
  offlineVenue: String,
  collaborationAgency: String,
  collaborationInfo: Object,
  budgetType: String,
  proofFile: String,
  createdAt: { type: Date, default: Date.now }
});

// module.exports = mongoose.model('Event', EventSchema);
export default mongoose.model('Event', EventSchema);