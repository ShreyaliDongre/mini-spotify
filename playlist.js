/* playlist.js — handles playlist page (full functionality)
   Practical mapping comments are added inline
*/

// Practical 1: Console methods & environment info
console.log('Playlist page loaded — Practical 1');
console.table([{page:'playlist', app:'Moodsound'}]);
console.log('Platform:', navigator.platform);

// Practical 2: ES6 features (let/const, arrow functions, destructuring)
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));
let playlist = [];

// Practical 9: Load playlist from localStorage (persistence)
const loadPlaylist = () => {
  const raw = localStorage.getItem('ms-playlist');
  if(!raw) return [];
  try{ return JSON.parse(raw); } catch(e){ console.error('Failed parse playlist', e); return []; }
};
playlist = loadPlaylist();

// Practical 10: Load moods from JSON file (optional enhancement)
let moodsFromJSON = [];
async function loadMoodsFromJSON() {
  try {
    if (window.dataLoader) {
      moodsFromJSON = await window.dataLoader.getMoods();
      console.log('Moods loaded from JSON:', moodsFromJSON);
    }
  } catch (e) {
    console.log('Using default moods');
  }
}
loadMoodsFromJSON();

// Practical 7: DOM refs
const playlistEl = qs('#playlist');
const moodChipsEl = qs('#moodChips');
const nowTitle = qs('#nowTitle');
const nowArtist = qs('#nowArtist');
const timerLabel = qs('#timerLabel');
const searchInput = qs('#search');
const timerInput = qs('#timerInput');
const startTimerBtn = qs('#startTimer');

// Practical 4: closure example (like counter for demo)
function makeCounter(){ let c=0; return ()=> ++c; }
const likeCounter = makeCounter();

// Practical 6: regex used for simple validation (not strict here)
const idRe = /^\d+$/;

// Practical 7: render single song card (DOM manipulation)
function createSongCard(song){
  const wrap = document.createElement('div');
  wrap.className = 'song-card';

  // cover
  const cover = document.createElement('div'); cover.className = 'song-cover';
  if(song.cover){ const img = document.createElement('img'); img.src = song.cover; img.alt = 'cover'; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover'; cover.appendChild(img); }

  // meta
  const meta = document.createElement('div'); meta.className = 'song-meta';
  const title = document.createElement('div'); title.className='song-title'; title.textContent = song.title;
  const artist = document.createElement('div'); artist.className='song-artist'; artist.textContent = song.artist;
  const tag = document.createElement('div'); tag.className='tag-chip'; tag.textContent = song.mood;

  meta.appendChild(title); meta.appendChild(artist); meta.appendChild(tag);

  // actions
  const actions = document.createElement('div'); actions.className='song-actions';
  const playBtn = document.createElement('button'); playBtn.className='btn'; playBtn.textContent='Play';
  playBtn.onclick = ()=> setNowPlaying(song, {manual: true});
  const likeBtn = document.createElement('button'); likeBtn.className='btn'; likeBtn.textContent='♡'; likeBtn.onclick = ()=> console.log('Likes:', likeCounter());
  const remBtn = document.createElement('button'); remBtn.className='btn'; remBtn.textContent='Remove';
  remBtn.onclick = ()=> removeSong(song.id);
  actions.appendChild(playBtn); actions.appendChild(likeBtn); actions.appendChild(remBtn);

  wrap.appendChild(cover); wrap.appendChild(meta); wrap.appendChild(actions);
  return wrap;
}

// Practical 5: render playlist using array forEach (map/filter/reduce used elsewhere)
function renderPlaylist(items = playlist){
  if(!playlistEl) return;
  playlistEl.innerHTML = '';
  if(!items.length){ playlistEl.innerHTML = '<p class="muted">No songs in playlist. Add some!</p>'; return; }
  items.forEach(s => playlistEl.appendChild(createSongCard(s)));
}

// Practical 3: filtering by mood and searching
function renderMoodChips(){
  if(!moodChipsEl) return;
  const moods = ['All','Calm','Energetic','Focus','Romantic','Party'];
  moodChipsEl.innerHTML = '';
  moods.forEach(m => {
    const b = document.createElement('div'); b.className='chip'; b.textContent = m;
    b.onclick = ()=>{ qsa('.chip').forEach(x=>x.classList.remove('active')); b.classList.add('active');
      if(m==='All') renderPlaylist(); else renderPlaylist(playlist.filter(s=> s.mood.toLowerCase()===m.toLowerCase()));
    };
    moodChipsEl.appendChild(b);
  });
  // activate first
  const first = moodChipsEl.querySelector('.chip'); if(first) first.classList.add('active');
}

// Practical 3 & 6: search
if(searchInput){
  searchInput.addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const filtered = playlist.filter(s => (s.title+' '+s.artist+' '+s.mood).toLowerCase().includes(q));
    renderPlaylist(filtered);
  });
}

