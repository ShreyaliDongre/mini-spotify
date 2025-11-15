

// Practical 1: console
console.log('Recommended page loaded — Practical 1');

// Practical 10: Load recommended songs from JSON file
let recommended = [];

// Practical 10: Fetch and parse JSON file
async function loadDataFromJSON() {
  // Show loading state
  const element = getRecElement();
  if (element) {
    element.innerHTML = '<p class="muted" style="text-align: center; padding: 40px;">Loading recommended songs...</p>';
  }
  
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const appData = await response.json(); // Local variable instead of global
    recommended = appData.recommended || [];
    console.log('✅ Data loaded from JSON:', appData);
    console.log('✅ Recommended songs:', recommended.length);
    
    // Render after data is loaded
    if (recommended.length > 0) {
      renderRecommended();
    } else {
      throw new Error('No recommended songs in JSON data');
    }
    
    // Log additional data
    if (appData.moods) {
      console.log('Available moods:', appData.moods.map(m => m.name).join(', '));
    }
    if (appData.appInfo) {
      console.log('App Info:', appData.appInfo);
    }
  } catch (error) {
    console.error(' Failed to load JSON data:', error);
    console.log(' Using fallback data instead');
    
    // Fallback to default data if JSON fails
    recommended = [
      {id:101,title:'Midnight Swim',artist:'Luna Waves',mood:'Calm',cover:'https://picsum.photos/seed/1/400'},
      {id:102,title:'Neon Run',artist:'Pulse City',mood:'Energetic',cover:'https://picsum.photos/seed/2/400'},
      {id:103,title:'Focus Mode',artist:'Study Beats',mood:'Focus',cover:'https://picsum.photos/seed/3/400'},
      {id:104,title:'Velvet Night',artist:'Soft Strings',mood:'Romantic',cover:'https://picsum.photos/seed/4/400'},
      {id:105,title:'Sunset Dance',artist:'Party People',mood:'Party',cover:'https://picsum.photos/seed/5/400'}
    ];
    renderRecommended();
    console.log('✅ Fallback data loaded:', recommended.length, 'songs');
  }
}

// Practical 7: DOM ref - Get element when DOM is ready
let recEl = null;

function getRecElement() {
  if (!recEl) {
    recEl = document.getElementById('recommended');
  }
  return recEl;
}

// Practical 5: render recommended using array methods
function createRecCard(song){
  const wrap = document.createElement('div'); wrap.className='rec-card';
  const cover = document.createElement('div'); cover.className='cover';
  if(song.cover) {
    const img = document.createElement('img'); 
    img.src = song.cover; 
    img.alt='cover'; 
    img.style.width='100%'; 
    img.style.height='100%'; 
    img.style.objectFit='cover'; 
    cover.appendChild(img);
  } else {
    cover.style.background = 'linear-gradient(90deg,var(--neon1),var(--neon2))';
  }
  const meta = document.createElement('div'); meta.className='meta';
  const title = document.createElement('div'); title.className='rec-title'; title.textContent = song.title;
  const artist = document.createElement('div'); artist.className='rec-artist muted small'; artist.textContent = song.artist;
  const tag = document.createElement('div'); tag.className='tag-chip'; tag.textContent = song.mood;
  
  // Add duration if available
  if(song.duration) {
    const duration = document.createElement('div'); 
    duration.className='muted small'; 
    duration.style.marginTop = '4px';
    duration.textContent = song.duration;
    meta.appendChild(duration);
  }
  
  meta.appendChild(title); meta.appendChild(artist);
  const actions = document.createElement('div'); actions.className='rec-actions';
  const addBtn = document.createElement('button'); 
  addBtn.className='btn btn-primary'; 
  addBtn.textContent='Add'; 
  addBtn.onclick = ()=> addToPlaylist(song);
  actions.appendChild(addBtn);
  wrap.appendChild(cover); wrap.appendChild(meta); wrap.appendChild(tag); wrap.appendChild(actions);
  return wrap;
}

function renderRecommended(){ 
  const element = getRecElement();
  if(!element) {
    console.error('Recommended element not found!');
    return;
  }
  if(!recommended || recommended.length === 0) {
    element.innerHTML = '<p class="muted" style="text-align: center; padding: 40px;">Loading recommended songs...</p>';
    return;
  }
  element.innerHTML=''; 
  recommended.forEach(r=> element.appendChild(createRecCard(r))); 
  console.log('Rendered', recommended.length, 'recommended songs');
}

// Practical 9: add to playlist stored in localStorage
function addToPlaylist(song){
  // clone but ensure unique id
  const copy = Object.assign({}, song, {id: Date.now()});
  try{
    const raw = localStorage.getItem('ms-playlist')||'[]';
    const list = JSON.parse(raw);
    list.push(copy);
    localStorage.setItem('ms-playlist', JSON.stringify(list));
    alert('Added to playlist!');
  } catch(e){ console.error('Add failed', e); alert('Failed to add'); }
}

// Boot - Load data from JSON file when DOM is ready
function init() {    //Practical 4: Functions
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadDataFromJSON();
    });
  } else {
    // DOM is already ready
    loadDataFromJSON();
  }
}

init();

// Practical 6: string example - list all moods
function listMoods(){ 
  return recommended.map(r=>r.mood).join(', '); 
}

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { recommended, loadDataFromJSON };
}
