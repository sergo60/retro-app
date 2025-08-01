// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAj9GKTaqTbyw7CtznBFrm_y_Nz0eHUlD8',
  authDomain: 'my-retro-4799a.firebaseapp.com',
  projectId: 'my-retro-4799a',
  storageBucket: 'my-retro-4799a.firebasestorage.app',
  messagingSenderId: '270238886511',
  appId: '1:270238886511:web:4c3953935a670c44843b9a',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
