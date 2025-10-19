import React, { useState } from 'react';

const initialCollabInfo = { externalCategoryId: '', instituteName: '' };

export default function EventForm() {
  // --- Fix: Extract user data and association name here ---
  const user = JSON.parse(localStorage.getItem("user"));
  const associationName = user?.association || "N/A"; 
  // --- End Fix Block ---
  
  const [form, setForm] = useState({
    proposedBy: user?.name || '', // Pre-fill with user name if available
    eventTitle: '',
    eventDescription: '',
    associationType: '',
    associationId: associationName, // Default to user's association
    eventTypeId: '',
    eventTypeName: '',
    eventSubTypeId: '',
    eventCategoryId: '',
    eventLevel: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    noOfDays: '',
    expectedParticipants: '',
    eventMode: '',
    onlineVenue: '',
    offlineVenue: '',
    collaborationAgency: '',
    collaborationInfo: initialCollabInfo,
    budgetType: ''
  });
  const [proofFile, setProofFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;

    // Handle number inputs
    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }
    
    if (name.startsWith('collaborationInfo.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, collaborationInfo: { ...prev.collaborationInfo, [key]: finalValue } }));
    } else {
      setForm(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleFile = (e) => {
    setProofFile(e.target.files[0]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    const token = localStorage.getItem('token');

    try {
      // Correctly set the API base URL to prevent errors
      const urlBase = 'http://localhost:5000'; 
      const url = `${urlBase}/api/events`;
      const fd = new FormData();
      
      // Ensure associationId is always the user's association name from state/localStorage
      const finalForm = { ...form, associationId: associationName }; 

      Object.keys(finalForm).forEach(key => {
        if (key === 'collaborationInfo') {
          // Send collaborationInfo as a JSON string
          fd.append('collaborationInfo', JSON.stringify(finalForm.collaborationInfo));
        } else {
          // Convert numbers back to string for FormData
          const value = (typeof finalForm[key] === 'number' && finalForm[key] !== '') ? String(finalForm[key]) : finalForm[key] || '';
          fd.append(key, value);
        }
      });
      if (proofFile) fd.append('extProof', proofFile);

      const headers = {};
      // Attach JWT token for authentication
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // NOTE: For FormData uploads, the 'Content-Type': 'multipart/form-data' header 
      // is usually set automatically by the browser when omitting the Content-Type header
      // and providing a FormData object as the body, which is the standard approach.

      const res = await fetch(url, {
        method: 'POST',
        headers: headers, // Authorization header is included here
        body: fd
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) { 
        setMessage({ type: 'success', text: 'Event submitted successfully! The request is now awaiting manager approval.' });
        // Reset form to initial state, keeping user's details
        setForm({
          proposedBy: user?.name || '',
          eventTitle: '',
          eventDescription: '',
          associationType: '',
          associationId: associationName,
          eventTypeId: '',
          eventTypeName: '',
          eventSubTypeId: '',
          eventCategoryId: '',
          eventLevel: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          noOfDays: '',
          expectedParticipants: '',
          eventMode: '',
          onlineVenue: '',
          offlineVenue: '',
          collaborationAgency: '',
          collaborationInfo: initialCollabInfo,
          budgetType: ''
        });
        setProofFile(null);
      } else {
        setMessage({ type: 'error', text: data.message || data.error || 'Error saving event request. Please check your inputs.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error: Could not connect to the server. Is the backend running?' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={submit} encType="multipart/form-data" id="eventRequisitionForm" autoComplete="off">
      <h3 className="card-title mb-4">New Event Request</h3>
      
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} text-center`} role="alert">
          {message.text}
        </div>
      )}

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Proposed By <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select className="form-select" name="proposedBy" value={form.proposedBy} onChange={handleChange} required>
            <option value="">--</option>
            <option value="STUDENT">STUDENT</option>
          </select>
        </div>

        <label className="col-md-2 col-form-label">Event Title <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <input name="eventTitle" value={form.eventTitle} onChange={handleChange} type="text" className="form-control" placeholder="Enter Event Title" maxLength="300" required />
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Description <font color="#FF0000">*</font></label>
        <div className="col-md-10">
          <textarea name="eventDescription" value={form.eventDescription} onChange={handleChange} className="form-control" rows="3" placeholder="Event Description (Max 500 Characters)" maxLength="500" required></textarea>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Association Type <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="associationType" value={form.associationType} onChange={handleChange} className="form-select" required>
            <option value="">--</option>
            <option value="CLUB">CLUB</option>
            <option value="CHAPTER">CHAPTER</option>
          </select>
        </div>

        <label className="col-md-2 col-form-label">Association Name <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <input 
            name="associationId" 
            value={associationName} 
            type="text" 
            className="form-control" 
            readOnly 
            required
            aria-readonly="true"
            title="Automatically filled from your login profile"
          />
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Type <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="eventTypeId" value={form.eventTypeId} onChange={handleChange} className="form-select" required>
            <option value="">--</option>
            <option value="1">ART</option>
            <option value="12">CAREER GUIDANCE</option>
            <option value="2">COMMUNITY DEVELOPMENT</option>
            <option value="7">ENERGY CONSERVATION</option>
            <option value="6">ENTREPRENEURSHIP/STARTUP</option>
            <option value="4">ENVIRONMENTAL</option>
            <option value="8">INNOVATION</option>
            <option value="10">INTELLECTUAL PROPERTY RIGHTS</option>
            <option value="3">NATURE STUDIES</option>
            <option value="11">SOCIAL AWARENESS</option>
            <option value="OTHER">OTHER (Specify Below)</option>
          </select>
          {form.eventTypeId === 'OTHER' && (
              <input name="eventTypeName" value={form.eventTypeName} onChange={handleChange} className="form-control mt-2" placeholder="Specify Event Type (Others)" maxLength="190" required />
          )}
        </div>
        
        <label className="col-md-2 col-form-label">Event Sub Type <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="eventSubTypeId" value={form.eventSubTypeId} onChange={handleChange} className="form-select" required>
            <option value="">--</option>
            <option value="1">AWARENESS</option>
            <option value="3">BOOT CAMP</option>
            <option value="2">B-PLAN COMPETITIONS</option>
            <option value="4">CONFERENCE</option>
            <option value="5">DEMO DAY</option>
            <option value="6">EXHIBITION</option>
            <option value="7">EXPOSURE VISIT</option>
            <option value="8">HACKATHON</option>
            <option value="9">IDEATION</option>
            <option value="10">INNOVATION CONTEST</option>
            <option value="11">MENTORING SESSION</option>
            <option value="12">MOTIVATIONAL SPEAK</option>
            <option value="13">ORIENTATION SESSION</option>
            <option value="22">REGIONAL CELEBRATION</option>
            <option value="14">ROAD SHOW</option>
            <option value="15">SEMINAR</option>
            <option value="16">SKILL DEVELOPMENT</option>
            <option value="17">STARTUP CONCLAVE</option>
            <option value="18">STARTUP YATRA</option>
            <option value="19">TRAINING</option>
            <option value="20">WORKSHOP</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Category <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="eventCategoryId" value={form.eventCategoryId} onChange={handleChange} className="form-select" required>
            <option value="">--</option>
            <option value="1">ART & CULTURALS</option>
            <option value="4">HEALTH & WELLNESS</option>
            <option value="3">LITERATURE</option>
            <option value="5">SOCIAL OUTREACH</option>
            <option value="2">TECHNICAL</option>
          </select>
        </div>

        <label className="col-md-2 col-form-label">Event Levels <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="eventLevel" value={form.eventLevel} onChange={handleChange} className="form-select" required>
            <option value="">--</option>
            <option value="STATE">STATE</option>
            <option value="NATIONAL">NATIONAL</option>
            <option value="INTERNATIONAL">INTERNATIONAL</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Start Date <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <input name="startDate" value={form.startDate} onChange={handleChange} type="date" className="form-control" min={new Date().toISOString().split('T')[0]} required />
        </div>

        <label className="col-md-2 col-form-label">Event End Date <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <input name="endDate" value={form.endDate} onChange={handleChange} type="date" className="form-control" min={form.startDate || new Date().toISOString().split('T')[0]} required />
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Start Time <font color="#FF0000">*</font></label>
        <div className="col-md-4"><input name="startTime" value={form.startTime} onChange={handleChange} type="time" className="form-control" required /></div>

        <label className="col-md-2 col-form-label">End Time <font color="#FF0000">*</font></label>
        <div className="col-md-4"><input name="endTime" value={form.endTime} onChange={handleChange} type="time" className="form-control" required /></div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">No. of Days <font color="#FF0000">*</font></label>
        <div className="col-md-4"><input name="noOfDays" value={form.noOfDays} onChange={handleChange} type="number" min="1" className="form-control" maxLength="4" required /></div>

        <label className="col-md-2 col-form-label">Expected Participants <font color="#FF0000">*</font></label>
        <div className="col-md-4"><input name="expectedParticipants" value={form.expectedParticipants} onChange={handleChange} type="number" min="1" className="form-control" maxLength="5" required /></div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Mode <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="eventMode" value={form.eventMode} onChange={handleChange} className="form-select" required>
            <option value="">--</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>

        {form.eventMode === 'ONLINE' && (
          <>
            <label className="col-md-2 col-form-label">Online Platform <font color="#FF0000">*</font></label>
            <div className="col-md-4">
              <select name="onlineVenue" value={form.onlineVenue} onChange={handleChange} className="form-select" required>
                <option value="">--</option>
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="MicrosoftTeams">Microsoft Teams</option>
                <option value="Youtube Live">Youtube Live</option>
                <option value="Discord">Discord</option>
              </select>
            </div>
          </>
        )}

        {form.eventMode === 'OFFLINE' && (
          <>
            <label className="col-md-2 col-form-label">Offline Venue <font color="#FF0000">*</font></label>
            <div className="col-md-4">
              <input name="offlineVenue" value={form.offlineVenue} onChange={handleChange} className="form-control" placeholder="Event Venue" maxLength="45" required />
            </div>
          </>
        )}
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Collaboration <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="collaborationAgency" value={form.collaborationAgency} onChange={handleChange} className="form-select" required>
            <option value="">--</option>
            <option value="NA">Not Applicable</option>
            <option value="INTERNAL">Internal</option>
            <option value="EXTERNAL">External</option>
          </select>
        </div>
      </div>

      {form.collaborationAgency === 'EXTERNAL' && (
        <div className="border p-3 mb-3 bg-light rounded shadow-sm">
          <h6 className="text-primary mb-3">External Collaboration Details</h6>
          <div className="row mb-3">
            <label className="col-md-2 col-form-label">External Category <font color="#FF0000">*</font></label>
            <div className="col-md-4">
              <select name="collaborationInfo.externalCategoryId" value={form.collaborationInfo.externalCategoryId} onChange={handleChange} className="form-select" required>
                <option value="">--</option>
                <option value="4">Corporate/industry Association</option>
                <option value="3">Educational Institution</option>
                <option value="1">Govt. Agency (Central)</option>
                <option value="2">Govt. Agency (State)</option>
                <option value="6">International Agency</option>
                <option value="5">Non Govt. Agency</option>
              </select>
            </div>

            <label className="col-md-2 col-form-label">Institution Name</label>
            <div className="col-md-4">
              <input name="collaborationInfo.instituteName" value={form.collaborationInfo.instituteName} onChange={handleChange} className="form-control" placeholder="Institution Name" maxLength="195" />
            </div>
          </div>

          <div className="row mb-3">
            <label className="col-md-2 col-form-label">Proof Upload (PDF)</label>
            <div className="col-md-4">
              <input name="extProof" type="file" onChange={handleFile} accept="application/pdf" className="form-control" />
            </div>
          </div>
        </div>
      )}

      {form.collaborationAgency === 'INTERNAL' && (
        <div className="border p-3 mb-3 bg-light rounded shadow-sm">
          <h6 className="text-primary mb-3">Internal Collaboration Details</h6>
          <div className="row mb-3">
            <label className="col-md-2 col-form-label">Internal Association</label>
            <div className="col-md-4">
              <select name="intCollaboration" className="form-select" onChange={handleChange}>
                <option value="">--</option>
                <option value="CLUB">CLUB</option>
                <option value="CHAPTER">CHAPTER</option>
                <option value="SCHOOL">SCHOOL</option>
                <option value="SWF EVENT">SWF EVENT</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Budget <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="budgetType" value={form.budgetType} onChange={handleChange} className="form-select" required>
            <option value="">--</option>
            <option value="BUDGET">Budget</option>
            <option value="NONBUDGET">Non Budget</option>
          </select>
        </div>
      </div>

      <div className="text-center mb-3">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'SAVE & NEXT'}
        </button>
      </div>
    </form>
  );
}
