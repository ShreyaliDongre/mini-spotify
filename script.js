
// ================= Practical 1: Console methods & environment info =================
console.log('Moodsound loaded — Practical 1');
console.table([{app:'Moodsound',version:'1.0'}]);
console.warn('This is a demo UI only');
console.log('User agent:', navigator.userAgent);

// ================= Practical 2: Variables, ES6 features =================
const APP = 'Moodsound';
let playlist = []; // will be loaded from localStorage or empty
const recDataRaw = document.getElementById('rec-data').textContent;
const el = id => document.getElementById(id);

// ================= Practical 10: Load recommended songs from embedded JSON =================
let recommended = [];
try{ recommended = JSON.parse(recDataRaw); } catch(e){ console.error('Rec JSON parse failed', e); recommended = []; }

// ================= Practical 9: Load playlist from localStorage (persistence) =================
const saved = localStorage.getItem('ms-playlist');
if(saved){ try{ playlist = JSON.parse(saved); } catch(e){ playlist = []; } }

// ================= Practical 5: sample higher-order functions usage (map/filter/reduce) =================
const avgMoodLength = () => {
  if(!playlist.length) return 0;
  return Math.round(playlist.map(s=>s.title.length).reduce((a,b)=>a+b,0)/playlist.length);
};

// ================= Practical 7: DOM references =================
const playlistEl = el('playlist');
const recommendedEl = el('recommended');
const moodChipsEl = el('moodChips');
const nowTitle = el('nowTitle');
const nowArtist = el('nowArtist');
const timerLabel = el('timerLabel');

