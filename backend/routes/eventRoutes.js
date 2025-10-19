// ------------------------
// ✅ routes/eventRoutes.js (Fixed & Final)
// ------------------------
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Event from "../models/Event.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load env
dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Utility for timestamps in logs
const logTime = () => new Date().toISOString();

// ------------------------
// ✅ Multer Setup (File Uploads)
// ------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`[${logTime()}] [MULTER] Saving file to uploads folder...`);
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const cleanName = file.originalname.replace(/\s+/g, "_");
    const finalName = `${unique}-${cleanName}`;
    console.log(`[${logTime()}] [MULTER] File received: ${file.originalname} → ${finalName}`);
    cb(null, finalName);
  },
});
const upload = multer({ storage });

// ------------------------
// ✅ Event Submission Route
// ------------------------
router.post("/", upload.single("extProof"), async (req, res) => {
  console.log("\n===========================");
  console.log(`[${logTime()}] [EVENT] POST /api/events received`);
  console.log(`[${logTime()}] [BODY] Keys:`, Object.keys(req.body));
  console.log(`[${logTime()}] [FILE] Attached:`, !!req.file);

  try {
    const body = req.body || {};

    // Parse numeric fields
    if (body.noOfDays) body.noOfDays = parseInt(body.noOfDays);
    if (body.expectedParticipants) body.expectedParticipants = parseInt(body.expectedParticipants);

    // Parse collaboration info safely
    let collaborationInfoParsed;
    try {
      if (body.collaborationInfo) {
        collaborationInfoParsed = JSON.parse(body.collaborationInfo);
        console.log(`[${logTime()}] [PARSE] collaborationInfo parsed successfully.`);
      }
    } catch (e) {
      console.error(`[${logTime()}] [PARSE ERROR] Failed to parse collaborationInfo:`, e.message);
    }

    // ✅ Save Event to MongoDB
    console.log(`[${logTime()}] [DB] Saving new event...`);
    const newEvent = new Event({
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
      collaborationInfo: collaborationInfoParsed,
      budgetType: body.budgetType,
      proofFile: req.file ? "/uploads/" + req.file.filename : undefined,
    });

    const savedEvent = await newEvent.save();
    console.log(`[${logTime()}] [DB] Event saved successfully: ${savedEvent._id}`);

    // ✅ Find manager for association
    const manager = await User.findOne({ association: body.associationId, role: "manager" });
    if (manager) {
      console.log(`[${logTime()}] [DB] Manager found: ${manager.name} (${manager.email})`);

      // ✅ Send Email Notification
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: manager.email,
        subject: `ACTION REQUIRED: New Event Request - ${body.eventTitle}`,
        html: `
  <div style="font-family: Arial; padding: 20px; background-color:#f8f9fa; border-radius:8px;">
    <h2 style="color:#0d6efd;">New Event Submission for Approval</h2>
    <p>
      <strong>${body.proposedBy}</strong> has submitted a new event under 
      <strong>${body.associationId}</strong>.
    </p>

    <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Event Title</b></td><td style="padding:8px; border:1px solid #ddd;">${body.eventTitle}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Description</b></td><td style="padding:8px; border:1px solid #ddd;">${body.eventDescription}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Association Type</b></td><td style="padding:8px; border:1px solid #ddd;">${body.associationType}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Event Type</b></td><td style="padding:8px; border:1px solid #ddd;">${body.eventTypeName}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Sub Type ID</b></td><td style="padding:8px; border:1px solid #ddd;">${body.eventSubTypeId}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Category</b></td><td style="padding:8px; border:1px solid #ddd;">${body.eventCategoryId}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Level</b></td><td style="padding:8px; border:1px solid #ddd;">${body.eventLevel}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Start Date</b></td><td style="padding:8px; border:1px solid #ddd;">${body.startDate}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>End Date</b></td><td style="padding:8px; border:1px solid #ddd;">${body.endDate}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Start Time</b></td><td style="padding:8px; border:1px solid #ddd;">${body.startTime}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>End Time</b></td><td style="padding:8px; border:1px solid #ddd;">${body.endTime}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>No. of Days</b></td><td style="padding:8px; border:1px solid #ddd;">${body.noOfDays}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Expected Participants</b></td><td style="padding:8px; border:1px solid #ddd;">${body.expectedParticipants}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Mode</b></td><td style="padding:8px; border:1px solid #ddd;">${body.eventMode}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Online Venue</b></td><td style="padding:8px; border:1px solid #ddd;">${body.onlineVenue}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Offline Venue</b></td><td style="padding:8px; border:1px solid #ddd;">${body.offlineVenue}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Collaboration Agency</b></td><td style="padding:8px; border:1px solid #ddd;">${body.collaborationAgency}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Collaboration Info</b></td><td style="padding:8px; border:1px solid #ddd;">${JSON.stringify(body.collaborationInfo)}</td></tr>
      <tr><td style="padding:8px; border:1px solid #ddd;"><b>Budget Type</b></td><td style="padding:8px; border:1px solid #ddd;">${body.budgetType}</td></tr>
    </table>

    <p style="margin-top: 20px; color:#555;">Please review and approve the event in the portal.</p>
    <hr/>
    <p style="font-size:12px; color:#777;">This is an automated email from Event Requisition Portal.</p>
  </div>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[${logTime()}] [MAIL] Sent successfully to ${manager.email} (ID: ${info.messageId})`);
      } catch (mailErr) {
        console.error(`[${logTime()}] [MAIL ERROR]`, mailErr.message);
      }
    } else {
      console.warn(`[${logTime()}] [WARN] No manager found for association ${body.associationId}. Skipping email.`);
    }

    // ✅ Response
    res.json({ success: true, event: savedEvent });
    console.log(`[${logTime()}] [RESPONSE] Success response sent.`);
  } catch (err) {
    console.error(`[${logTime()}] [ERROR]`, err.stack || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
