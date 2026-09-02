import { db } from './firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc 
} from 'firebase/firestore';

export interface JournalEntry {
  id?: string;
  title: string;
  content: string;
  aiInsight: string;
  mood: string;
  createdAt?: any;
}

export function subscribeToUserEntries(uid: string, callback: (entries: JournalEntry[]) => void) {
  const entriesRef = collection(db, 'users', uid, 'entries');
  const q = query(entriesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const entries: JournalEntry[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as JournalEntry));
    callback(entries);
  });
}

export async function createJournalEntry(uid: string, entry: Omit<JournalEntry, 'id' | 'createdAt'>) {
  const entriesRef = collection(db, 'users', uid, 'entries');
  return await addDoc(entriesRef, {
    ...entry,
    createdAt: serverTimestamp()
  });
}

export async function updateJournalEntry(userId: string, entryId: string, updates: Partial<JournalEntry>) {
  const entryRef = doc(db, 'users', userId, 'entries', entryId);
  return await updateDoc(entryRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteJournalEntry(userId: string, entryId: string) {
  const entryRef = doc(db, 'users', userId, 'entries', entryId);
  return await deleteDoc(entryRef);
}
