import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const githubSignIn = () => {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider);
};

const signUpWithEmailAndPassword = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password);
};

const signInWithEmailPassword = (email, password) => {
  signInWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  signOut(auth);
};

export {
  logOut,
  signInWithEmailPassword,
  signUpWithEmailAndPassword,
  signInWithPopup,
  githubSignIn,
  googleSignIn,
};
