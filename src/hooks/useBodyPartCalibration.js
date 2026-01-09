import { useState, useEffect, useCallback } from 'react';
import { defaultPositions } from '../data/bodyParts';

const STORAGE_KEY = 'zeus-body-part-calibrations';
const LOCK_STORAGE_KEY = 'zeus-calibration-locked';

export function useBodyPartCalibration() {
  const [calibrations, setCalibrations] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Load calibrations and lock state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCalibrations(JSON.parse(stored));
      }
      const lockState = localStorage.getItem(LOCK_STORAGE_KEY);
      if (lockState) {
        setIsLocked(JSON.parse(lockState));
      }
    } catch (error) {
      console.error('Error loading calibrations:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save calibrations to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(calibrations));
      } catch (error) {
        console.error('Error saving calibrations:', error);
      }
    }
  }, [calibrations, isLoaded]);

  // Save lock state to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCK_STORAGE_KEY, JSON.stringify(isLocked));
      } catch (error) {
        console.error('Error saving lock state:', error);
      }
    }
  }, [isLocked, isLoaded]);

  // Toggle lock state
  const toggleLock = useCallback(() => {
    setIsLocked(prev => !prev);
  }, []);

  // Set lock state directly
  const setLocked = useCallback((locked) => {
    setIsLocked(locked);
  }, []);

  // Set calibration for a body part
  const setCalibration = useCallback((bodyPartId, position) => {
    setCalibrations(prev => ({
      ...prev,
      [bodyPartId]: {
        position: [...position],
        calibratedAt: new Date().toISOString()
      }
    }));
  }, []);

  // Remove calibration for a body part
  const removeCalibration = useCallback((bodyPartId) => {
    setCalibrations(prev => {
      const next = { ...prev };
      delete next[bodyPartId];
      return next;
    });
  }, []);

  // Clear all calibrations
  const clearAllCalibrations = useCallback(() => {
    setCalibrations({});
  }, []);

  // Get position for a body part (calibrated or default)
  const getPosition = useCallback((bodyPartId) => {
    if (calibrations[bodyPartId]) {
      return calibrations[bodyPartId].position;
    }
    return defaultPositions[bodyPartId] || [0, 0, 0];
  }, [calibrations]);

  // Check if a body part is calibrated
  const isCalibrated = useCallback((bodyPartId) => {
    return !!calibrations[bodyPartId];
  }, [calibrations]);

  // Get calibration stats
  const getStats = useCallback(() => {
    const calibratedCount = Object.keys(calibrations).length;
    const totalParts = Object.keys(defaultPositions).length;
    return {
      calibrated: calibratedCount,
      total: totalParts,
      percentage: Math.round((calibratedCount / totalParts) * 100)
    };
  }, [calibrations]);

  return {
    calibrations,
    setCalibration,
    removeCalibration,
    clearAllCalibrations,
    getPosition,
    isCalibrated,
    getStats,
    isLoaded,
    isLocked,
    toggleLock,
    setLocked
  };
}
