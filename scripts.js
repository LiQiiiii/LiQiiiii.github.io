// Global variables
let allPublications = [];
let showingSelectedPreprints = true;
let showingSelectedPublications = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load publications data
  loadPublications();
  
  // Initialize animation delays for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Add event listener for publication toggle button
  const togglePublicationsButton = document.getElementById('toggle-publications');
  if (togglePublicationsButton) {
    togglePublicationsButton.addEventListener('click', togglePublications);
  }

  // Add event listener for preprint toggle button
  const togglePreprintsButton = document.getElementById('toggle-preprints');
  if (togglePreprintsButton) {
    togglePreprintsButton.addEventListener('click', togglePreprints);
  }
});

// Load publications from JSON file
function loadPublications() {
  fetch('publications.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Publications loaded successfully:", data);
      allPublications = data.publications;

      renderPreprints(true);
      renderPublications(true);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      displayFallbackPublications();
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const preprintsContainer = document.getElementById('preprints-container');
  if (preprintsContainer) {
    preprintsContainer.innerHTML = `Error loading preprints.`;
  }

  const publicationsContainer = document.getElementById('publications-container');
  if (publicationsContainer) {
    publicationsContainer.innerHTML = `Error loading publications.`;
  }
}

// Toggle between showing all or selected preprints
function togglePreprints() {
  showingSelectedPreprints = !showingSelectedPreprints;
  renderPreprints(showingSelectedPreprints);

  const toggleButton = document.getElementById('toggle-preprints');
  if (toggleButton) {
    toggleButton.textContent = showingSelectedPreprints ? 'Show All' : 'Show Selected';
  }

  const preprintsHeader = document.querySelector('#preprints .publications-header h2');
  if (preprintsHeader) {
    preprintsHeader.textContent = showingSelectedPreprints ? 'Selected Preprints' : 'All Preprints';
  }
}

// Toggle between showing all or selected publications
function togglePublications() {
  showingSelectedPublications = !showingSelectedPublications;
  renderPublications(showingSelectedPublications);
  
  const toggleButton = document.getElementById('toggle-publications');
  if (toggleButton) {
    toggleButton.textContent = showingSelectedPublications ? 'Show All' : 'Show Selected';
  }

  const toggleHeader = document.getElementById('toggle-header');
  if (toggleHeader) {
    toggleHeader.textContent = showingSelectedPublications ? 'Selected Publications' : 'All Publications';
  }
}

// Render preprints
function renderPreprints(selectedOnly) {
  const preprintsContainer = document.getElementById('preprints-container');
  if (!preprintsContainer) return;

  preprintsContainer.innerHTML = '';

  let preprintsToShow = allPublications.filter(publication =>
    publication.type === 'preprint'
  );

  if (selectedOnly) {
    preprintsToShow = preprintsToShow.filter(publication => publication.selected === 1);
  }

  preprintsToShow.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    preprintsContainer.appendChild(pubElement);
  });
}

// Render accepted publications
function renderPublications(selectedOnly) {
  const publicationsContainer = document.getElementById('publications-container');
  if (!publicationsContainer) return;

  publicationsContainer.innerHTML = '';

  let publicationsToShow = allPublications.filter(publication =>
    publication.type === 'publication'
  );

  if (selectedOnly) {
    publicationsToShow = publicationsToShow.filter(publication => publication.selected === 1);
  }

  publicationsToShow.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    publicationsContainer.appendChild(pubElement);
  });
}

// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';
  
  // Create thumbnail
  const thumbnail = document.createElement('div');
  thumbnail.className = 'pub-thumbnail';
  thumbnail.onclick = () => openModal(publication.thumbnail);
  
  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = publication.thumbnail;
  thumbnailImg.alt = `${publication.title} thumbnail`;
  thumbnail.appendChild(thumbnailImg);
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'pub-content';
  
  // Add title
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);
  
  // Add authors with highlight
  const authors = document.createElement('div');
  authors.className = 'pub-authors';
  
  let authorsHTML = '';
  publication.authors.forEach((author, index) => {
    if (author.includes('Qi Li')) {
      authorsHTML += `<span class="highlight-name">${author}</span>`;
    } else {
      authorsHTML += author;
    }
    
    if (index < publication.authors.length - 1) {
      authorsHTML += ', ';
    }
  });
  
  authors.innerHTML = authorsHTML;
  content.appendChild(authors);
  
  // Add venue with award if present
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';
  
  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);
  
  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }
  
  content.appendChild(venueContainer);
  
  // Add links if they exist
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';
    
    if (publication.links.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.href = publication.links.pdf;
      pdfLink.textContent = '[PDF]';
      pdfLink.target = '_blank';
      pdfLink.rel = 'noopener noreferrer';
      links.appendChild(pdfLink);
    }
    
    if (publication.links.code) {
      const codeLink = document.createElement('a');
      codeLink.href = publication.links.code;
      codeLink.textContent = '[Code]';
      codeLink.target = '_blank';
      codeLink.rel = 'noopener noreferrer';
      links.appendChild(codeLink);
    }
    
    if (publication.links.project) {
      const projectLink = document.createElement('a');
      projectLink.href = publication.links.project;
      projectLink.textContent = '[Project Page]';
      projectLink.target = '_blank';
      projectLink.rel = 'noopener noreferrer';
      links.appendChild(projectLink);
    }
    
    content.appendChild(links);
  }
  
  pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);
  
  return pubItem;
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
};
