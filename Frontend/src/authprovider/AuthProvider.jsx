import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../authprovider/Firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true);
  const [pass, setpasserror] = useState("");

  const googleprovider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      console.log(currentuser);
      setuser(currentuser);

      setTimeout(() => setloading(false), 1000);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const createUser = (email, password) => {
    setloading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const updateprofile = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData)
      .then(() => {
        // Reload the current user data from Firebase
        return auth.currentUser.reload().then(() => {
          setuser({ ...auth.currentUser });
        });
      })
      .catch((error) => {
        console.error("Failed to update profile:", error);
        throw error; // Ensure errors are propagated
      });
  };

  const loginUser = (email, password) => {
    setloading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleprovider);
  };

  const logout = () => {
    setloading(true);
    return signOut(auth);
  };

  const authinfo = {
    user,
    loading,
    createUser,
    setpasserror,
    updateprofile,
    loginUser,
    loginWithGoogle,
    pass,
    logout,
  };

  return (
    <AuthContext.Provider value={authinfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
