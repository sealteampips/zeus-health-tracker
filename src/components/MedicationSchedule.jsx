import { useState } from 'react';
import { medications, medicalIssues } from '../data/zeusData';

export default function MedicationSchedule() {
  const [showInactive, setShowInactive] = useState(false);

  const activeMeds = medications.filter(med => med.active);
  const displayMeds = showInactive ? medications : activeMeds;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isRefillSoon = (refillDate) => {
    if (!refillDate) return false;
    const refill = new Date(refillDate);
    const today = new Date();
    const daysUntil = Math.ceil((refill - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 14 && daysUntil >= 0;
  };

  const getRelatedIssue = (conditionId) => {
    return medicalIssues.find(issue => issue.id === conditionId);
  };

  const getFrequencyIcon = (frequency) => {
    if (frequency.toLowerCase().includes('daily') || frequency.toLowerCase().includes('hours')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (frequency.toLowerCase().includes('weekly') || frequency.toLowerCase().includes('weeks')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return null;
  };

  // Define the daily schedule with 3 time blocks
  const dailySchedule = [
    {
      label: 'Morning',
      time: '7:00 AM',
      icon: '🌅',
      medications: [
        { name: 'Apoquel', dosage: '16mg', note: 'With food' },
        { name: 'Rimadyl', dosage: '25mg', note: 'With food' },
        { name: 'Clavamox', dosage: '250mg', note: 'With food' },
        { name: 'Oculenis Eye Gel', dosage: '1 drop', note: 'Left eye' },
        { name: 'Nordic Naturals Omega-3', dosage: '1 pump', note: 'Add to food' },
      ]
    },
    {
      label: 'Afternoon',
      time: '3:00 PM',
      icon: '☀️',
      medications: [
        { name: 'Oculenis Eye Gel', dosage: '1 drop', note: 'Left eye' },
      ]
    },
    {
      label: 'Evening',
      time: '7:00 PM',
      icon: '🌙',
      medications: [
        { name: 'Rimadyl', dosage: '25mg', note: 'With food' },
        { name: 'Clavamox', dosage: '250mg', note: 'With food' },
        { name: 'Oculenis Eye Gel', dosage: '1 drop', note: 'Left eye' },
      ]
    }
  ];

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-dark-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Medication Schedule</h2>
            <p className="text-sm text-gray-400 mt-1">
              {activeMeds.length} active medication{activeMeds.length !== 1 ? 's' : ''}
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 rounded bg-dark-bg border-dark-border text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-400">Show inactive</span>
          </label>
        </div>
      </div>

      {/* Daily Schedule View - 3 Time Blocks */}
      <div className="p-3 sm:p-4 border-b border-dark-border bg-dark-bg/50">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Daily Schedule</h3>
        <div className="space-y-4">
          {dailySchedule.map((block) => (
            <div key={block.label} className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
              {/* Time block header */}
              <div className="flex items-center gap-3 p-3 bg-dark-border/30">
                <span className="text-xl">{block.icon}</span>
                <div>
                  <span className="text-white font-medium">{block.label}</span>
                  <span className="text-gray-400 text-sm ml-2">({block.time})</span>
                </div>
              </div>
              {/* Medications in this block */}
              <div className="p-2 space-y-2">
                {block.medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg bg-dark-bg/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-white text-sm font-medium">{med.name}</span>
                      <span className="text-gray-500 text-xs ml-2">({med.dosage})</span>
                    </div>
                    <span className="text-gray-400 text-xs hidden sm:block">{med.note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* As-needed medications */}
        <div className="mt-4 p-3 bg-dark-card rounded-lg border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-purple-400">As Needed</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-dark-bg/50">
            <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-medium">Cytopoint Injection</span>
            </div>
            <span className="text-gray-400 text-xs">Every 4-8 weeks at vet</span>
          </div>
        </div>
      </div>

      {/* Medication Cards */}
      <div className="divide-y divide-dark-border max-h-[400px] overflow-y-auto">
        {displayMeds.map((med) => {
          const relatedIssue = getRelatedIssue(med.forCondition);
          const needsRefill = isRefillSoon(med.refillDate);

          return (
            <div
              key={med.id}
              className={`p-3 sm:p-4 ${!med.active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-medium text-white text-sm sm:text-base">{med.name}</h3>
                    {med.active ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 flex-shrink-0">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-500/20 text-gray-400 flex-shrink-0">
                        Inactive
                      </span>
                    )}
                    {needsRefill && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/20 text-orange-400 flex-shrink-0">
                        Refill Soon
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      {getFrequencyIcon(med.frequency)}
                      {med.frequency}
                    </span>
                    <span>{med.dosage}</span>
                  </div>

                  {relatedIssue && (
                    <div className="text-xs text-gray-500 mb-2">
                      For: <span className="text-gray-400">{relatedIssue.title}</span>
                    </div>
                  )}

                  {med.notes && (
                    <p className="text-xs sm:text-sm text-gray-400 bg-dark-bg rounded p-2 mt-2">
                      {med.notes}
                    </p>
                  )}
                </div>

                <div className="text-right text-xs sm:text-sm flex-shrink-0">
                  {med.refillDate && (
                    <div className={needsRefill ? 'text-orange-400' : 'text-gray-400'}>
                      <div className="text-xs text-gray-500">Refill by</div>
                      {formatDate(med.refillDate)}
                    </div>
                  )}
                  {med.endDate && (
                    <div className="text-gray-400 mt-1">
                      <div className="text-xs text-gray-500">End date</div>
                      {formatDate(med.endDate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayMeds.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No medications to display
        </div>
      )}
    </div>
  );
}
