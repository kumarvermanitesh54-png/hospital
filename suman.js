// Data store karne ke liye array (Local Storage se uthayenge)
let patients = JSON.parse(localStorage.getItem('patients')) || [];
let editMode = false;
let editId = null;

// Elements select karna
const patientForm = document.getElementById('patientForm');
const addBtn = document.getElementById('add-patient');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const mainContent = document.querySelector('.main-content');
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.btn-search');

// --- 1. Form Show/Hide ---
addBtn.onclick = () => {
    editMode = false;
    patientForm.reset();
    patientForm.style.display = 'block';
    saveBtn.innerText = "Save Patient";
};

cancelBtn.onclick = () => {
    patientForm.style.display = 'none';
};

// --- 2. Save Data ---
saveBtn.onclick = () => {
    const name = document.getElementById('fullName').value;
    const age = document.getElementById('age').value;
    const contact = document.getElementById('contact').value;

    if(!name || !age || !contact) return alert("Please fill all details");

    const patientObj = {
        id: editMode ? editId : "P" + Date.now().toString().slice(-4),
        name: name,
        age: age,
        gender: document.getElementById('gender').value,
        blood: document.getElementById('blood').value,
        contact: contact,
        notes: document.getElementById('medicalNotes').value
    };

    if(editMode) {
        patients = patients.map(p => p.id === editId ? patientObj : p);
    } else {
        patients.push(patientObj);
    }

    localStorage.setItem('patients', JSON.stringify(patients));
    patientForm.style.display = 'none';
    displayPatients(patients);
};

// --- 3. Display Cards ---
function displayPatients(data) {
    // Purane cards delete karke naye render karna
    document.querySelectorAll('.card').forEach(c => c.remove());

    data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.display = 'block'; // Ensure visibility
        card.innerHTML = `
            <div class="card-header">
                <h1>${p.name}</h1>
                <div class="card-actions">
                    <button onclick="editPatient('${p.id}')">Edit</button>
                    <button onclick="deletePatient('${p.id}')">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <p><strong>ID:</strong> ${p.id}</p>
                <p><strong>Age:</strong> ${p.age}</p>
                <p><strong>Gender:</strong> ${p.gender}</p>
                <p><strong>Phone:</strong> ${p.contact}</p>
                <div class="notes-section">
                    <span>Medical Notes</span>
                    <p>${p.notes}</p>
                </div>
            </div>`;
        mainContent.appendChild(card);
    });
}

// --- 4. Edit & Delete (Global Functions) ---
window.deletePatient = (id) => {
    patients = patients.filter(p => p.id !== id);
    localStorage.setItem('patients', JSON.stringify(patients));
    displayPatients(patients);
};

window.editPatient = (id) => {
    const p = patients.find(ptr => ptr.id === id);
    document.getElementById('fullName').value = p.name;
    document.getElementById('age').value = p.age;
    document.getElementById('contact').value = p.contact;
    document.getElementById('medicalNotes').value = p.notes;
    
    editMode = true;
    editId = id;
    patientForm.style.display = 'block';
    saveBtn.innerText = "Update Data";
};

// --- 5. Search ---
searchBtn.onclick = () => {
    const term = searchInput.value.toLowerCase();
    const filtered = patients.filter(p => p.name.toLowerCase().includes(term) || p.id.includes(term));
    displayPatients(filtered);
};

// Initial Load
displayPatients(patients);