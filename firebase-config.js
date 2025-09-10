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
        // Save user data to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        // User is signed out
        currentUser = null;
        updateNavBar(false);
        // Remove user data from localStorage
        localStorage.removeItem('currentUser');
    }
});

// Check if user data exists in localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavBar(true);
    }
});
