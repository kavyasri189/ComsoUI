

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyA4OT6hbcDaulMHwBx5eLgOuSIh4GyvurQ",
    authDomain: "radicalai-4.firebaseapp.com",
    projectId: "radicalai-4",
    storageBucket: "radicalai-4.appspot.com",
    messagingSenderId: "246747763466",
    appId: "1:246747763466:web:6b90b6b535a7204e18e0f3",
    measurementId: "G-PRT3K6W75C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const messaging = getMessaging(app);

//const analytics = getAnalytics(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission);
    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: "BBkTks1SIZRNnASsDbZb39fOQ_h0V7FcS_NsR5SofjkM9di_32UkV0OOgpO87R55gmUbJlIkDONW_ycOIpW49Cg",
        });
        console.log(token);
    } 
};


export { db };
