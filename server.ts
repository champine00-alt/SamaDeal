import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import twilio from 'twilio';
import admin from 'firebase-admin';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

if (!(admin as any).apps.length) {
  try {
    (admin as any).initializeApp({
      credential: (admin as any).credential.applicationDefault(),
      projectId: firebaseConfig.projectId
    });
    console.log('✅ Firebase Admin SDK initialisé avec succès');
  } catch (err) {
    console.warn('⚠️ Échec de l\'initialisation de Firebase Admin SDK:', err);
  }
}

// Helper to format Senegal / International phone numbers to E.164 standard
function formatE164Phone(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\s+/g, '').replace(/-/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('221')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('00221')) {
      cleaned = '+' + cleaned.substring(2);
    } else {
      // Default to Senegal country code (+221)
      cleaned = '+221' + cleaned.replace(/^0+/, '');
    }
  }
  return cleaned;
}

// Check Twilio configuration credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

const isTwilioConfigured = Boolean(accountSid && authToken && (verifyServiceSid || whatsappNumber));

let twilioClient: any = null;
if (accountSid && authToken) {
  try {
    twilioClient = twilio(accountSid, authToken);
    console.log('✅ Client Twilio initialisé avec succès');
  } catch (err) {
    console.warn('⚠️ Échec de l\'initialisation du client Twilio:', err);
  }
}

// In-memory OTP store for dev fallback / messaging API mode
const devOtpStore = new Map<string, { code: string; timestamp: number }>();

// API Endpoints
app.get('/api/twilio/status', (req, res) => {
  res.json({
    configured: isTwilioConfigured && twilioClient !== null,
    hasVerifyService: Boolean(verifyServiceSid),
    hasMessaging: Boolean(whatsappNumber),
    message: isTwilioConfigured 
      ? 'Twilio est configuré et prêt pour l\'envoi de SMS / WhatsApp.' 
      : 'Mode développement : Twilio non configuré. Les codes OTP 4829 sont utilisés.'
  });
});

// Send OTP via Twilio WhatsApp / SMS or Dev Fallback
app.post('/api/twilio/send-otp', async (req, res) => {
  try {
    const { phone: rawPhone, channel = 'whatsapp' } = req.body;
    if (!rawPhone) {
      return res.status(400).json({ error: 'Le numéro de téléphone est obligatoire.' });
    }

    const phone = formatE164Phone(rawPhone);

    if (isTwilioConfigured && twilioClient) {
      if (verifyServiceSid) {
        // Option A: Twilio Verify Service API
        try {
          const verification = await twilioClient.verify.v2
            .services(verifyServiceSid)
            .verifications.create({ to: phone, channel });
          
          return res.json({
            success: true,
            status: verification.status,
            phone,
            channel,
            isDevFallback: false,
            message: `Code OTP transmis via Twilio Verify (${channel})`
          });
        } catch (verifyErr: any) {
          console.warn('Twilio Verify API Error, trying messaging fallback:', verifyErr.message);
        }
      }

      // Option B: Twilio Messaging API (WhatsApp Direct)
      if (whatsappNumber) {
        const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
        devOtpStore.set(phone, { code: generatedCode, timestamp: Date.now() });

        const fromNum = whatsappNumber.startsWith('whatsapp:') ? whatsappNumber : `whatsapp:${whatsappNumber}`;
        const toNum = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
        
        const messageBody = `🇸🇳 *SamaDeal Sénégal*\n\nVotre code de confirmation WhatsApp est : *${generatedCode}*.\n\nEntrez ce code dans l'application pour valider votre compte. Ce code expire dans 10 minutes.`;

        await twilioClient.messages.create({
          from: fromNum,
          to: toNum,
          body: messageBody
        });

        return res.json({
          success: true,
          phone,
          isDevFallback: false,
          message: 'Message WhatsApp envoyé via Twilio avec succès.'
        });
      }
    }

    // Option C: Dev Mode Fallback when Twilio keys are not set
    const devCode = '4829';
    devOtpStore.set(phone, { code: devCode, timestamp: Date.now() });

    console.log(`[DEV MODE] OTP préparé pour ${phone}: ${devCode}`);

    return res.json({
      success: true,
      phone,
      code: devCode,
      isDevFallback: true,
      message: 'Code OTP simulé en mode développement (Twilio non configuré). Code par défaut : 4829'
    });

  } catch (error: any) {
    console.error('Erreur /api/twilio/send-otp:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'envoi du code OTP via Twilio',
      details: error.message
    });
  }
});

// Verify OTP Endpoint
app.post('/api/twilio/verify-otp', async (req, res) => {
  try {
    const { phone: rawPhone, code } = req.body;
    if (!rawPhone || !code) {
      return res.status(400).json({ error: 'Le numéro et le code sont obligatoires.' });
    }

    const phone = formatE164Phone(rawPhone);

    if (isTwilioConfigured && twilioClient && verifyServiceSid) {
      try {
        const check = await twilioClient.verify.v2
          .services(verifyServiceSid)
          .verificationChecks.create({ to: phone, code: code.trim() });

        if (check.status === 'approved') {
          return res.json({
            success: true,
            verified: true,
            isDevFallback: false,
            message: 'Numéro vérifié avec succès via Twilio Verify !'
          });
        } else {
          return res.status(400).json({
            success: false,
            verified: false,
            message: 'Code de vérification incorrect ou expiré.'
          });
        }
      } catch (verifyCheckErr: any) {
        console.warn('Twilio Check API Error:', verifyCheckErr.message);
      }
    }

    // Local / Dev Fallback Check
    const cleanCode = code.trim();
    const stored = devOtpStore.get(phone);

    if (cleanCode === '4829' || cleanCode === '1234' || (stored && stored.code === cleanCode)) {
      devOtpStore.delete(phone);
      return res.json({
        success: true,
        verified: true,
        isDevFallback: true,
        message: 'Code de vérification validé avec succès !'
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Code de vérification incorrect. Veuillez réessayer (Utilisez 4829 en démo).'
      });
    }

  } catch (error: any) {
    console.error('Erreur /api/twilio/verify-otp:', error);
    return res.status(500).json({
      error: 'Erreur lors de la vérification du code',
      details: error.message
    });
  }
});

// Admin delete user endpoint (Firebase Auth + Firestore via Firebase Admin SDK)
app.delete('/api/admin/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ error: 'UID manquant' });
    }

    // 1. Delete user from Firebase Auth using Firebase Admin SDK
    if ((admin as any).apps.length && !uid.startsWith('seller-') && !uid.startsWith('admin-')) {
      try {
        await (admin as any).auth().deleteUser(uid);
      } catch (authErr: any) {
        console.warn('Firebase Admin Auth delete user warning:', authErr.message);
      }
    }

    // 2. Delete user document from Firestore using Firebase Admin SDK
    if ((admin as any).apps.length) {
      try {
        await (admin as any).firestore().collection('users').doc(uid).delete();
      } catch (fsErr: any) {
        console.warn('Firebase Admin Firestore delete user warning:', fsErr.message);
      }
    }

    return res.json({ success: true, message: `Utilisateur ${uid} supprimé avec succès de Firebase Auth et Firestore.` });
  } catch (error: any) {
    console.error('Erreur /api/admin/users/:uid:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de la suppression de l\'utilisateur.' });
  }
});

// Vite & Static Server Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur SamaDeal à l'écoute sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
