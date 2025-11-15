// data-loader.js — Utility for loading JSON data
// Practical 10: JSON file loading and parsing

let appData = null;
let dataLoaded = false;

/**
 * Load data from JSON file
 * @returns {Promise<Object>} The loaded data object
 */
async function loadAppData() {
  if (dataLoaded && appData) {
    return appData;
  }
  
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    appData = await response.json();
    dataLoaded = true;
    console.log('App data loaded from JSON:', appData);
    return appData;
  } catch (error) {
    console.error('Failed to load JSON data:', error);
    // Return empty structure if loading fails
    return {
      recommended: [],
      moods: [],
      appInfo: {}
    };
  }
}

/**
 * Get recommended songs from loaded data
 * @returns {Array} Array of recommended songs
 */
async function getRecommendedSongs() {
  const data = await loadAppData();
  return data.recommended || [];
}

/**
 * Get moods configuration from loaded data
 * @returns {Array} Array of mood objects
 */
async function getMoods() {
  const data = await loadAppData();
  return data.moods || [];
}

/**
 * Get app information from loaded data
 * @returns {Object} App info object
 */
async function getAppInfo() {
  const data = await loadAppData();
  return data.appInfo || {};
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.dataLoader = {
    loadAppData,
    getRecommendedSongs,
    getMoods,
    getAppInfo
  };
}


