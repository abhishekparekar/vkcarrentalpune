import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getAdminUser, registerAdminUser } from '../firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
const DEFAULT_TENANT_ID = 'vk-carrentalpune';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [adminRole, setAdminRole] = useState(null); // 'admin' | null
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to verify & fetch admin role from Firestore
  const verifyAdminRoleInFirestore = async (firebaseUser) => {
    if (!firebaseUser) {
      setAdminRole(null);
      setIsAdmin(false);
      return false;
    }

    if (firebaseUser.email && firebaseUser.email.toLowerCase() === 'vishalkarke184@gmail.com') {
      setAdminRole('admin');
      setIsAdmin(true);
      return true;
    }

    setAdminRole(null);
    setIsAdmin(false);
    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await verifyAdminRoleInFirestore(firebaseUser);
      } else {
        setAdminRole(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const targetEmail = 'vishalkarke184@gmail.com';
    const targetPassword = 'Vishalk@1998';

    if (cleanEmail !== targetEmail || password !== targetPassword) {
      const msg = 'Invalid email or password. Only authorized admin can log in.';
      toast.error(msg);
      throw new Error(msg);
    }

    try {
      const result = await signInWithEmailAndPassword(auth, targetEmail, targetPassword);
      await registerAdminUser(DEFAULT_TENANT_ID, result.user.uid, {
        email: targetEmail,
        name: 'Vishal Karke',
        role: 'admin',
      });
      setAdminRole('admin');
      setIsAdmin(true);
      toast.success('Admin Sign In Successful! Welcome Vishal Karke.');
      return result;
    } catch (err) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password'
      ) {
        try {
          const createRes = await createUserWithEmailAndPassword(auth, targetEmail, targetPassword);
          await registerAdminUser(DEFAULT_TENANT_ID, createRes.user.uid, {
            email: targetEmail,
            name: 'Vishal Karke',
            role: 'admin',
          });
          setAdminRole('admin');
          setIsAdmin(true);
          toast.success('Admin Account Created & Signed In!');
          return createRes;
        } catch (createErr) {
          if (createErr.code === 'auth/email-already-in-use') {
            const retryRes = await signInWithEmailAndPassword(auth, targetEmail, targetPassword);
            setAdminRole('admin');
            setIsAdmin(true);
            toast.success('Admin Sign In Successful!');
            return retryRes;
          }
          console.error(createErr);
          toast.error(createErr.message);
          throw createErr;
        }
      }
      toast.error(err.message || 'Authentication failed');
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAdminRole(null);
    setIsAdmin(false);
    toast.success('Signed out');
  };

  const createAdmin = async (email = 'vishalkarke184@gmail.com', password = 'Vishalk@1998', name = 'Vishal Karke') => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res.user) {
        await registerAdminUser(DEFAULT_TENANT_ID, res.user.uid, {
          email: res.user.email,
          name: name || 'Admin',
          role: 'admin',
        });
        setAdminRole('admin');
        setIsAdmin(true);
      }
      return res;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        return signIn(email, password);
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, adminRole, isAdmin, loading, signIn, signOut, createAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || { user: null, adminRole: null, isAdmin: false, loading: false, signIn: async () => {}, signOut: async () => {} };
}
