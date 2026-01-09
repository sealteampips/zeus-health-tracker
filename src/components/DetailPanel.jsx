import { useState, useRef } from 'react';
import { statusColors, severityColors, getMedicationsForIssue, getVisitsForIssue } from '../data/zeusData';

export default function DetailPanel({ issue, onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startY = useRef(0);
  const modalRef = useRef(null);

  if (!issue) return null;

  const medications = getMedicationsForIssue(issue.id);
  const visits = getVisitsForIssue(issue.id);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Swipe to dismiss handlers
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    // Only allow dragging down
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged more than 100px, close the modal
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-x-0 bottom-0 sm:inset-auto sm:right-0 sm:top-0 sm:h-full sm:w-96 bg-dark-card sm:border-l border-dark-border shadow-2xl z-50 flex flex-col max-h-[80vh] sm:max-h-full rounded-t-2xl sm:rounded-none"
      style={{
        transform: `translateY(${dragOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag handle - mobile only */}
      <div className="sm:hidden flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-gray-600 rounded-full" />
      </div>

      {/* Close button - large and always visible on mobile */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 sm:w-10 sm:h-10 bg-dark-bg hover:bg-dark-border active:bg-dark-border rounded-full transition-colors flex items-center justify-center z-10 border border-dark-border sm:border-0"
        aria-label="Close"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="flex-shrink-0 bg-dark-card border-b border-dark-border px-4 pt-2 pb-4 sm:p-4 pr-16 sm:pr-16">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusColors[issue.status] }}
          />
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {issue.status}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white">{issue.title}</h2>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-4 space-y-4 sm:space-y-6" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
        {/* Overview */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Overview</h3>
          <div className="bg-dark-bg rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Severity</span>
              <span
                className="font-medium capitalize text-sm"
                style={{ color: severityColors[issue.severity] }}
              >
                {issue.severity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Identified</span>
              <span className="text-white text-sm">{formatDate(issue.dateIdentified)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Last Updated</span>
              <span className="text-white text-sm">{formatDate(issue.lastUpdated)}</span>
            </div>
            {issue.resolvedDate && (
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Resolved</span>
                <span className="text-green-400 text-sm">{formatDate(issue.resolvedDate)}</span>
              </div>
            )}
          </div>
        </section>

        {/* Description */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Description</h3>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{issue.description}</p>
        </section>

        {/* Symptoms */}
        {issue.symptoms && issue.symptoms.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Symptoms</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {issue.symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="px-2 sm:px-3 py-1 bg-dark-bg rounded-full text-xs sm:text-sm text-gray-300"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Treatment */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Treatment</h3>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{issue.treatment}</p>
        </section>

        {/* Related Medications */}
        {medications.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">
              Related Medications
            </h3>
            <div className="space-y-2">
              {medications.map((med) => (
                <div key={med.id} className="bg-dark-bg rounded-lg p-2.5 sm:p-3">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-medium text-white text-sm sm:text-base truncate">{med.name}</span>
                    {med.active && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex-shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {med.dosage} - {med.frequency}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Visit History */}
        {visits.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">
              Related Vet Visits
            </h3>
            <div className="space-y-2">
              {visits.slice(0, 3).map((visit) => (
                <div key={visit.id} className="bg-dark-bg rounded-lg p-2.5 sm:p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-white">{formatDate(visit.date)}</span>
                    <span className="text-xs text-gray-400">{visit.type}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400">{visit.reason}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {issue.notes && (
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Notes</h3>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
              <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">{issue.notes}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
