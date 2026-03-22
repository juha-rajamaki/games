import { initializeApp } from 'firebase/app'
import { getDatabase, ref, runTransaction, get } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export function incrementPlayCount(gameId) {
  if (window.location.hostname === 'localhost') return
  if (!/^[a-z0-9-]{1,64}$/.test(gameId)) return
  const countRef = ref(db, `gamePlays/${gameId}`)
  runTransaction(countRef, (current) => (current || 0) + 1).catch((err) => {
    console.warn('[Stats] Failed to increment play count for', gameId, err)
  })
}

export async function getPlayCounts() {
  const snapshot = await get(ref(db, 'gamePlays'))
  return snapshot.val() || {}
}
