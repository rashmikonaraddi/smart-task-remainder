// Supabase configuration - replace these with your project's values
const SUPABASE_URL = "https://wplcqsnjllxrglfmuuqp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbGNxc25qbGx4cmdsZm11dXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTc3MDEsImV4cCI6MjA4MjQzMzcwMX0.8dRahbmFOGVnIqKMj6ftvxOGzJjDl5dcj3KQ_w2uAHU";

// Initialize Supabase client (provided by the UMD script added in index.html)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Load tasks from the database on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    fetchQuote();
});

async function addTask() {
    let task = document.getElementById("task").value;
    let time = document.getElementById("time").value;

    if (task === "" || time === "") {
        alert("Please enter both task and time");
        return;
    }

    const addedHour = new Date().getHours();

    const { data, error } = await supabaseClient
        .from('reminders')
        .insert([{ task: task, time: time, added_hour: addedHour }])
        .select();

    if (error) {
        console.error('Supabase insert error:', error);
        alert('Could not save reminder. Check console for details.');
        return;
    }

    // Clear inputs
    document.getElementById("task").value = "";
    document.getElementById("time").value = "";

    aiSuggestion({ addedHour });
    loadTasks();
    fetchQuote();
}

async function loadTasks() {
    const { data, error } = await supabaseClient
        .from('reminders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase fetch error:', error);
        document.getElementById('taskList').innerHTML = '<li>Could not load reminders.</li>';
        return;
    }

    displayTasks(data || []);
}

function displayTasks(reminders) {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    reminders.forEach(r => {
        let li = document.createElement("li");
        // `time` may be stored as a string like "HH:MM:SS" or "HH:MM"
        li.innerText = (r.task || '') + " ⏰ " + (r.time || '');
        list.appendChild(li);
    });
}

// 🤖 AI Feature – Behavior-based suggestion
function aiSuggestion(reminder) {
    if (reminder.addedHour >= 22 || reminder.addedHour <= 5) {
        alert("AI Suggestion: You are adding tasks very late. Planning earlier can improve productivity.");
    }
}

// 🌐 API Integration – Motivational Quote API
function fetchQuote() {
    fetch("https://api.quotable.io/random")
        .then(response => response.json())
        .then(data => {
            document.getElementById("quote").innerText =
                "💡 Motivation: \"" + data.content + "\"";
        })
        .catch(error => {
            console.log("API Error:", error);
            document.getElementById("quote").innerText =
                "💡 Stay focused and keep going!";
        });
}