// ================= Practical 6: regex patterns for validation =================
const urlRe = /^(https?:\/\/).+\.(jpg|jpeg|png|gif|webp)$/i;
const nameRe = /^[\w\s\-']{2,60}$/;

// ================= Practical 4: closure example (like counter) =================
function makeLikeCounter(){ let c=0; return ()=> ++c; }
const likeCounter = makeLikeCounter();

// ================= UI Renderers (Practical 7: DOM manipulation) =================
function createSongCard(song, isRec=false){
  const wrap = document.createElement('div');
  wrap.className = isRec ? 'rec-card' : 'song-card';

  const cover = document.createElement('div'); cover.className = isRec ? 'cover' : 'song-cover';
  if(song.cover && urlRe.test(song.cover)){
    const img = document.createElement('img'); img.src = song.cover; img.alt='cover'; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover'; cover.appendChild(img);
  } else {
    // placeholder gradient
    cover.style.background = 'linear-gradient(90deg,var(--neon1),var(--neon2))';
  }

  const meta = document.createElement('div'); meta.className = isRec ? 'meta' : 'song-meta';
  const title = document.createElement('div'); title.className = isRec ? 'rec-title' : 'song-title'; title.textContent = song.title;
  const artist = document.createElement('div'); artist.className = isRec ? 'rec-artist muted small' : 'song-artist'; artist.textContent = song.artist;

  const tag = document.createElement('div'); tag.className = 'tag-chip'; tag.textContent = song.mood;

  meta.appendChild(title); meta.appendChild(artist);

  const actions = document.createElement('div'); actions.className = isRec ? 'rec-actions' : 'song-actions';
  if(isRec){
    const addBtn = document.createElement('button'); addBtn.className='btn'; addBtn.textContent='Add';
    addBtn.onclick = ()=>{ addToPlaylist(song); };
    actions.appendChild(addBtn);
  } else {
    const playBtn = document.createElement('button'); playBtn.className='btn'; playBtn.textContent='Play';
    playBtn.onclick = ()=>{ setNowPlaying(song); console.log('Play clicked', song.title); };
    const likeBtn = document.createElement('button'); likeBtn.className='btn'; likeBtn.textContent='♡';
    likeBtn.onclick = ()=>{ console.log('Likes:', likeCounter()); };
    const remBtn = document.createElement('button'); remBtn.className='btn'; remBtn.textContent='Remove';
    remBtn.onclick = ()=>{ removeFromPlaylist(song.id); };
    actions.appendChild(playBtn); actions.appendChild(likeBtn); actions.appendChild(remBtn);
  }

  if(isRec){ wrap.appendChild(cover); wrap.appendChild(meta); wrap.appendChild(tag); wrap.appendChild(actions); }
  else { wrap.appendChild(cover); wrap.appendChild(meta); meta.appendChild(tag); wrap.appendChild(actions); }

  return wrap;
}

function renderPlaylist(items=playlist){ playlistEl.innerHTML=''; if(!items.length){ playlistEl.innerHTML='<p class="muted">No songs yet — add a few!</p>'; return; }
  items.forEach(s=>{ const c = createSongCard(s,false); c.classList.add('song-card'); playlistEl.appendChild(c); });
}

function renderRecommended(){ recommendedEl.innerHTML=''; recommended.forEach(r=>{ recommendedEl.appendChild(createSongCard(r,true)); }); }

function renderMoodChips(){ const moods = ['All','Calm','Energetic','Focus','Romantic','Party']; moodChipsEl.innerHTML=''; moods.forEach(m=>{ const b = document.createElement('div'); b.className='chip'; b.textContent=m; b.onclick = ()=>{ document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active')); b.classList.add('active'); filterByMood(m); }; moodChipsEl.appendChild(b); }); document.querySelectorAll('.chip')[0].classList.add('active'); }

// ================= Practical 3: conditionals/loops & search (string method) =================
function filterByMood(mood){ if(mood==='All'){ renderPlaylist(); return; } const filtered = playlist.filter(s=>s.mood.toLowerCase()===mood.toLowerCase()); renderPlaylist(filtered); }

el('search').addEventListener('input', (e)=>{ const q = e.target.value.trim().toLowerCase(); const filtered = playlist.filter(s=> (s.title+' '+s.artist+' '+s.mood).toLowerCase().includes(q)); renderPlaylist(filtered); });

// ================= Practical 8: Form handling & validation (regex) =================
el('addSongForm').addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const title = el('songTitle').value.trim();
  const artist = el('songArtist').value.trim();
  const mood = el('songMood').value;
  const cover = el('coverUrl').value.trim();
  try{
    if(!nameRe.test(title)) throw new Error('Enter a valid title (2-60 chars)');
    if(!nameRe.test(artist)) throw new Error('Enter a valid artist name');
    if(!mood) throw new Error('Select a mood');
    if(cover && !urlRe.test(cover)) throw new Error('Cover must be a direct image URL (jpg/png/gif)');
    const id = Date.now();
    const song = {id,title,artist,mood,cover};
    playlist.push(song);
    savePlaylist(); renderPlaylist(); el('formMsg').textContent='Added to playlist';
    el('addSongForm').reset();
  } catch(err){ el('formMsg').textContent = err.message; }
});

el('clearForm').addEventListener('click', ()=>{ el('addSongForm').reset(); el('formMsg').textContent=''; });

// ================= Practical 9: Save/load helpers =================
function savePlaylist(){ try{ localStorage.setItem('ms-playlist', JSON.stringify(playlist)); } catch(e){ console.error('Save failed', e); } }

function addToPlaylist(song){ const copy = Object.assign({},song,{id:Date.now()}); playlist.push(copy); savePlaylist(); renderPlaylist(); }
function removeFromPlaylist(id){ const i = playlist.findIndex(s=>s.id===id); if(i>-1){ if(confirm('Remove song?')){ playlist.splice(i,1); savePlaylist(); renderPlaylist(); } } }

// ================= Practical 11: Timers (auto-play highlight) =================
let autoTimer = null; let autoIndex = 0;
el('startTimer').addEventListener('click', ()=>{ const s = Number(el('timerInput').value); if(!s || s<=0){ el('timerLabel').textContent='Enter seconds > 0'; return; } clearInterval(autoTimer); autoIndex = 0; el('timerLabel').textContent = `Auto-play every ${s}s`; autoTimer = setInterval(()=>{ if(!playlist.length) return; setNowPlaying(playlist[autoIndex%playlist.length]); autoIndex++; }, s*1000); });

// ================= Practical 7: Now playing UI setter =================
function setNowPlaying(song){ nowTitle.textContent = song.title; nowArtist.textContent = song.artist; const coverEl = document.querySelector('.now .cover'); if(song.cover && urlRe.test(song.cover)){ coverEl.style.background = `url(${song.cover}) center/cover`; } else { coverEl.style.background = 'linear-gradient(90deg,var(--neon1),var(--neon2))'; } console.log('Now playing (UI):', song.title); }

// ================= Practical 2: ES6 destructuring default params demo =================
function openSong({title='Unknown',artist='Unknown',id=null} = {}){ console.log(`Open ${title} by ${artist}`); }

// ================= Practical 6: string processing example =================
function tagWords(){ const all = (playlist.map(p=>p.mood).join(' ')+ ' ' + recommended.map(r=>r.mood).join(' ')).toLowerCase(); return (all.match(/\w+/g)||[]); }

// ================= Practical 1: show env info in console and small UI bit =================
el('nowPlaying').title = navigator.userAgent || '';

// ================= Practical 10: Export playlist JSON =================
el('exportBtn').addEventListener('click', ()=>{ const blob = new Blob([JSON.stringify(playlist, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'moodsound-playlist.json'; a.click(); URL.revokeObjectURL(url); });

// ================= Bootup: render everything =================
renderRecommended(); renderMoodChips(); renderPlaylist(); console.log('Practicals covered: 1..11');

// Extra: theme toggle (Practical 9)
const themeToggle = el('themeToggle'); const savedTheme = localStorage.getItem('ms-theme') || 'dark';
if(savedTheme==='light') document.documentElement.setAttribute('data-theme','light');
themeToggle.addEventListener('click', ()=>{ const cur = document.documentElement.getAttribute('data-theme')==='light' ? 'light' : 'dark'; const next = cur==='light' ? 'dark' : 'light'; if(next==='light') document.documentElement.setAttribute('data-theme','light'); else document.documentElement.removeAttribute('data-theme'); localStorage.setItem('ms-theme', next); });
