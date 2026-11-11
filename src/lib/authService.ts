import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'acheteur' | 'vendeur' | 'admin';
  phone?: string;
  whatsapp?: string;
  city?: string;
  neighborhood?: string;
  avatar?: string;
  emailVerified: boolean;
  whatsappVerified: boolean;
  createdAt: number;
}

/**
 * Inscription d'un nouvel utilisateur dans Firebase Auth et création de son profil dans Cloud Firestore
 */
export const registerUser = async (
  email: string, 
  pass: string, 
  displayName: string, 
  role: 'acheteur' | 'vendeur' = 'acheteur',
  phone: string = '',
  city: string = 'Dakar',
  neighborhood: string = '',
  avatar: string = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
): Promise<UserProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email || email,
    displayName,
    role,
    phone,
    whatsapp: phone ? phone.replace(/[^0-9]/g, '') : '',
    city,
    neighborhood,
    avatar,
    emailVerified: user.emailVerified,
    whatsappVerified: false,
    createdAt: Date.now()
  };
  
  // Enregistrement dans Cloud Firestore
  await setDoc(doc(db, 'users', user.uid), userProfile);

  // Envoi de l'e-mail de vérification Firebase
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('Erreur lors de l\'envoi de l\'e-mail de vérification:', err);
  }

  return userProfile;
};

/**
 * Connexion d'un utilisateur existant avec Firebase Auth
 */
export const loginUser = async (email: string, pass: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
  
  if (userDoc.exists()) {
    return {
      credential: cred,
      profile: userDoc.data() as UserProfile
    };
  }
  
  return {
    credential: cred,
    profile: null
  };
};

/**
 * Déconnexion de la session Firebase Auth
 */
export const logoutUser = async (): Promise<void> => {
  return await signOut(auth);
};

/**
 * Configuration du reCAPTCHA invisible pour Firebase Phone Authentication
 */
export const setupRecaptcha = (containerId: string = 'recaptcha-container') => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA résolu avec succès');
      }
    });
  }
  return window.recaptchaVerifier;
};

/**
 * Envoi d'un code SMS / WhatsApp via Firebase Phone Authentication avec reCAPTCHA
 */
export const sendFirebasePhoneCode = async (phoneNumber: string, containerId: string = 'recaptcha-container') => {
  const appVerifier = setupRecaptcha(containerId);
  try {
    let cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+221' + cleanPhone.replace(/^0+/, '');
    }
    const confirmationResult = await signInWithPhoneNumber(auth, cleanPhone, appVerifier);
    window.confirmationResult = confirmationResult;
    return { success: true, confirmationResult };
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du SMS/WhatsApp via Firebase Phone Auth", error);
    throw error;
  }
};

/**
 * Confirmation du code de vérification Firebase Phone Authentication
 */
export const confirmFirebasePhoneCode = async (code: string) => {
  if (!window.confirmationResult) {
    throw new Error('Aucune session de vérification par téléphone active.');
  }
  const result = await window.confirmationResult.confirm(code);
  return result.user;
};
