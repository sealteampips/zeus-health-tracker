import { useState, useEffect } from 'react';
import { bodyParts, getBodyPartsByCategory, defaultPositions } from '../data/bodyParts';

export default function BodyPartCalibrator({
  selectedPart,
  onSelectPart,
  isCalibrated,
  onClearAll,
  stats,
  onClose,
  currentPosition,
  onPositionChange,
  onSavePosition,
  isLocked,
  onToggleLock
}) {
  const [localPosition, setLocalPosition] = useState([0, 0, 0]);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);
  const groupedParts = getBodyPartsByCategory();

  // Update local position when selected part changes
  useEffect(() => {
    if (currentPosition) {
      setLocalPosition([...currentPosition]);
    }
  }, [currentPosition, selectedPart]);

  const handleSliderChange = (axis, value) => {
    if (isLocked) return;
    const newPosition = [...localPosition];
    newPosition[axis] = parseFloat(value);
    setLocalPosition(newPosition);
    onPositionChange(newPosition);
  };

  const handleResetToDefault = () => {
    if (isLocked) return;
    if (selectedPart) {
      const defaultPos = defaultPositions[selectedPart] || [0, 0, 0];
      setLocalPosition([...defaultPos]);
      onPositionChange([...defaultPos]);
    }
  };

  const handleSave = () => {
    if (isLocked) return;
    if (selectedPart) {
      onSavePosition(selectedPart, localPosition);
    }
  };

  const handleSelectPart = (partId) => {
    if (isLocked && partId) {
      setShowUnlockConfirm(true);
      return;
    }
    onSelectPart(partId);
  };

  const handleUnlockConfirm = () => {
    onToggleLock();
    setShowUnlockConfirm(false);
  };

  const selectedPartData = bodyParts.find(p => p.id === selectedPart);

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
      {/* Unlock Confirmation Dialog */}
      {showUnlockConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Unlock Calibration?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Are you sure you want to modify the calibration? This will unlock editing of body part positions.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUnlockConfirm(false)}
                className="flex-1 py-2 px-4 text-sm text-gray-300 bg-dark-bg hover:bg-dark-border rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlockConfirm}
                className="flex-1 py-2 px-4 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-dark-border bg-purple-500/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Calibrate Body Parts
              {isLocked && <span className="text-yellow-400 text-sm">🔒</span>}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Position hotspots on the 3D model using sliders
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-border active:bg-dark-border rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lock Toggle */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => isLocked ? setShowUnlockConfirm(true) : onToggleLock()}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isLocked
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  : 'bg-dark-bg text-gray-400 border border-dark-border hover:text-white'
              }`}
            >
              {isLocked ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Locked
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Unlocked
                </>
              )}
            </button>
          </div>

          {/* Progress */}
          <div className="text-xs text-gray-400">
            {stats.calibrated}/{stats.total} ({stats.percentage}%)
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Body Part Dropdown */}
      <div className="p-3 sm:p-4 border-b border-dark-border">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Select Body Part
        </label>
        <select
          value={selectedPart || ''}
          onChange={(e) => handleSelectPart(e.target.value || null)}
          disabled={isLocked}
          className={`w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            isLocked ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <option value="">-- Select a body part --</option>
          {Object.entries(groupedParts).map(([category, parts]) => (
            <optgroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
              {parts.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.label} {isCalibrated(part.id) ? '✓' : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Sliders - only show when a part is selected */}
      {selectedPart && !isLocked && (
        <div className="p-3 sm:p-4 space-y-4">
          {/* Current part indicator */}
          <div className="flex items-center gap-2 text-purple-300 bg-purple-500/10 rounded-lg p-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-sm font-medium">
              Positioning: {selectedPartData?.label}
            </span>
          </div>

          {/* X Slider (Left/Right) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-400">X (Left/Right)</label>
              <span className="text-sm font-mono text-purple-400">{localPosition[0].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={localPosition[0]}
              onChange={(e) => handleSliderChange(0, e.target.value)}
              className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-0.5">
              <span>Left</span>
              <span>Right</span>
            </div>
          </div>

          {/* Y Slider (Up/Down) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-400">Y (Up/Down)</label>
              <span className="text-sm font-mono text-purple-400">{localPosition[1].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={localPosition[1]}
              onChange={(e) => handleSliderChange(1, e.target.value)}
              className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-0.5">
              <span>Down</span>
              <span>Up</span>
            </div>
          </div>

          {/* Z Slider (Forward/Back) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-400">Z (Forward/Back)</label>
              <span className="text-sm font-mono text-purple-400">{localPosition[2].toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={localPosition[2]}
              onChange={(e) => handleSliderChange(2, e.target.value)}
              className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-0.5">
              <span>Back</span>
              <span>Front</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleResetToDefault}
              className="flex-1 py-2 px-3 text-sm text-gray-300 bg-dark-bg hover:bg-dark-border active:bg-dark-border rounded-lg transition-colors border border-dark-border"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-3 text-sm text-white bg-purple-500 hover:bg-purple-600 active:bg-purple-700 rounded-lg transition-colors font-medium"
            >
              Save Position
            </button>
          </div>
        </div>
      )}

      {/* Locked message when part is selected but locked */}
      {selectedPart && isLocked && (
        <div className="p-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm">Calibration is locked. Click "Locked" to unlock.</span>
          </div>
        </div>
      )}

      {/* Calibrated parts list */}
      {!selectedPart && (
        <div className="p-3 sm:p-4">
          <p className="text-sm text-gray-400 mb-3">Calibrated parts:</p>
          <div className="flex flex-wrap gap-1.5">
            {bodyParts.filter(p => isCalibrated(p.id)).map((part) => (
              <span
                key={part.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {part.label}
              </span>
            ))}
            {stats.calibrated === 0 && (
              <span className="text-gray-500 text-sm">None yet - select a body part above</span>
            )}
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="p-3 border-t border-dark-border bg-dark-bg/50">
        <div className="flex gap-2">
          <button
            onClick={onClearAll}
            disabled={isLocked}
            className={`flex-1 py-2 px-3 text-sm rounded-lg transition-colors ${
              isLocked
                ? 'text-gray-500 bg-dark-bg cursor-not-allowed'
                : 'text-red-400 bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30'
            }`}
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 text-sm text-white bg-purple-500 hover:bg-purple-600 active:bg-purple-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
