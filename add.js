
// Practical 1: console info
console.log('Add page loaded — Practical 1');

// Practical 2: ES6 features
const el = id => document.getElementById(id);

// Practical 6: regex for validation
const urlRe = /^(https?:\/\/).+\.(jpg|jpeg|png|gif|webp)$/i;
const nameRe = /^[\w\s\-']{2,60}$/;

// Practical 7: DOM refs
const addForm = el('addSongForm');
const formMsg = el('formMsg');

// Practical 9: load existing playlist
let playlist = [];
try{ playlist = JSON.parse(localStorage.getItem('ms-playlist')||'[]'); } catch(e){ playlist = []; }

// Practical 8 & 4: form handling with validation + try/catch error handling
if(addForm){
  addForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const title = el('songTitle').value.trim();
    const artist = el('songArtist').value.trim();
    const mood = el('songMood').value;
    const cover = el('coverUrl').value.trim();
    try{
      if(!nameRe.test(title)) throw new Error('Invalid title (2-60 chars)');
      if(!nameRe.test(artist)) throw new Error('Invalid artist name');
      if(!mood) throw new Error('Select a mood');
      if(cover && !urlRe.test(cover)) throw new Error('Cover must be a direct image URL');

      const song = { id: Date.now(), title, artist, mood, cover };
      playlist.push(song);
      localStorage.setItem('ms-playlist', JSON.stringify(playlist)); // Practical 9
      formMsg.textContent = 'Song added to playlist!';
      addForm.reset();
    } catch(err){ formMsg.textContent = err.message; }
  });
}

// Practical 11: optional small timer to focus while adding (example)
let addTimer = null; const addTimerBtn = document.getElementById('startTimer');
if(addTimerBtn){ addTimerBtn.addEventListener('click', ()=>{ const s = Number(document.getElementById('timerInput').value)||0; if(s<=0) return alert('Enter seconds'); let sec=s; addTimer = setInterval(()=>{ sec--; if(sec<=0){ clearInterval(addTimer); alert('Timer finished'); } },1000); }); }

// Practical 1: confirm existence of playlist
console.log('Playlist length now:', playlist.length);

/* ============ MODAL OPEN / CLOSE ============ */

const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');

// OPEN the modal
if (openModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');   // Show modal
  });
}

// CLOSE the modal
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');      // Hide modal
  });
}

// Close when user clicks OUTSIDE the modal content
// Practical 11: event delegation
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});
