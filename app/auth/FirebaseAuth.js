import {
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

const githubSignIn = () => {
  const provider = new GithubAuthProvider();
  signInWithRedirect(auth, provider);
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
export default {
  googleSignIn,
  githubSignIn,
  signInWithEmailPassword,
  signUpWithEmailAndPassword,
};
