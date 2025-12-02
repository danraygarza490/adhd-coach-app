console.log("FIREBASE_SERVICE_ACCOUNT RAW VALUE:");
console.log(process.env.FIREBASE_SERVICE_ACCOUNT);
import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export async function verifyAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid };
    return next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
}
