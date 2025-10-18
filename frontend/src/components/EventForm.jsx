import React, { useState } from 'react';

const initialCollabInfo = { externalCategoryId: '', instituteName: '' };

export default function EventForm() {
  const [form, setForm] = useState({
    proposedBy: '',
    eventTitle: '',
    eventDescription: '',
    associationType: '',
    associationId: '',
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
    const { name, value } = e.target;
    if (name.startsWith('collaborationInfo.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, collaborationInfo: { ...prev.collaborationInfo, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFile = (e) => {
    setProofFile(e.target.files[0]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const urlBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = `${urlBase}/api/events`;
      const fd = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'collaborationInfo') {
          fd.append('collaborationInfo', JSON.stringify(form.collaborationInfo));
        } else {
          fd.append(key, form[key] || '');
        }
      });
      if (proofFile) fd.append('extProof', proofFile);

      const res = await fetch(url, {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Saved successfully' });
        // reset
        setForm({
          proposedBy: '',
          eventTitle: '',
          eventDescription: '',
          associationType: '',
          associationId: '',
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
        setMessage({ type: 'error', text: data.error || 'Error saving' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={submit} encType="multipart/form-data" id="eventRequisitionForm" autoComplete="off">
      <input type="hidden" name="_csrf" value="4da87767-f8fb-4c74-8be2-e1795edb8ea3" />
      <input type="hidden" name="authorizedID" id="authorizedID" value="22BCE0945" />

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Proposed By <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select className="form-select" name="proposedBy" value={form.proposedBy} onChange={handleChange}>
            <option value="">--</option>
            <option value="1">STUDENT</option>
          </select>
        </div>

        <label className="col-md-2 col-form-label">Event Title <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <input name="eventTitle" value={form.eventTitle} onChange={handleChange} type="text" className="form-control" placeholder="Enter Event Title" maxLength="300" />
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Description <font color="#FF0000">*</font></label>
        <div className="col-md-10">
          <textarea name="eventDescription" value={form.eventDescription} onChange={handleChange} className="form-control" rows="3" placeholder="Event Description (500 Characters)" maxLength="500"></textarea>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Association Type <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="associationType" value={form.associationType} onChange={handleChange} className="form-select">
            <option value="">--</option>
            <option value="CLUB">CLUB</option>
            <option value="CHAPTER">CHAPTER</option>
          </select>
        </div>

        <label className="col-md-2 col-form-label">Association Name <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="associationId" value={form.associationId} onChange={handleChange} className="form-select">
            <option value="">--</option>
            <option value="gla">gla</option>
            <option value="xcvb">vgh</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Type <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="eventTypeId" value={form.eventTypeId} onChange={handleChange} className="form-select">
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
          </select>
        </div>

        <div style={{display: form.eventTypeId === 'OTHER' ? 'block' : 'none'}} className="col-md-6">
          <label className="form-label">Event Type (Others)</label>
          <input name="eventTypeName" value={form.eventTypeName} onChange={handleChange} className="form-control" placeholder="Event Type (Others)" maxLength="190" />
        </div>

        <label className="col-md-2 col-form-label">Event Sub Type <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="eventSubTypeId" value={form.eventSubTypeId} onChange={handleChange} className="form-select">
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
          <select name="eventCategoryId" value={form.eventCategoryId} onChange={handleChange} className="form-select">
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
          <select name="eventLevel" value={form.eventLevel} onChange={handleChange} className="form-select">
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
          <input name="startDate" value={form.startDate} onChange={handleChange} type="date" className="form-control" min="2025-10-20" />
        </div>

        <label className="col-md-2 col-form-label">Event End Date <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <input name="endDate" value={form.endDate} onChange={handleChange} type="date" className="form-control" min="2025-10-20" />
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Start Time <font color="#FF0000">*</font></label>
        <div className="col-md-4"><input name="startTime" value={form.startTime} onChange={handleChange} type="time" className="form-control" /></div>

        <label className="col-md-2 col-form-label">End Time <font color="#FF0000">*</font></label>
        <div className="col-md-4"><input name="endTime" value={form.endTime} onChange={handleChange} type="time" className="form-control" /></div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">No. of Days <font color="#FF0000">*</font></label>
        <div className="col-md-4"><input name="noOfDays" value={form.noOfDays} onChange={handleChange} type="text" className="form-control" maxLength="4" /></div>

        <label className="col-md-2 col-form-label">Expected Participants <font color="#FF0000">*</font></label>
        <div className="col-md-4"><input name="expectedParticipants" value={form.expectedParticipants} onChange={handleChange} type="text" className="form-control" maxLength="5" /></div>
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Event Mode <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="eventMode" value={form.eventMode} onChange={handleChange} className="form-select">
            <option value="">--</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>

        {form.eventMode === 'ONLINE' && (
          <>
            <label className="col-md-2 col-form-label">Online Platform <font color="#FF0000">*</font></label>
            <div className="col-md-4">
              <select name="onlineVenue" value={form.onlineVenue} onChange={handleChange} className="form-select">
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
              <input name="offlineVenue" value={form.offlineVenue} onChange={handleChange} className="form-control" placeholder="Event Venue" maxLength="45" />
            </div>
          </>
        )}
      </div>

      <div className="row mb-3">
        <label className="col-md-2 col-form-label">Collaboration <font color="#FF0000">*</font></label>
        <div className="col-md-4">
          <select name="collaborationAgency" value={form.collaborationAgency} onChange={handleChange} className="form-select">
            <option value="">--</option>
            <option value="NA">Not Applicable</option>
            <option value="INTERNAL">Internal</option>
            <option value="EXTERNAL">External</option>
          </select>
        </div>
      </div>

      {form.collaborationAgency === 'EXTERNAL' && (
        <div className="border p-3 mb-3 bg-light">
          <h6>External Collaboration</h6>
          <div className="row mb-3">
            <label className="col-md-2 col-form-label">External Category <font color="#FF0000">*</font></label>
            <div className="col-md-4">
              <select name="collaborationInfo.externalCategoryId" value={form.collaborationInfo.externalCategoryId} onChange={handleChange} className="form-select">
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
            <label className="col-md-2 col-form-label">Proof Upload</label>
            <div className="col-md-4">
              <input name="extProof" type="file" onChange={handleFile} accept="application/pdf" className="form-control" />
            </div>
          </div>
        </div>
      )}

      {form.collaborationAgency === 'INTERNAL' && (
        <div className="border p-3 mb-3 bg-light">
          <h6>Internal Collaboration</h6>
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
          <select name="budgetType" value={form.budgetType} onChange={handleChange} className="form-select">
            <option value="">--</option>
            <option value="BUDGET">Budget</option>
            <option value="NONBUDGET">Non Budget</option>
          </select>
        </div>
      </div>

      {message && (
        <div className={"alert " + (message.type==='success' ? 'alert-success' : 'alert-danger')}>
          {message.text}
        </div>
      )}

      <div className="text-center mb-3">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'SAVE & NEXT'}
        </button>
      </div>
    </form>
  );
}
