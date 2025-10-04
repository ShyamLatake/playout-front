import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBulUdM7Y9LGEXoLnOmK55i3DmOu_AGEnY",
  authDomain: "playnearby-a2cfe.firebaseapp.com",
  projectId: "playnearby-a2cfe",
  storageBucket: "playnearby-a2cfe.firebasestorage.app",
  messagingSenderId: "780978790228",
  appId: "1:780978790228:web:c3e3d3d12fb0db4045f2c1",
  measurementId: "G-56SM9ER8JV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;