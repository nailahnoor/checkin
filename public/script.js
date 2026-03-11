// ----- CONFIG -----
const API_KEY = window.NEXT_PUBLIC_GOOGLE_SHEET_API_KEY; // .env.local key

const NAMES_SHEET_ID = '1pHJlG4kTheQp8oeU75O7WFh8RI7do2rSlxDA6iaAHBk';
const NAMES_RANGE = 'alphabetized registration names!A2:A1000';

const STATUS_SHEET_ID = '1QzeebnUOcWP0FTIhoVrKKR-pAayWlu5FsmThdKnbI7E';
const STATUS_RANGE = 'active member qualification!A1:Z1000';

// ----- ELEMENTS -----
const input = document.getElementById('nameInput');
const suggestions = document.getElementById('suggestions');
const checkBtn = document.getElementById('checkBtn');
const statusDiv = document.getElementById('statusMsg');
const errorDiv = document.getElementById('nameError');

// ----- DATA -----
let names = [];
let statusData = [];
let activeIndex = -1;

// ----- FETCH NAMES -----
async function fetchNames() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${NAMES_SHEET_ID}/values/${encodeURIComponent(NAMES_RANGE)}?key=${API_KEY}`
    );
    const data = await res.json();
    if (data.values) {
      names = data.values.flat().filter(Boolean);
    }
  } catch (err) {
    console.error('Error fetching names:', err);
  }
}

// ----- FETCH STATUS DATA -----
async function fetchStatusData() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${STATUS_SHEET_ID}/values/${encodeURIComponent(STATUS_RANGE)}?key=${API_KEY}`
    );
    const data = await res.json();
    if (data.values) statusData = data.values;
  } catch (err) {
    console.error('Error fetching status data:', err);
  }
}

// Run fetches on page load
fetchNames();
fetchStatusData();

// ----- AUTOCOMPLETE -----
input.addEventListener('input', () => {
  const value = input.value.toLowerCase().trim();
  suggestions.innerHTML = '';
  activeIndex = -1;

  if (!value) {
    suggestions.style.display = 'none';
    return;
  }

  // startsWith matches first, then includes
  const startMatches = names.filter(n => n.toLowerCase().startsWith(value));
  const containsMatches = names.filter(
    n => n.toLowerCase().includes(value) && !n.toLowerCase().startsWith(value)
  );

  const matches = [...startMatches, ...containsMatches].slice(0, 10);

  if (!matches.length) {
    suggestions.style.display = 'none';
    return;
  }

  matches.forEach((name, index) => {
    const div = document.createElement('div');
    div.textContent = name;
    div.addEventListener('click', () => {
      input.value = name;
      suggestions.style.display = 'none';
    });
    suggestions.appendChild(div);
  });

  suggestions.style.display = 'block';
});

// ----- KEYBOARD NAVIGATION -----
input.addEventListener('keydown', e => {
  const items = suggestions.querySelectorAll('div');
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex++;
    if (activeIndex >= items.length) activeIndex = 0;
    highlight(items);
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex--;
    if (activeIndex < 0) activeIndex = items.length - 1;
    highlight(items);
  }

  if (e.key === 'Enter') {
    if (activeIndex > -1) {
      input.value = items[activeIndex].textContent;
      suggestions.style.display = 'none';
      activeIndex = -1;
    }
  }
});

function highlight(items) {
  items.forEach(i => (i.style.background = ''));
  if (items[activeIndex]) items[activeIndex].style.background = '#eee';
}

// ----- CLOSE DROPDOWN -----
document.addEventListener('click', e => {
  if (!e.target.closest('.input-wrap')) {
    suggestions.style.display = 'none';
  }
});

// ----- CHECK STATUS -----
checkBtn.addEventListener('click', () => {
  const name = input.value.trim();
  statusDiv.style.display = 'none';
  errorDiv.style.display = 'none';

  if (!name) {
    errorDiv.textContent = 'Please enter your name.';
    errorDiv.style.display = 'block';
    return;
  }

  if (!statusData.length) {
    errorDiv.textContent = 'Data not loaded yet.';
    errorDiv.style.display = 'block';
    return;
  }

  const headerRow = statusData[0]; // months string is here
  const dataRows = statusData.slice(1);

  const row = dataRows.find(r => r[0] && r[0].toLowerCase() === name.toLowerCase());

  if (!row) {
    errorDiv.textContent = 'Name not found.';
    errorDiv.style.display = 'block';
    return;
  }

  const avgClasses = Number(row[2] || 0).toFixed(2);
  const statusRaw = (row[3] || '').toUpperCase();
  const status = statusRaw === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
  const active = status === 'ACTIVE';

  // --- Format months with "and" before the last ---
  let monthsStr = (headerRow[0] || '').trim();
  let monthsArr = monthsStr.split(',').map(m => m.trim());

  if (monthsArr.length > 1) {
    const last = monthsArr.pop();
    monthsStr = monthsArr.join(', ') + ', and ' + last;
  }

  statusDiv.textContent = `your status is ${status}. you averaged ${avgClasses} classes/month between ${monthsStr}.`;
  statusDiv.className = `status ${active ? 'active' : 'inactive'}`;
  statusDiv.style.display = 'block';
});

