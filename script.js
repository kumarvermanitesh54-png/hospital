document.addEventListener('DOMContentLoaded', () => {
    // Elements select karein
    const addNewBtn = document.querySelector('.btn-add-new');
    const patientForm = document.getElementById('patientForm');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const searchBtn = document.querySelector('.btn-search');
    const searchInput = document.querySelector('.search-box input');
    const doctorContainer = document.getElementById('doctorContainer');

    // 1. ADD NEW: Form show karne ke liye
    addNewBtn.addEventListener('click', () => {
        patientForm.style.display = 'block';
        patientForm.reset();
        document.getElementById('patientId').value = ''; 
    });

    // 2. CANCEL: Form hide karne ke liye
    cancelBtn.addEventListener('click', () => {
        patientForm.style.display = 'none';
    });

    // 3. SAVE: Card add ya update karne ke liye
    saveBtn.addEventListener('click', () => {
        const id = document.getElementById('patientId').value;
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const specialty = document.getElementById('spec').value;
        const contact = document.getElementById('contact').value;

        if (name === "" || email === "") {
            alert("Please fill name and email!");
            return;
        }

        if (id !== "") {
            // Edit Mode: Purane card ko update karein
            const card = document.querySelector(`.card[data-id="${id}"]`);
            if (card) {
                card.querySelector('h1').textContent = "Dr. " + name;
                card.querySelector('.c-email').textContent = email;
                card.querySelector('.c-spec').textContent = specialty;
                card.querySelector('.c-contact').textContent = contact;
            }
        } else {
            // New Mode: Naya card banayein
            const newId = Date.now().toString();
            const cardHTML = `
                <div class="card" data-id="${newId}">
                    <div class="card-header">
                        <h1>Dr. ${name}</h1>
                        <div class="card-actions">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <p><strong>Email: </strong><span class="c-email">${email}</span></p>
                        <p><strong>Specialties: </strong><span class="c-spec">${specialty}</span></p>
                        <p><strong>Contact: </strong><span class="c-contact">${contact}</span></p>
                    </div>
                </div>`;
            
            // Isse naya card hamesha grid container ke andar jayega (Width problem fix)
            doctorContainer.insertAdjacentHTML('beforeend', cardHTML);
            
            // Naye card par buttons activate karein
            const lastCard = doctorContainer.lastElementChild;
            attachEvents(lastCard);
        }

        patientForm.style.display = 'none';
        updateDoctorCount();
    });

    // 4. SEARCH: Naam se filter karein
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const drName = card.querySelector('h1').textContent.toLowerCase();
            card.style.display = drName.includes(query) ? "block" : "none";
        });
    });

    // Function: Buttons ke liye logic
    function attachEvents(card) {
        // Delete Button
        card.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm("Kya aap ise delete karna chahte hain?")) {
                card.remove();
                updateDoctorCount();
            }
        });

        // Edit Button
        card.querySelector('.edit-btn').addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            document.getElementById('patientId').value = id;
            document.getElementById('fullName').value = card.querySelector('h1').textContent.replace('Dr. ', '');
            document.getElementById('email').value = card.querySelector('.c-email').textContent;
            document.getElementById('spec').value = card.querySelector('.c-spec').textContent;
            document.getElementById('contact').value = card.querySelector('.c-contact').textContent;

            patientForm.style.display = 'block';
            window.scrollTo(0, 0);
        });
    }

    // Function: Count update karne ke liye
    function updateDoctorCount() {
        const count = document.querySelectorAll('.card').length;
        const countDisplay = document.querySelector('.list-header h3');
        if (countDisplay) {
            countDisplay.textContent = `All Doctor (${count})`;
        }
    }

    // Static cards ko activate karein
    document.querySelectorAll('.card').forEach(card => {
        attachEvents(card);
    });
});