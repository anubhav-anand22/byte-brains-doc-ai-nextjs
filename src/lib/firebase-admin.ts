// lib/firebase-admin.ts
import * as admin from "firebase-admin";

let app: admin.app.App;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.TYPE,
      projectId: process.env.PROJECT_ID,
      privateKeyId: process.env.PRIVATE_KEY_ID,
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL,
      clientId: process.env.CLIENT_ID,
      authUri: process.env.AUTH_URI,
      tokenUri: process.env.TOKEN_URI,
      authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
      clientX509CertUrl: process.env.CLIENT_X509_CERT_URL,
      universeDomain: process.env.UNIVERSE_DOMAIN,
    } as admin.ServiceAccount),
  });
} else {
  app = admin.app();
}

export const adminDb = app.firestore();
export const adminAuth = app.auth();
// export const adminStorage = app.storage();
/**
 
  'TYPE',
  'PROJECT_ID',
  'PRIVATE_KEY_ID',
  'PRIVATE_KEY',
  'CLIENT_EMAIL',
  'CLIENT_ID',
  'AUTH_URI',
  'TOKEN_URI',
  'AUTH_PROVIDER_X509_CERT_URL',
  'CLIENT_X509_CERT_URL',
  'UNIVERSE_DOMAIN'
 */
