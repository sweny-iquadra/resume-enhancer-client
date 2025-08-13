import React, { useState } from 'react';
import Header from './Header';
import SuccessToast from './modals/SuccessToast';
import ErrorToast from './modals/ErrorToast';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';

const Profile = ({ setCurrentPage, showResumeChat, setShowResumeChat, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Active Interview');

  // Professional Summary
  const [professionalSummary, setProfessionalSummary] = useState('');
  const [isEditingProfessionalSummary, setIsEditingProfessionalSummary] = useState(false);
  const [tempProfessionalSummary, setTempProfessionalSummary] = useState('');

  // Skills
  const [skills, setSkills] = useState(['Angular', '3D-Printing']);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillError, setSkillError] = useState(false);
  const [tempSkills, setTempSkills] = useState([]);

  // Education
  const [education, setEducation] = useState([]);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [educationForm, setEducationForm] = useState({
    qualification: '',
    academy: '',
    field: '',
    score: '',
    scoreType: 'cgpa',
    startDate: '',
    endDate: ''
  });
  const [educationErrors, setEducationErrors] = useState({});
  const [editingEducationId, setEditingEducationId] = useState(null);

  // Certificates
  const [certificates, setCertificates] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateForm, setCertificateForm] = useState({
    name: '',
    organization: '',
    credentialId: '',
    credentialUrl: '',
    doesntExpire: false,
    startDate: '',
    endDate: ''
  });
  const [certificateErrors, setCertificateErrors] = useState({});
  const [editingCertificateId, setEditingCertificateId] = useState(null);

  // Toasts & Delete
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEducationId, setDeleteEducationId] = useState(null);
  const [deleteCertificateId, setDeleteCertificateId] = useState(null);

  // Available skills for dropdown (unchanged)
  const availableSkills = [
    'React', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'Node.js',
    'Python', 'Java', 'C++', 'HTML/CSS', 'MongoDB', 'PostgreSQL',
    'AWS', 'Docker', 'Kubernetes', '3D-Printing', 'Machine Learning',
    'Git', 'REST APIs', 'GraphQL'
  ];

  const tabs = ['Active Interview', 'Education', 'Certificates'];

  const profileData = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'john-smith-developer'
  };

  /* ---------- Skills logic (unchanged behavior) ---------- */
  const handleAddSkillClick = () => {
    setIsAddingSkill(true);
    setIsEditingSkills(false);
    setSelectedSkill('');
    setSkillError(false);
  };

  const handleCancelSkillAdd = () => {
    setIsAddingSkill(false);
    setSelectedSkill('');
    setSkillError(false);
  };

  const handleSaveSkill = () => {
    if (!selectedSkill) {
      setSkillError(true);
      return;
    }
    setSkills((prev) => [...prev, selectedSkill]);
    setIsAddingSkill(false);
    setSelectedSkill('');
    setSkillError(false);
    setSuccessTitle('Saved');
    setSuccessMessage('Skill added successfully.');
    setShowSuccessToast(true);
  };

  const handleEditSkillsClick = () => {
    setTempSkills(skills);
    setIsEditingSkills(true);
    setIsAddingSkill(false);
  };

  const handleRemoveSkillFromTemp = (index) => {
    setTempSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancelSkillsEdit = () => {
    setIsEditingSkills(false);
    setTempSkills([]);
  };

  const handleSaveSkillsEdit = () => {
    setSkills(tempSkills);
    setIsEditingSkills(false);
    setSuccessTitle('Updated');
    setSuccessMessage('Skills updated successfully.');
    setShowSuccessToast(true);
  };

  /* ---------- Education logic (unchanged behavior) ---------- */
  const handleAddEducation = () => {
    setEditingEducationId(null);
    setEducationForm({
      qualification: '',
      academy: '',
      field: '',
      score: '',
      scoreType: 'cgpa',
      startDate: '',
      endDate: ''
    });
    setEducationErrors({});
    setShowEducationModal(true);
  };

  const handleCloseEducationModal = () => {
    setShowEducationModal(false);
    setEducationErrors({});
  };

  const handleEducationInputChange = (field, value) => {
    setEducationForm((prev) => ({ ...prev, [field]: value }));
    setEducationErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateEducation = () => {
    const errs = {};
    if (!educationForm.qualification) errs.qualification = 'Required';
    if (!educationForm.academy) errs.academy = 'Required';
    if (!educationForm.field) errs.field = 'Required';
    if (!educationForm.score) errs.score = 'Required';
    if (!educationForm.startDate) errs.startDate = 'Required';
    if (!educationForm.endDate) errs.endDate = 'Required';
    return errs;
  };

  const handleEducationSubmit = async () => {
    try {
      const errs = validateEducation();
      if (Object.keys(errs).length) {
        setEducationErrors(errs);
        return;
      }

      if (editingEducationId) {
        setEducation((prev) =>
          prev.map((e) => (e.id === editingEducationId ? { ...e, ...educationForm } : e))
        );
        setSuccessTitle('Updated');
        setSuccessMessage('Education updated successfully.');
        setShowSuccessToast(true);
      } else {
        const newItem = {
          id: Date.now(),
          ...educationForm
        };
        setEducation((prev) => [...prev, newItem]);
        setSuccessTitle('Saved');
        setSuccessMessage('Your education details have been saved successfully.');
        setShowSuccessToast(true);
      }
      handleCloseEducationModal();
    } catch (error) {
      setErrorMessage('Failed to save education details. Please try again.');
      setShowErrorToast(true);
    }
  };

  const handleEditEducation = (edu) => {
    setEditingEducationId(edu.id);
    setEducationForm({
      qualification: edu.qualification || '',
      academy: edu.academy || '',
      field: edu.field || '',
      score: edu.score || '',
      scoreType: edu.scoreType || 'cgpa',
      startDate: edu.startDate || '',
      endDate: edu.endDate || ''
    });
    setEducationErrors({});
    setShowEducationModal(true);
  };

  const handleDeleteEducation = (id) => {
    setDeleteEducationId(id);
    setDeleteCertificateId(null);
    setShowDeleteModal(true);
  };

  const confirmDeleteEducation = () => {
    setEducation((prev) => prev.filter((e) => e.id !== deleteEducationId));
    setShowDeleteModal(false);
    setDeleteEducationId(null);
  };

  const cancelDeleteEducation = () => {
    setShowDeleteModal(false);
    setDeleteEducationId(null);
  };

  /* ---------- Certificates logic (unchanged behavior) ---------- */
  const openCertificateModal = () => {
    setEditingCertificateId(null);
    setCertificateForm({
      name: '',
      organization: '',
      credentialId: '',
      credentialUrl: '',
      doesntExpire: false,
      startDate: '',
      endDate: ''
    });
    setCertificateErrors({});
    setShowCertificateModal(true);
  };

  const handleCertificateInputChange = (field, value) => {
    setCertificateForm((prev) => ({ ...prev, [field]: value }));
    setCertificateErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const isValidUrl = (url) => {
    try {
      const u = new URL(url);
      return !!u.protocol && !!u.host;
    } catch {
      return false;
    }
  };

  const validateCertificate = () => {
    const errs = {};
    if (!certificateForm.name) errs.name = 'Required';
    if (!certificateForm.organization) errs.organization = 'Required';
    if (!certificateForm.credentialId) errs.credentialId = 'Required';
    if (!certificateForm.credentialUrl || !isValidUrl(certificateForm.credentialUrl)) {
      errs.credentialUrl = 'Valid URL required';
    }
    if (!certificateForm.startDate) errs.startDate = 'Required';
    if (!certificateForm.doesntExpire && !certificateForm.endDate) {
      errs.endDate = 'Required';
    }
    return errs;
  };

  const handleAddCertificate = () => {
    openCertificateModal();
  };

  const handleEditCertificate = (cert) => {
    setEditingCertificateId(cert.id);
    setCertificateForm({
      name: cert.name || '',
      organization: cert.organization || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      doesntExpire: !!cert.doesntExpire,
      startDate: cert.startDate || '',
      endDate: cert.endDate || ''
    });
    setCertificateErrors({});
    setShowCertificateModal(true);
  };

  const handleDeleteCertificate = (id) => {
    setDeleteCertificateId(id);
    setDeleteEducationId(null);
    setShowDeleteModal(true);
  };

  const confirmDeleteCertificate = () => {
    setCertificates((prev) => prev.filter((c) => c.id !== deleteCertificateId));
    setShowDeleteModal(false);
    setDeleteCertificateId(null);
  };

  const cancelDeleteCertificate = () => {
    setShowDeleteModal(false);
    setDeleteCertificateId(null);
  };

  const handleCertificateSubmit = () => {
    const errs = validateCertificate();
    if (Object.keys(errs).length) {
      setCertificateErrors(errs);
      return;
    }

    if (editingCertificateId) {
      setCertificates((prev) =>
        prev.map((c) => (c.id === editingCertificateId ? { ...c, ...certificateForm } : c))
      );
      setSuccessTitle('Updated');
      setSuccessMessage('Certificate updated successfully.');
      setShowSuccessToast(true);
    } else {
      const newItem = { id: Date.now(), ...certificateForm };
      setCertificates((prev) => [...prev, newItem]);
      setSuccessTitle('Saved');
      setSuccessMessage('Your certificate has been saved successfully.');
      setShowSuccessToast(true);
    }
    setShowCertificateModal(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Header */}
      <Header
        showResumeChat={showResumeChat}
        setShowResumeChat={setShowResumeChat}
        currentPage="profile"
        setCurrentPage={setCurrentPage}
        onLogout={onLogout}
      />

      {/* Title bar — brand gradient */}
      <div className="px-6 py-4 bg-gradient-to-br from-primary to-accent">
        <h1 className="font-dmsans text-white text-2xl font-semibold">My Profile</h1>
      </div>

      {/* Main */}
      <div className="px-6 pb-10">
        <div className="card" style={{ minHeight: '600px' }}>
          <div className="flex">
            {/* Left Sidebar */}
            <div className="w-80 p-6 border-r border-neutral-800">
              {/* Profile info */}
              <div className="mb-8">
                <h2 className="font-dmsans text-lg font-semibold text-neutral-100 mb-4">
                  {profileData.name}
                </h2>

                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mr-4">
                    <span className="text-xl">👤</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-neutral-300">
                    <span className="w-4 h-4 mr-2">✉️</span>
                    <span className="truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center text-neutral-300">
                    <span className="w-4 h-4 mr-2">📞</span>
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center text-primary">
                    <span className="w-4 h-4 mr-2">🔗</span>
                    <span className="truncate hover:underline">{profileData.linkedin}</span>
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-8">
                <h3 className="label text-neutral-200 mb-3">Professional Summary</h3>

                {!isEditingProfessionalSummary ? (
                  <div className="relative rounded-xl border border-neutral-800 bg-neutral-900 p-4 min-h-[120px]">
                    <button
                      onClick={() => {
                        setIsEditingProfessionalSummary(true);
                        setTempProfessionalSummary(professionalSummary);
                      }}
                      className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100 transition-colors p-2 rounded-lg hover:bg-neutral-800"
                      aria-label="Edit professional summary"
                    >
                      ✏️
                    </button>
                    <div className="pr-10">
                      {professionalSummary ? (
                        <p className="text-sm leading-relaxed text-neutral-200">
                          {professionalSummary}
                        </p>
                      ) : (
                        <p className="text-sm italic text-neutral-400">
                          Click the edit icon to add your professional summary…
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                    <textarea
                      value={tempProfessionalSummary}
                      onChange={(e) => setTempProfessionalSummary(e.target.value)}
                      placeholder="Add your professional summary…"
                      className="textarea h-28 resize-none"
                    />
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-neutral-800">
                      <button
                        onClick={() => {
                          setProfessionalSummary(tempProfessionalSummary);
                          setIsEditingProfessionalSummary(false);
                        }}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setTempProfessionalSummary(professionalSummary);
                          setIsEditingProfessionalSummary(false);
                        }}
                        className="btn btn-ghost"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Skill Set */}
              <div>
                <div className="relative mb-3">
                  <h3 className="label text-neutral-200 pb-2 border-b border-neutral-800">Skill Set</h3>
                  <div className="absolute top-0 right-0 flex items-center gap-2">
                    <button onClick={handleAddSkillClick} className="text-primary hover:underline" title="Add skill">+ Add</button>
                    <button onClick={handleEditSkillsClick} className="text-primary hover:underline" title="Edit skills">✏️ Edit</button>
                  </div>
                </div>

                {isAddingSkill ? (
                  <div className="space-y-3">
                    {skillError && <div className="form-error">* At least select one skill</div>}

                    <select
                      value={selectedSkill}
                      onChange={(e) => {
                        setSelectedSkill(e.target.value);
                        setSkillError(false);
                      }}
                      className="select"
                    >
                      <option value="">Select Skills</option>
                      {availableSkills.filter(s => !skills.includes(s)).map((s) => (
                        <option key={s} value={s} className="text-neutral-900">{s}</option>
                      ))}
                    </select>

                    <div className="grid gap-2">
                      <button onClick={handleCancelSkillAdd} className="btn btn-secondary w-full">Cancel</button>
                      <button onClick={handleSaveSkill} className="btn btn-primary w-full">Save</button>
                    </div>

                    <div className="pt-2 space-y-1">
                      {skills.map((skill, idx) => (
                        <div key={idx} className="text-sm font-medium text-neutral-100">{skill}</div>
                      ))}
                    </div>
                  </div>
                ) : isEditingSkills ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {tempSkills.map((skill, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-neutral-800 rounded-lg px-3 py-2">
                          <span className="text-sm text-neutral-100">{skill}</span>
                          <button onClick={() => handleRemoveSkillFromTemp(idx)} className="text-red-400 hover:text-red-300">❌</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <button onClick={handleCancelSkillsEdit} className="btn btn-secondary">Cancel</button>
                      <button onClick={handleSaveSkillsEdit} className="btn btn-primary">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {skills.map((skill, idx) => (
                      <div key={idx} className="text-sm font-medium text-neutral-100">{skill}</div>
                    ))}
                    {skills.length === 0 && (
                      <button onClick={handleAddSkillClick} className="btn btn-ghost w-full mt-3">
                        + Add more skills
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6">
              {/* Tabs */}
              <div className="border-b border-neutral-800 mb-6">
                <div className="flex gap-3">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={[
                        "py-2 px-4 text-sm font-medium rounded-t-lg border-b-2 transition-colors",
                        activeTab === tab
                          ? "border-primary text-primary"
                          : "border-transparent text-neutral-400 hover:text-neutral-200"
                      ].join(" ")}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'Active Interview' && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Self Introduction Video */}
                  <div>
                    <div className="rounded-xl bg-neutral-900 border border-neutral-800 relative mb-4" style={{ aspectRatio: '16/9' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                          <span className="text-2xl text-white">▶️</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 caption text-neutral-300">0:00 / 0:51</div>
                      <div className="absolute bottom-3 right-3 flex gap-2 text-neutral-100">
                        <button className="hover:text-primary">🔊</button>
                        <button className="hover:text-primary">⚙️</button>
                        <button className="hover:text-primary">⋮</button>
                      </div>
                    </div>

                    <h4 className="label text-neutral-200 text-center mb-2">Self Introduction</h4>
                    <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4">
                      <h5 className="label text-neutral-300 mb-2">Self Introduction Transcript</h5>
                      <p className="caption text-neutral-300 leading-relaxed">
                        Sure. My name is John Smith, and I'm a software developer specializing in building web
                        applications…
                      </p>
                    </div>
                  </div>

                  {/* Technical Interview Video */}
                  <div>
                    <div className="rounded-xl bg-neutral-900 border border-neutral-800 relative mb-4" style={{ aspectRatio: '16/9' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                          <span className="text-2xl text-white">▶️</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 caption text-neutral-300">0:00 / 26:20</div>
                      <div className="absolute bottom-3 right-3 flex gap-2 text-neutral-100">
                        <button className="hover:text-primary">🔊</button>
                        <button className="hover:text-primary">⚙️</button>
                        <button className="hover:text-primary">⋮</button>
                      </div>
                    </div>

                    <h4 className="label text-neutral-200 text-center mb-4">Technical Interview</h4>
                    <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="label text-neutral-300">Skill Set</h5>
                        <div className="w-12 h-12 relative">
                          <svg className="w-12 h-12 -rotate-90 text-neutral-700" viewBox="0 0 36 36">
                            <path stroke="currentColor" strokeWidth="3" fill="transparent"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-primary" stroke="currentColor" strokeWidth="3" fill="transparent"
                              strokeDasharray="66.67, 100"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">68.33%</span>
                          </div>
                        </div>
                      </div>
                      <div className="caption text-neutral-300">Angular</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Education' && (
                <div className="relative min-h-[400px]">
                  <button
                    onClick={handleAddEducation}
                    className="absolute top-0 right-0 w-14 h-14 rounded-2xl text-white text-2xl font-bold shadow-button hover:brightness-110 active:brightness-95 grad-cta"
                    title="Add education"
                  >
                    +
                  </button>

                  {education.length === 0 ? (
                    <div className="h-full" />
                  ) : (
                    <div className="pt-16 space-y-4">
                      {education.map((edu) => (
                        <div key={edu.id} className="border-b border-neutral-800 pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-neutral-100">{edu.qualification}</div>
                              <div className="caption text-neutral-300">{edu.academy}</div>
                              <div className="caption text-neutral-300">{edu.field}</div>
                              <div className="caption text-neutral-300">
                                {edu.scoreType === 'percentage' ? 'Percentage' : 'CGPA'}: {edu.score}
                              </div>
                              <div className="caption text-neutral-400">
                                {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} to {new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button onClick={() => handleEditEducation(edu)} className="btn btn-ghost p-2">✏️</button>
                              <button onClick={() => handleDeleteEducation(edu.id)} className="btn btn-ghost p-2 text-secondary">🗑️</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Certificates' && (
                <div className="relative min-h-[400px]">
                  <button
                    onClick={handleAddCertificate}
                    className="absolute top-0 right-0 w-14 h-14 rounded-2xl text-white text-2xl font-bold shadow-button hover:brightness-110 active:brightness-95 grad-cta"
                    title="Add certificate"
                  >
                    +
                  </button>

                  {certificates.length === 0 ? (
                    <div className="h-full" />
                  ) : (
                    <div className="pt-16 space-y-4">
                      {certificates.map((cert) => (
                        <div key={cert.id} className="border-b border-neutral-800 pb-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-neutral-100">{cert.name}</div>
                              <div className="caption text-neutral-300">{cert.organization}</div>
                              <div className="caption text-neutral-300">{cert.credentialId}</div>
                              <div className="caption text-neutral-400">
                                {new Date(cert.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} to {cert.doesntExpire ? 'Present' : new Date(cert.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                              <div className="caption">
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  Credential URL
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button onClick={() => handleEditCertificate(cert)} className="btn btn-ghost p-2">✏️</button>
                              <button onClick={() => handleDeleteCertificate(cert.id)} className="btn btn-ghost p-2 text-secondary">🗑️</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EDUCATION MODAL */}
      {showEducationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-accent text-white p-6">
              <h3 className="text-xl font-semibold">{editingEducationId ? 'Edit Education' : 'Education Details'}</h3>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Qualification*</label>
                <input
                  type="text"
                  value={educationForm.qualification}
                  onChange={(e) => handleEducationInputChange('qualification', e.target.value)}
                  className={`input ${educationErrors.qualification ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                />
                {educationErrors.qualification && <p className="form-error">{educationErrors.qualification}</p>}
              </div>

              <div>
                <label className="form-label">Academy*</label>
                <input
                  type="text"
                  value={educationForm.academy}
                  onChange={(e) => handleEducationInputChange('academy', e.target.value)}
                  className={`input ${educationErrors.academy ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                />
                {educationErrors.academy && <p className="form-error">{educationErrors.academy}</p>}
              </div>

              <div>
                <label className="form-label">Field of Study*</label>
                <input
                  type="text"
                  value={educationForm.field}
                  onChange={(e) => handleEducationInputChange('field', e.target.value)}
                  className={`input ${educationErrors.field ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                />
                {educationErrors.field && <p className="form-error">{educationErrors.field}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Score*</label>
                  <input
                    type="text"
                    value={educationForm.score}
                    onChange={(e) => handleEducationInputChange('score', e.target.value)}
                    className={`input ${educationErrors.score ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                  />
                  {educationErrors.score && <p className="form-error">{educationErrors.score}</p>}
                </div>
                <div>
                  <label className="form-label">Score Type</label>
                  <select
                    value={educationForm.scoreType}
                    onChange={(e) => handleEducationInputChange('scoreType', e.target.value)}
                    className="select"
                  >
                    <option value="cgpa" className="text-neutral-900">CGPA</option>
                    <option value="percentage" className="text-neutral-900">Percentage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Start Date*</label>
                  <input
                    type="date"
                    value={educationForm.startDate}
                    onChange={(e) => handleEducationInputChange('startDate', e.target.value)}
                    className={`input ${educationErrors.startDate ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                  />
                  {educationErrors.startDate && <p className="form-error">{educationErrors.startDate}</p>}
                </div>
                <div>
                  <label className="form-label">End Date*</label>
                  <input
                    type="date"
                    value={educationForm.endDate}
                    onChange={(e) => handleEducationInputChange('endDate', e.target.value)}
                    className={`input ${educationErrors.endDate ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                  />
                  {educationErrors.endDate && <p className="form-error">{educationErrors.endDate}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleCloseEducationModal} className="btn btn-secondary flex-1">Cancel</button>
                <button onClick={handleEducationSubmit} className="btn btn-primary flex-1">
                  {editingEducationId ? 'Update' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-accent text-white p-6">
              <h3 className="text-xl font-semibold">Certificate Details</h3>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Certificate Name*</label>
                <input
                  type="text"
                  value={certificateForm.name}
                  onChange={(e) => handleCertificateInputChange('name', e.target.value)}
                  className={`input ${certificateErrors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                />
                {certificateErrors.name && <p className="form-error">{certificateErrors.name}</p>}
              </div>

              <div>
                <label className="form-label">Issued Organization*</label>
                <input
                  type="text"
                  value={certificateForm.organization}
                  onChange={(e) => handleCertificateInputChange('organization', e.target.value)}
                  className={`input ${certificateErrors.organization ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                />
                {certificateErrors.organization && <p className="form-error">{certificateErrors.organization}</p>}
              </div>

              <div>
                <label className="form-label">Credential Id*</label>
                <input
                  type="text"
                  value={certificateForm.credentialId}
                  onChange={(e) => handleCertificateInputChange('credentialId', e.target.value)}
                  className={`input ${certificateErrors.credentialId ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                />
                {certificateErrors.credentialId && <p className="form-error">{certificateErrors.credentialId}</p>}
              </div>

              <div>
                <label className="form-label">Credential URL*</label>
                <input
                  type="url"
                  value={certificateForm.credentialUrl}
                  onChange={(e) => handleCertificateInputChange('credentialUrl', e.target.value)}
                  className={`input ${certificateErrors.credentialUrl ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                />
                {certificateErrors.credentialUrl && <p className="form-error">{certificateErrors.credentialUrl}</p>}
                {certificateForm.credentialUrl && isValidUrl(certificateForm.credentialUrl) && !certificateErrors.credentialUrl && (
                  <p className="caption text-neutral-400 mt-1">Looks good.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Start Date*</label>
                  <input
                    type="date"
                    value={certificateForm.startDate}
                    onChange={(e) => handleCertificateInputChange('startDate', e.target.value)}
                    className={`input ${certificateErrors.startDate ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
                  />
                  {certificateErrors.startDate && <p className="form-error">{certificateErrors.startDate}</p>}
                </div>
                <div>
                  <label className="form-label">End Date{certificateForm.doesntExpire ? '' : '*'}</label>
                  <input
                    type="date"
                    value={certificateForm.endDate}
                    onChange={(e) => handleCertificateInputChange('endDate', e.target.value)}
                    disabled={certificateForm.doesntExpire}
                    className={`input ${certificateErrors.endDate ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''} ${certificateForm.doesntExpire ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {certificateErrors.endDate && <p className="form-error">{certificateErrors.endDate}</p>}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  checked={certificateForm.doesntExpire}
                  onChange={(e) => handleCertificateInputChange('doesntExpire', e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900"
                />
                Doesn’t expire
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCertificateModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button onClick={handleCertificateSubmit} className="btn btn-primary flex-1">
                  {editingCertificateId ? 'Update' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toasts & Delete Confirmation */}
      <SuccessToast
        showSuccessToast={showSuccessToast}
        setShowSuccessToast={setShowSuccessToast}
        title={successTitle}
        message={successMessage}
      />
      <ErrorToast
        showErrorToast={showErrorToast}
        setShowErrorToast={setShowErrorToast}
        errorMessage={errorMessage}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={deleteCertificateId ? confirmDeleteCertificate : confirmDeleteEducation}
        onCancel={deleteCertificateId ? cancelDeleteCertificate : cancelDeleteEducation}
      />
    </div>
  );
};

export default Profile;