// Practical 9: save helper
function save(){ try{ localStorage.setItem('ms-playlist', JSON.stringify(playlist)); } catch(e){ console.error('Save failed', e); } }

// Practical 11: timers auto-play highlighting
// Auto-play + countdown state
let autoTimer = null;
let countdownTimer = null;
let autoIndex = 0;
let autoIntervalSec = 0;
let countdownRemaining = 0;

function updateTimerLabel(){
  if(!timerLabel) return;
  if(autoIntervalSec && countdownRemaining > 0){
    timerLabel.textContent = `Auto-play every ${autoIntervalSec}s — next in ${countdownRemaining}s`;
  } else if(autoIntervalSec){
    timerLabel.textContent = `Auto-play every ${autoIntervalSec}s`;
  } else {
    timerLabel.textContent = 'Timer: not running';
  }
}

function stopCountdown(){
  if(countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
}

function startCountdown(sec){
  stopCountdown();
  countdownRemaining = sec;
  updateTimerLabel();
  countdownTimer = setInterval(()=>{
    countdownRemaining--;
    if(countdownRemaining < 0) countdownRemaining = 0;
    updateTimerLabel();
    if(countdownRemaining === 0){
      // reset countdown for next cycle (will be advanced by autoTimer)
      countdownRemaining = sec;
    }
  }, 1000);
}

function stopAutoTimer(){ if(autoTimer){ clearInterval(autoTimer); autoTimer = null; } stopCountdown(); autoIntervalSec = 0; updateTimerLabel(); }

function startAutoTimer(sec, startAtIndex = 0){
  if(!sec || sec <= 0) return;
  // store chosen interval
  autoIntervalSec = sec;
  // normalize start index
  autoIndex = startAtIndex % (playlist.length || 1);
  if(autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(()=>{
    if(!playlist.length) return;
    // call setNowPlaying with auto flag so it doesn't restart timers
    setNowPlaying(playlist[autoIndex % playlist.length], {auto: true});
    autoIndex++;
    // reset countdown for the next tick
    countdownRemaining = autoIntervalSec;
    updateTimerLabel();
  }, sec*1000);
  // start visible countdown
  startCountdown(sec);
}

if(startTimerBtn){ startTimerBtn.addEventListener('click', ()=>{
  const s = Number(timerInput.value);
  if(!s || s<=0){ timerLabel.textContent = 'Enter seconds > 0'; return; }
  // start auto-play from beginning
  startAutoTimer(s, 0);
}); }

// Practical 7: now playing UI
function setNowPlaying(song, opts = {}){
  if(!nowTitle) return;
  nowTitle.textContent = song.title;
  nowArtist.textContent = song.artist;
  const coverEl = document.querySelector('.now .cover');
  if(coverEl){
    if(song.cover) coverEl.style.background = `url(${song.cover}) center/cover`;
    else coverEl.style.background = 'linear-gradient(90deg,var(--neon1),var(--neon2))';
  }

  // If this was a manual play action, align autoIndex and (optionally) start
  // or restart the auto-timer using the configured input value.
  try{
    const idx = playlist.findIndex(p => p.id === song.id);
    if(idx > -1){
      // set next index to following song
      autoIndex = idx + 1;

      // If this was a manual action and there's a configured interval (or user
      // typed a value into the input), (re)start the auto-timer so countdown
      // begins from this play.
      if(opts.manual){
        let sec = autoIntervalSec;
        if(!sec || sec <= 0){
          const maybe = Number(timerInput && timerInput.value);
          if(maybe && maybe > 0) sec = maybe;
        }
        if(sec && sec > 0){
          startAutoTimer(sec, autoIndex);
        }
      }
    }
  } catch(e){ /* ignore */ }

  console.log('Now playing:', song.title);
}

// Practical 3: remove
function removeSong(id){ const idx = playlist.findIndex(p=>p.id===id); if(idx>-1){ if(confirm('Remove song?')){ playlist.splice(idx,1); save(); renderPlaylist(); } } }

// Practical 5: demonstrate reduce (average title length)
function avgTitleLength(){ if(!playlist.length) return 0; return Math.round(playlist.map(s=>s.title.length).reduce((a,b)=>a+b,0)/playlist.length); }

// Practical 1: small console summary
console.log('Playlist count:', playlist.length, 'Avg title len:', avgTitleLength());

// Practical 10: export as JSON (if button exists on header shared across pages)
const exportBtn = document.querySelector('#exportBtn');
if(exportBtn){ exportBtn.addEventListener('click', ()=>{ const blob = new Blob([JSON.stringify(playlist, null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='moodsound-playlist.json'; a.click(); URL.revokeObjectURL(url); }); }

// Boot
renderMoodChips(); renderPlaylist();
