import { useState } from 'react';
import { vetVisits, medicalIssues, statusColors } from '../data/zeusData';

export default function MedicalHistory({ onSelectIssue }) {
  const [filter, setFilter] = useState('all');
  const [expandedVisit, setExpandedVisit] = useState(null);

  const sortedVisits = [...vetVisits].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredVisits = filter === 'all'
    ? sortedVisits
    : sortedVisits.filter(visit => visit.type.toLowerCase() === filter);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Annual Wellness': 'bg-blue-500/20 text-blue-400',
      'Wellness': 'bg-blue-500/20 text-blue-400',
      'Sick Visit': 'bg-red-500/20 text-red-400',
      'Follow-up': 'bg-yellow-500/20 text-yellow-400',
      'Check-up': 'bg-green-500/20 text-green-400',
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  const getRelatedIssues = (issueIds) => {
    return issueIds?.map(id => medicalIssues.find(issue => issue.id === id)).filter(Boolean) || [];
  };

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-dark-border">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-white">Medical History</h2>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {['all', 'sick visit', 'follow-up', 'wellness'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors capitalize ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-dark-bg text-gray-400 hover:text-white active:bg-dark-border'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-dark-border max-h-[400px] sm:max-h-[500px] overflow-y-auto">
        {filteredVisits.map((visit) => (
          <div
            key={visit.id}
            className="p-3 sm:p-4 hover:bg-dark-bg/50 active:bg-dark-bg/50 transition-colors cursor-pointer"
            onClick={() => setExpandedVisit(expandedVisit === visit.id ? null : visit.id)}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Date column */}
              <div className="flex-shrink-0 w-14 sm:w-20 text-center">
                <div className="text-xs sm:text-sm font-bold text-white">
                  {new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(visit.date).getFullYear()}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(visit.type)}`}>
                    {visit.type}
                  </span>
                  {visit.vaccinations && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400">
                      Vaccines
                    </span>
                  )}
                  {visit.nextAppointment && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
                      Follow-up scheduled
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-white text-sm sm:text-base mb-1">{visit.reason}</h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{visit.notes}</p>

                {/* Related Issues */}
                {visit.relatedIssues && visit.relatedIssues.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getRelatedIssues(visit.relatedIssues).map((issue) => (
                      <button
                        key={issue.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIssue(issue);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-dark-border hover:bg-dark-border/70 active:bg-dark-bg transition-colors"
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusColors[issue.status] }}
                        />
                        <span className="text-gray-300 truncate max-w-[100px] sm:max-w-[150px]">{issue.title}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Expanded Details */}
                {expandedVisit === visit.id && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-border space-y-3">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-500">Doctor</span>
                        <p className="text-white truncate">{visit.doctor}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Clinic</span>
                        <p className="text-white truncate">{visit.clinic}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight</span>
                        <p className="text-white">{visit.weight} lbs</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost</span>
                        <p className="text-white">{formatCurrency(visit.cost)}</p>
                      </div>
                    </div>
                    {visit.nextAppointment && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 sm:p-3">
                        <span className="text-green-400 text-xs sm:text-sm font-medium">
                          Next Appointment: {formatDate(visit.nextAppointment)}
                        </span>
                      </div>
                    )}
                    {visit.vaccinations && (
                      <div>
                        <span className="text-gray-500 text-xs sm:text-sm">Vaccinations</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {visit.vaccinations.map((vax) => (
                            <span key={vax} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                              {vax}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Expand indicator */}
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 transition-transform ${
                  expandedVisit === visit.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {filteredVisits.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No visits found for this filter
        </div>
      )}
    </div>
  );
}
