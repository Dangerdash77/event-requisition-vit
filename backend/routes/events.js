import express from 'express';
import multer from 'multer';
import path from 'path';
import Event from '../models/Event.js'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

console.log("✅ Events route file loaded successfully");

// ES Module way to get __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Define storage and upload ONLY ONCE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // path.join(__dirname, '..', 'uploads') now works with the above definition
    cb(null, path.join(__dirname, '..', 'uploads')); 
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g,'_'));
  }
});

const upload = multer({ storage });

router.post('/', upload.single('extProof'), async (req, res) => {
  try {
    const body = req.body || {};
    // parse numbers
    if (body.noOfDays) body.noOfDays = parseInt(body.noOfDays);
    if (body.expectedParticipants) body.expectedParticipants = parseInt(body.expectedParticipants);

    const ev = new Event({
      proposedBy: body.proposedBy,
      eventTitle: body.eventTitle,
      eventDescription: body.eventDescription,
      associationType: body.associationType,
      associationId: body.associationId,
      eventTypeId: body.eventTypeId,
      eventTypeName: body.eventTypeName,
      eventSubTypeId: body.eventSubTypeId,
      eventCategoryId: body.eventCategoryId,
      eventLevel: body.eventLevel,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      startTime: body.startTime,
      endTime: body.endTime,
      noOfDays: body.noOfDays,
      expectedParticipants: body.expectedParticipants,
      eventMode: body.eventMode,
      onlineVenue: body.onlineVenue,
      offlineVenue: body.offlineVenue,
      collaborationAgency: body.collaborationAgency,
      collaborationInfo: body.collaborationInfo ? JSON.parse(body.collaborationInfo) : undefined,
      budgetType: body.budgetType,
      proofFile: req.file ? ('/uploads/' + req.file.filename) : undefined
    });

    const saved = await ev.save();
    res.json({ success: true, event: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;