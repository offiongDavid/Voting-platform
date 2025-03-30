// Flag to track if the user has already voted
let hasVoted = false;

function handleVote(button) {
    // Check if the user has already voted
    if (hasVoted) {
        return; // Exit the function if the user has already voted
    }

    // Set the flag to true, indicating the user has voted
    hasVoted = true;

    // Find the closest card container (parent)
    const card = button.closest('.card');

    // Get the candidate's name from the card title
    const candidateName = card.querySelector('.card-title').textContent;

    // Create the popup container
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px'; // Increased padding
    popup.style.backgroundColor = '#ffffff';
    popup.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.15)'; // Slightly stronger shadow
    popup.style.borderRadius = '12px'; // Rounded corners
    popup.style.textAlign = 'center';
    popup.style.zIndex = '2000';
    popup.style.maxWidth = '400px'; // Limit the max width
    popup.style.width = '100%'; // Ensure it adjusts well for smaller screens

    // Add content to the popup
    popup.innerHTML = `
        <img src="/Images/check.png" width="50" style="margin-bottom: 20px;"> <!-- Larger check image -->
        <h3 style="font-size: 24px; margin-bottom: 10px;">Thanks for your vote!</h3>
        <p style="font-size: 18px;">You voted for <strong>${candidateName}</strong></p>
    `;

    // Append the popup to the body
    document.body.appendChild(popup);

    // Disable all vote buttons
    const allVoteButtons = document.querySelectorAll('.btn-primary');
    allVoteButtons.forEach((btn) => {
        btn.disabled = true; // Disable the button
        btn.style.backgroundColor = 'gray'; // Optional: Change the button color
        btn.style.cursor = 'not-allowed'; // Optional: Change cursor to indicate it's disabled
    });

    // Automatically remove the popup after 3 seconds
    setTimeout(() => {
        popup.remove();
    }, 3000);
}


function openPostPopup() {
    document.getElementById('applyPostPopup').style.display = 'flex';
}

function closePostPopup() {
    document.getElementById('applyPostPopup').style.display = 'none';
}

function submitPost() {
    const name = document.getElementById('name').value;
    const manifesto = document.getElementById('manifesto').value;
    const imageFile = document.getElementById('image').files[0];

    if (!name || !manifesto || !imageFile) {
        alert("Please fill all fields and upload an image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imgSrc = e.target.result;

        const newCandidate = {
            name: name,
            manifesto: manifesto,
            imgSrc: imgSrc
        };

        let candidates = JSON.parse(localStorage.getItem('candidates')) || [];
        candidates.push(newCandidate);
        localStorage.setItem('candidates', JSON.stringify(candidates));

        createCandidateCard(newCandidate);

        closePostPopup();
        document.getElementById('name').value = '';
        document.getElementById('manifesto').value = '';
        document.getElementById('image').value = '';
    }

    reader.readAsDataURL(imageFile);
}

function loadCandidates() {
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    candidates.forEach(candidate => {
        createCandidateCard(candidate);
    });
}

function createCandidateCard(candidate) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <img class="card-img-bottom" src="${candidate.imgSrc}" alt="Candidate Image" style="width: 100%; object-fit: cover; height: 200px;">
        <div class="card-body">
            <h4 class="card-title">${candidate.name}</h4>
            <p class="card-text">${candidate.manifesto}</p>
            <div class="">
                <a href="#" class="btn btn-primary">See Profile</a>
                <a href="#" class="btn btn-primary">Vote</a>
            </div>
            <button class="delete-btn" onclick="deletePost(this)">🗑️</button>
        </div>
    `;
    document.querySelector('.candidate-container').appendChild(card);
}

function deletePost(button) {
    const card = button.closest('.card');
    const candidateName = card.querySelector('.card-title').textContent;

    let candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    candidates = candidates.filter(candidate => candidate.name !== candidateName);
    localStorage.setItem('candidates', JSON.stringify(candidates));

    card.remove();
}

window.onload = loadCandidates;