let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
let currentJob = null;
let timeEntries = JSON.parse(localStorage.getItem('timeEntries')) || [];

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('fr-FR', options);
    const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('date-time').innerText = `${dateString} ${timeString}`;
}

function createJob() {
    const jobName = prompt("Nom du travail:");
    const jobColor = prompt("Couleur du travail:");
    const job = { name: jobName, color: jobColor, rounding: 0 };
    jobs.push(job);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    displayJobs();
}

function displayJobs() {
    const jobList = document.getElementById('jobs');
    jobList.innerHTML = '';
    jobs.forEach((job, index) => {
        const li = document.createElement('li');
        li.innerText = job.name;
        li.style.backgroundColor = job.color;
        li.onclick = () => selectJob(index);
        jobList.appendChild(li);
    });
}

function selectJob(index) {
    currentJob = jobs[index];
    localStorage.setItem('currentJob', JSON.stringify(currentJob));
    window.location.href = 'time_tracker.html';
}

function clockInOut() {
    const now = new Date();
    timeEntries.push({ time: now, type: 'clock' });
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    displayTimeEntries();
}

function addPreviousTime() {
    const timeString = prompt("Entrez l'heure au format HH:MM:SS");
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const now = new Date();
    const previousTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    timeEntries.push({ time: previousTime, type: 'manual' });
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    displayTimeEntries();
}

function displayTimeEntries() {
    const timeEntriesList = document.getElementById('time-entries');
    timeEntriesList.innerHTML = '';
    timeEntries.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = entry.time.toLocaleTimeString('fr-FR');
        timeEntriesList.appendChild(li);
    });
    updateWorkTime();
}

function updateWorkTime() {
    const today = new Date().toDateString();
    const todayEntries = timeEntries.filter(entry => entry.time.toDateString() === today);
    let totalTime = 0;
    let lastEntryTime = 0;

    todayEntries.forEach((entry, index) => {
        if (index % 2 === 0) {
            lastEntryTime = entry.time.getTime();
        } else {
            totalTime += (entry.time.getTime() - lastEntryTime) / 1000;
        }
    });

    document.getElementById('today-work-time').innerText = formatTime(totalTime);
    document.getElementById('last-work-time').innerText = formatTime(totalTime % 3600);
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function loadJobDetails() {
    currentJob = JSON.parse(localStorage.getItem('currentJob'));
    if (currentJob) {
        document.getElementById('selected-job-name').innerText = currentJob.name;
        displayTimeEntries();
    }
}

setInterval(updateDateTime, 1000);
updateDateTime();
displayJobs();
loadJobDetails();
