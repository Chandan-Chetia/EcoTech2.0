// Get DOM elements
const progressBarFill = document.getElementById('progress-bar-fill');
const progressPercentage = document.getElementById('progress-percentage');
const topicLinks = document.querySelectorAll('.topic_link');

// Initialize progress from localStorage or set to 0
let currentProgress = parseInt(localStorage.getItem('primaryProgress')) || 0;

// Update progress bar UI
function updateProgressBar() {
    progressBarFill.style.width = `${currentProgress}%`;
    progressPercentage.textContent = `${currentProgress}%`;
}

// Initial progress bar update
updateProgressBar();

// Mark completed topics from localStorage
function markCompletedTopics() {
    const completedTopics = JSON.parse(localStorage.getItem('completedTopics')) || [];
    completedTopics.forEach(topicNumber => {
        document.querySelectorAll('.content').forEach(content => {
            if (content.textContent === topicNumber) {
                content.classList.add('completed');
            }
        });
    });
}

// Add click event listeners to all topic links
topicLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent immediate navigation
        
        const topicContent = link.querySelector('.content');
        const topicNumber = topicContent.textContent;
        const href = link.getAttribute('href');
        
        // Check if topic is already completed
        const completedTopics = JSON.parse(localStorage.getItem('completedTopics')) || [];
        if (!completedTopics.includes(topicNumber)) {
            // Add to completed topics
            completedTopics.push(topicNumber);
            localStorage.setItem('completedTopics', JSON.stringify(completedTopics));

            // Increment progress by 8.34%
            currentProgress = Math.min(currentProgress + 8.34, 100); // Cap at 100%
            localStorage.setItem('primaryProgress', currentProgress.toString());
            
            // Update UI
            topicContent.classList.add('completed');
            updateProgressBar();

            // Add animation class to progress bar
            progressBarFill.classList.add('progress-animation');
            setTimeout(() => {
                progressBarFill.classList.remove('progress-animation');
            }, 500);
        }
        
        // Navigate to topic page after a short delay
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
});

// Add styles for completed topics and progress animation
const style = document.createElement('style');
style.textContent = `
    .content.completed {
        background-color: #2dce89 !important;
        color: white !important;
        box-shadow: 0 4px 16px rgba(45,206,137,0.15), 0 1.5px 4px rgba(0,0,0,0.08) !important;
        transition: all 0.3s ease;
    }

    .progress-animation {
        animation: pulse 0.5s ease-in-out;
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize completed topics on page load
markCompletedTopics();

// Add reset button (for testing purposes)
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Progress';
resetButton.style.cssText = `
    margin: 20px auto;
    display: block;
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;
resetButton.onclick = function() {
    localStorage.removeItem('primaryProgress');
    localStorage.removeItem('completedTopics');
    currentProgress = 0;
    updateProgressBar();
    document.querySelectorAll('.content.completed').forEach(el => {
        el.classList.remove('completed');
    });
};
document.querySelector('.progress-bar-container').after(resetButton);