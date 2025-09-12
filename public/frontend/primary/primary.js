     // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyD1ZBKGtGBBQNPXezS-kv3DxU5BH0C4ef8",
            authDomain: "ecotech-6d533.firebaseapp.com",
            projectId: "ecotech-6d533",
            storageBucket: "ecotech-6d533.appspot.com",
            messagingSenderId: "336213804618",
            appId: "1:336213804618:web:741d2a262319f21ec0c8b3"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        
        // Store Firebase config for other pages
        localStorage.setItem('firebaseConfig', JSON.stringify(firebaseConfig));

        // Global variables
        let currentUser = null;

        // DOM Elements
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        // Update progress ring
        function updateProgressRing(percentage, ringId, textId) {
            const ring = document.getElementById(ringId);
            const text = document.getElementById(textId);
            const radius = 60;
            const circumference = 2 * Math.PI * radius;
            
            if (ring && text) {
                const offset = circumference - (percentage / 100) * circumference;
                ring.style.strokeDashoffset = offset;
                ring.setAttribute('data-percentage', percentage);
                text.textContent = percentage + '%';
            }
        }

        // Listen for progress updates
        function setupProgressListener(user) {
            if (user) {
                const progressRef = firebase.database().ref(`users/${user.uid}/progress`);
                progressRef.on('value', (snapshot) => {
                    const progress = snapshot.val() || {};
                    
                    // Update primary progress ring
                    if (progress.primary !== undefined) {
                        updateProgressRing(progress.primary, 'primaryProgressRing', 'primaryProgressText');
                    }
                });
            }
        }
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        const profileIcon = document.getElementById('profileIcon');
        const profileSection = document.getElementById('profileSection');
        const profilePicture = document.getElementById('profilePicture');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');

        // Toggle mobile menu
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Check authentication status on page load
        document.addEventListener('DOMContentLoaded', () => {
            checkAuthStatus();
            animateProgressCircles();
        });

        // Auth state observer
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || document.getElementById('signupName')?.value || 'User',
                    photoURL: user.photoURL
                };
                updateNavBar(true);
                updateProfileSection();
                setupProgressListener(user);
                // Save user data to localStorage
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                // User is signed out
                currentUser = null;
                updateNavBar(false);
                hideProfileSection();
                // Remove user data from localStorage
                localStorage.removeItem('currentUser');
            }
        });

        // Check if user data exists in localStorage on page load
        function checkAuthStatus() {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateNavBar(true);
                updateProfileSection();
            }
        }

        // Update navigation bar based on auth status
        function updateNavBar(isAuthenticated) {
            if (isAuthenticated && currentUser) {
                authButtons.style.display = 'none';
                userProfile.style.display = 'block';
                
                if (currentUser.photoURL) {
                    profileIcon.src = currentUser.photoURL;
                } else {
                    // Generate default avatar using user's name
                    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=007bff&color=fff&size=80`;
                    profileIcon.src = defaultAvatar;
                }
            } else {
                authButtons.style.display = 'flex';
                userProfile.style.display = 'none';
            }
        }

        // Update profile section
        function updateProfileSection() {
            if (currentUser) {
                profileName.textContent = currentUser.displayName;
                profileEmail.textContent = currentUser.email;
                
                if (currentUser.photoURL) {
                    profilePicture.src = currentUser.photoURL;
                } else {
                    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=007bff&color=fff&size=200`;
                    profilePicture.src = defaultAvatar;
                }
            }
        }

        // Toggle profile section visibility
        function toggleProfile() {
            if (profileSection.style.display === 'block') {
                profileSection.style.display = 'none';
            } else {
                profileSection.style.display = 'block';
            }
        }

        // Hide profile section
        function hideProfileSection() {
            profileSection.style.display = 'none';
        }

        // Modal functions
        function openLoginModal() {
            document.getElementById('loginModal').style.display = 'block';
        }

        function closeLoginModal() {
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('loginForm').reset();
        }

        function openSignupModal() {
            document.getElementById('signupModal').style.display = 'block';
        }

        function closeSignupModal() {
            document.getElementById('signupModal').style.display = 'none';
            document.getElementById('signupForm').reset();
        }

        function openForgotPasswordModal() {
            closeLoginModal();
            document.getElementById('forgotPasswordModal').style.display = 'block';
        }

        function closeForgotPasswordModal() {
            document.getElementById('forgotPasswordModal').style.display = 'none';
            document.getElementById('forgotPasswordForm').reset();
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const loginModal = document.getElementById('loginModal');
            const signupModal = document.getElementById('signupModal');
            const forgotPasswordModal = document.getElementById('forgotPasswordModal');
            
            if (event.target === loginModal) {
                closeLoginModal();
            }
            if (event.target === signupModal) {
                closeSignupModal();
            }
            if (event.target === forgotPasswordModal) {
                closeForgotPasswordModal();
            }
        }

        // Login form handler
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || 'User',
                    photoURL: user.photoURL
                };
                
                updateNavBar(true);
                updateProfileSection();
                closeLoginModal();
                showNotification('Login successful!', 'success');
            } catch (error) {
                console.error('Login error:', error);
                let errorMessage = 'An error occurred during login';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address';
                        break;
                }
                
                showNotification(errorMessage, 'error');
            }
        });

        // Signup form handler
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            // Basic validation
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long', 'error');
                return;
            }
            
            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Update user profile with name
                await user.updateProfile({
                    displayName: name
                });
                
                currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: name,
                    photoURL: user.photoURL
                };
                
                updateNavBar(true);
                updateProfileSection();
                closeSignupModal();
                showNotification('Account created successfully!', 'success');
            } catch (error) {
                console.error('Signup error:', error);
                let errorMessage = 'An error occurred during signup';
                
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already registered';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password is too weak';
                        break;
                }
                
                showNotification(errorMessage, 'error');
            }
        });

        // Forgot password form handler
        document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value;
            
            try {
                await auth.sendPasswordResetEmail(email);
                closeForgotPasswordModal();
                showNotification('Password reset email sent! Check your inbox.', 'success');
            } catch (error) {
                console.error('Password reset error:', error);
                let errorMessage = 'An error occurred while sending reset email';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address';
                        break;
                }
                
                showNotification(errorMessage, 'error');
            }
        });

        // Google OAuth login
        function loginWithGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            auth.signInWithPopup(provider)
                .then((result) => {
                    // The signed-in user info
                    const user = result.user;
                    
                    currentUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    };
                    
                    updateNavBar(true);
                    updateProfileSection();
                    closeLoginModal();
                    closeSignupModal();
                    showNotification('Login successful!', 'success');
                })
                .catch((error) => {
                    console.error('Google sign-in error:', error);
                    showNotification('An error occurred during Google sign-in', 'error');
                });
        }

        // Logout function
        async function logout() {
            try {
                await auth.signOut();
                currentUser = null;
                updateNavBar(false);
                hideProfileSection();
                showNotification('Logged out successfully', 'success');
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('An error occurred during logout', 'error');
            }
        }

        // Notification system
        function showNotification(message, type = 'info') {
            // Remove any existing notifications
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Add styles
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 3000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                word-wrap: break-word;
            `;
            
            // Add animation keyframes if not already added
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes slideOutRight {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Add to page
            document.body.appendChild(notification);
            
            // Auto-remove after 4 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutRight 0.3s ease-in';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 4000);
            
            // Allow manual dismissal by clicking
            notification.addEventListener('click', () => {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });
        }

        // Function to animate progress circles
        function animateProgressCircles() {
            const circles = document.querySelectorAll('.progress-ring__progress');
            const circumference = 2 * Math.PI * 52; // r = 52
            
            circles.forEach(circle => {
                const percentage = parseInt(circle.dataset.percentage);
                const offset = circumference - (percentage / 100) * circumference;
                
                // Set initial state
                circle.style.strokeDasharray = circumference;
                circle.style.strokeDashoffset = circumference;
                
                // Animate to final state
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 500);
            });
        }

        // Handle keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Close modals with Escape key
            if (e.key === 'Escape') {
                closeLoginModal();
                closeSignupModal();
                closeForgotPasswordModal();
            }
        });


// Initialize Firebase with config from your main app
firebase.initializeApp(JSON.parse(localStorage.getItem('firebaseConfig')));

let completedTopics = new Set();

// Update the progress bar and save to Firebase
function updateProgressBar() {
    const contents = document.querySelectorAll('.content');
    let completed = completedTopics.size;
    const percent = Math.round((completed / contents.length) * 100);
    
    const fill = document.getElementById('progress-bar-fill');
    const percentage = document.getElementById('progress-percentage');
    
    if (fill && percentage) {
        fill.style.width = percent + '%';
        percentage.textContent = percent + '%';
    }

    // Save progress to Firebase if user is logged in
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.database().ref(`users/${user.uid}/progress`).update({
            primary: percent,
            lastUpdated: new Date().toISOString()
        });
    }
}

// Load saved progress from Firebase
function loadProgress() {
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.database().ref(`users/${user.uid}/completedTopics/primary`).once('value')
            .then(snapshot => {
                const data = snapshot.val() || {};
                completedTopics.clear();
                Object.keys(data).forEach(topic => {
                    if (data[topic]) {
                        completedTopics.add(topic);
                        document.querySelector(`.content:contains('${topic}')`).classList.add('completed');
                    }
                });
                updateProgressBar();
            });
    }
}

// Handle topic completion
function handleTopicCompletion(box) {
    const topicNumber = box.textContent;
    const user = firebase.auth().currentUser;
    
    if (user) {
        if (!completedTopics.has(topicNumber)) {
            completedTopics.add(topicNumber);
            box.classList.add('completed');
            
            // Save to Firebase
            firebase.database().ref(`users/${user.uid}/completedTopics/primary/${topicNumber}`).set(true);
        }
        updateProgressBar();
    } else {
        alert('Please log in to track your progress');
    }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Style for completed boxes
    const style = document.createElement('style');
    style.textContent = `.content.completed { background: #2dce89; color: #fff; box-shadow: 0 4px 16px rgba(45,206,137,0.15), 0 1.5px 4px rgba(0,0,0,0.08); }`;
    document.head.appendChild(style);

    // Add click handlers to topics
    const contents = document.querySelectorAll('.content');
    contents.forEach(box => {
        box.addEventListener('click', () => handleTopicCompletion(box));
    });

    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            loadProgress();
        } else {
            completedTopics.clear();
            document.querySelectorAll('.content.completed').forEach(box => {
                box.classList.remove('completed');
            });
            updateProgressBar();
        }
    });
});
