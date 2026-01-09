import { useState, useEffect } from 'react';
import ModelViewer, { STATUS_FILTERS } from './components/ModelViewer';
import DetailPanel from './components/DetailPanel';
import MedicalHistory from './components/MedicalHistory';
import MedicationSchedule from './components/MedicationSchedule';
import BodyPartCalibrator from './components/BodyPartCalibrator';
import { useBodyPartCalibration } from './hooks/useBodyPartCalibration';
import { petProfile, medicalIssues, getActiveIssues, getMonitoringIssues, getResolvedIssues } from './data/zeusData';

function App() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeTab, setActiveTab] = useState('history');
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS.ACTIVE_ONLY);
  const [previewPosition, setPreviewPosition] = useState(null);

  // Body part calibration hook
  const {
    setCalibration,
    clearAllCalibrations,
    getPosition,
    isCalibrated,
    getStats,
    isLocked,
    toggleLock
  } = useBodyPartCalibration();

  const activeIssues = getActiveIssues();
  const monitoringIssues = getMonitoringIssues();
  const resolvedIssues = getResolvedIssues();

  // Filter issues for the list based on status filter
  const getFilteredIssues = () => {
    return medicalIssues.filter(issue => {
      switch (statusFilter) {
        case STATUS_FILTERS.ACTIVE_ONLY:
          return issue.status === 'active';
        case STATUS_FILTERS.ACTIVE_MONITORING:
          return issue.status === 'active' || issue.status === 'monitoring';
        case STATUS_FILTERS.SHOW_ALL:
          return true;
        default:
          return issue.status === 'active';
      }
    });
  };

  const filteredIssues = getFilteredIssues();

  // When selected body part changes, initialize preview position
  useEffect(() => {
    if (selectedBodyPart) {
      // Get current position (calibrated or default)
      const currentPos = getPosition(selectedBodyPart);
      setPreviewPosition([...currentPos]);
    } else {
      setPreviewPosition(null);
    }
  }, [selectedBodyPart, getPosition]);

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
  };

  const handleClosePanel = () => {
    setSelectedIssue(null);
  };

  const handleSelectBodyPart = (partId) => {
    setSelectedBodyPart(partId);
    if (partId) {
      // Initialize with current position (calibrated or default)
      const pos = getPosition(partId);
      setPreviewPosition([...pos]);
    } else {
      setPreviewPosition(null);
    }
  };

  const handlePositionChange = (newPosition) => {
    setPreviewPosition([...newPosition]);
  };

  const handleSavePosition = (bodyPartId, position) => {
    setCalibration(bodyPartId, position);
  };

  const handleToggleCalibration = () => {
    setCalibrationMode(!calibrationMode);
    setSelectedBodyPart(null);
    setPreviewPosition(null);
  };

  // Calculate age
  const birthDate = new Date(petProfile.birthDate);
  const today = new Date();
  const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

  // Get current position for the calibrator (calibrated or default)
  const getCurrentPosition = () => {
    if (!selectedBodyPart) return [0, 0, 0];
    return getPosition(selectedBodyPart);
  };

  // Status filter label
  const getFilterLabel = () => {
    switch (statusFilter) {
      case STATUS_FILTERS.ACTIVE_ONLY:
        return 'Active Only';
      case STATUS_FILTERS.ACTIVE_MONITORING:
        return 'Active + Monitoring';
      case STATUS_FILTERS.SHOW_ALL:
        return 'Show All';
      default:
        return 'Active Only';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      {/* Header - Mobile optimized with safe area padding */}
      <header className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Pet info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
                Z
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{petProfile.name}</h1>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {petProfile.breed} • {age} years old
                </p>
              </div>
            </div>

            {/* Quick Stats - Compact on mobile */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-red-400">{activeIssues.length}</div>
                <div className="text-xs text-gray-400 hidden sm:block">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-yellow-400">{monitoringIssues.length}</div>
                <div className="text-xs text-gray-400 hidden sm:block">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-400">{resolvedIssues.length}</div>
                <div className="text-xs text-gray-400 hidden sm:block">Resolved</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Stacked on mobile */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* 3D Viewer Section */}
          <div className="space-y-4 sm:space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-white">3D Health Map</h2>
              <div className="flex items-center gap-2">
                {/* Status Filter Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-dark-card text-gray-300 border border-dark-border rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={STATUS_FILTERS.ACTIVE_ONLY}>Active Only</option>
                  <option value={STATUS_FILTERS.ACTIVE_MONITORING}>Active + Monitoring</option>
                  <option value={STATUS_FILTERS.SHOW_ALL}>Show All</option>
                </select>

                {/* Calibrate Button */}
                <button
                  onClick={handleToggleCalibration}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm ${
                    calibrationMode
                      ? 'bg-purple-500 text-white'
                      : 'bg-dark-card text-gray-400 border border-dark-border hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Calibrate</span>
                  {isLocked && <span className="text-yellow-400">🔒</span>}
                </button>

                {/* Hotspots Toggle */}
                <button
                  onClick={() => setShowHotspots(!showHotspots)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm ${
                    showHotspots
                      ? 'bg-blue-500 text-white'
                      : 'bg-dark-card text-gray-400 border border-dark-border'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showHotspots ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    )}
                  </svg>
                  <span className="hidden sm:inline">{showHotspots ? 'Hide' : 'Show'}</span> Hotspots
                </button>
              </div>
            </div>

            {/* 3D Viewer - Responsive height - overflow-hidden prevents 3D canvas from overlapping content below */}
            <div className="h-[350px] sm:h-[400px] lg:h-[500px] overflow-hidden">
              <ModelViewer
                showHotspots={showHotspots}
                onSelectIssue={handleSelectIssue}
                selectedIssue={selectedIssue}
                issues={medicalIssues}
                calibrationMode={calibrationMode}
                selectedBodyPart={selectedBodyPart}
                previewPosition={previewPosition}
                getPosition={getPosition}
                statusFilter={statusFilter}
              />
            </div>

            {/* Calibration Panel - shows when in calibration mode */}
            {calibrationMode && (
              <BodyPartCalibrator
                selectedPart={selectedBodyPart}
                onSelectPart={handleSelectBodyPart}
                isCalibrated={isCalibrated}
                onClearAll={clearAllCalibrations}
                stats={getStats()}
                onClose={() => {
                  setCalibrationMode(false);
                  setSelectedBodyPart(null);
                  setPreviewPosition(null);
                }}
                currentPosition={getCurrentPosition()}
                onPositionChange={handlePositionChange}
                onSavePosition={handleSavePosition}
                isLocked={isLocked}
                onToggleLock={toggleLock}
              />
            )}

            {/* Issue Quick List - Scrollable on mobile (hide when calibrating) */}
            {!calibrationMode && (
              <div className="mt-6 sm:mt-0 border-t border-dark-border pt-4 sm:pt-0 sm:border-t-0">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-1">
                  Health Issues ({filteredIssues.length})
                </h3>
                <div className="bg-dark-card rounded-xl border border-dark-border p-3 space-y-2 max-h-[220px] sm:max-h-[200px] overflow-y-auto">
                  {filteredIssues.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => handleSelectIssue(issue)}
                      className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg transition-colors text-left ${
                        selectedIssue?.id === issue.id
                          ? 'bg-blue-500/20 border border-blue-500/50'
                          : 'bg-dark-bg hover:bg-dark-border active:bg-dark-border'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          issue.status === 'active' ? 'animate-pulse' : ''
                        }`}
                        style={{
                          backgroundColor:
                            issue.status === 'active'
                              ? '#ef4444'
                              : issue.status === 'monitoring'
                              ? '#eab308'
                              : '#22c55e',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{issue.title}</p>
                        <p className="text-xs text-gray-400 capitalize">
                          {issue.bodyPartId ? issue.bodyPartId.replace(/-/g, ' ') : 'Systemic'}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                  {filteredIssues.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No issues match the current filter
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* History & Medications Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Tab Navigation - Touch friendly */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeTab === 'history'
                    ? 'bg-blue-500 text-white'
                    : 'bg-dark-card text-gray-400 hover:text-white active:bg-dark-border border border-dark-border'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('medications')}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeTab === 'medications'
                    ? 'bg-blue-500 text-white'
                    : 'bg-dark-card text-gray-400 hover:text-white active:bg-dark-border border border-dark-border'
                }`}
              >
                Medications
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'history' ? (
              <MedicalHistory onSelectIssue={handleSelectIssue} />
            ) : (
              <MedicationSchedule />
            )}
          </div>
        </div>
      </main>

      {/* Detail Panel Slide-out - Full screen on mobile */}
      {selectedIssue && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClosePanel}
          />
          <DetailPanel issue={selectedIssue} onClose={handleClosePanel} />
        </>
      )}

      {/* Footer - Simplified on mobile */}
      <footer className="bg-dark-card border-t border-dark-border mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <div>
              <p className="font-medium text-white">{petProfile.veterinarian.name}</p>
              <p>{petProfile.veterinarian.address} • {petProfile.veterinarian.phone}</p>
            </div>
            <div className="sm:text-right">
              <p>Weight: <span className="text-white">{petProfile.weight} lbs</span></p>
              <p>Status: <span className="text-white">{petProfile.sex}</span></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
