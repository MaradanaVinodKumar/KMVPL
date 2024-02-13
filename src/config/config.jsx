import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCnP3FHliLTt_Jf0pBI5dZ9qfQZh3dUr-M",
    authDomain: "vinod-c848d.firebaseapp.com",
    projectId: "vinod-c848d",
    storageBucket: "vinod-c848d.appspot.com",
    messagingSenderId: "947962151563",
    appId: "1:947962151563:web:6917df042e209704d3ca8e"
};
const firebaseConfig2 = {
    apiKey: "AIzaSyCAGEXhRhKSha8P6ulJTl3q6E2nXsBoB38",
    authDomain: "kmvpl-254b9.firebaseapp.com",
    projectId: "kmvpl-254b9",
    storageBucket: "kmvpl-254b9.appspot.com",
    messagingSenderId: "801945158749",
    appId: "1:801945158749:web:ff6b9697183c5a3c2079b4"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig2);

export const imageDb = getStorage(app);