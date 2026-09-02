import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { JournalEntry, ChatMessage, SessionInsights } from '../types';

function sanitizePayload<T extends Record<string, any>>(payload: T): Partial<T> {
  const clean: Record<string, any> = {};
  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  });
  return clean as Partial<T>;
}

const getJournalEntriesRef = (userId: string) => {
  return collection(db, 'users', userId, 'journalEntries');
};

export async function fetchUserJournalEntries(userId: string): Promise<JournalEntry[]> {
  if (!userId) return [];
  try {
    const entriesRef = getJournalEntriesRef(userId);
    const q = query(entriesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const entries: JournalEntry[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        id: docSnap.id,
        userId,
        title: data.title || 'Untitled Reflection',
        createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString(),
        updatedAt: data.updatedAt ? (typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate().toISOString() : data.updatedAt) : new Date().toISOString(),
        mood: data.mood || 'Reflective',
        tags: data.tags || [],
        messages: data.messages || [],
        summary: data.summary || null,
        isFavorite: data.isFavorite || false,
      });
    });
    return entries;
  } catch (error) {
    console.error('Error fetching journal entries from Firestore:', error);
    throw error;
  }
}

export async function createNewJournalEntry(
  userId: string,
  initialUserMessage?: string,
  mood?: string
): Promise<JournalEntry> {
  if (!userId) throw new Error('User ID is required');

  const entriesRef = getJournalEntriesRef(userId);
  const newDocRef = doc(entriesRef);

  const now = new Date().toISOString();
  const initialMessages: ChatMessage[] = initialUserMessage
    ? [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'user',
          text: initialUserMessage,
          timestamp: now,
        },
      ]
    : [];

  const title = initialUserMessage
    ? initialUserMessage.slice(0, 35) + (initialUserMessage.length > 35 ? '...' : '')
    : 'New Reflection Session';

  const entryData: JournalEntry = {
    id: newDocRef.id,
    userId,
    title,
    createdAt: now,
    updatedAt: now,
    mood: mood || 'Reflective',
    tags: [],
    messages: initialMessages,
    summary: null,
    isFavorite: false,
  };

  const payload = sanitizePayload({
    ...entryData,
    firestoreCreatedAt: serverTimestamp(),
    firestoreUpdatedAt: serverTimestamp(),
  });

  await setDoc(newDocRef, payload);
  return entryData;
}

export async function saveJournalMessages(
  userId: string,
  entryId: string,
  messages: ChatMessage[],
  summary?: SessionInsights | null,
  mood?: string
): Promise<void> {
  if (!userId || !entryId) return;

  const docRef = doc(db, 'users', userId, 'journalEntries', entryId);
  const now = new Date().toISOString();

  const firstUserMsg = messages.find((m) => m.sender === 'user');
  let titleUpdate: string | undefined;
  if (firstUserMsg && firstUserMsg.text) {
    titleUpdate = firstUserMsg.text.slice(0, 40) + (firstUserMsg.text.length > 40 ? '...' : '');
  }

  const updates: Record<string, any> = {
    messages,
    updatedAt: now,
    firestoreUpdatedAt: serverTimestamp(),
  };

  if (summary !== undefined) updates.summary = summary;
  if (mood !== undefined) updates.mood = mood;
  if (titleUpdate) updates.title = titleUpdate;

  await updateDoc(docRef, sanitizePayload(updates));
}

export async function updateJournalEntryMeta(
  userId: string,
  entryId: string,
  updates: { title?: string; mood?: string; tags?: string[]; isFavorite?: boolean }
): Promise<void> {
  if (!userId || !entryId) return;

  const docRef = doc(db, 'users', userId, 'journalEntries', entryId);
  const now = new Date().toISOString();

  await updateDoc(
    docRef,
    sanitizePayload({
      ...updates,
      updatedAt: now,
      firestoreUpdatedAt: serverTimestamp(),
    })
  );
}

export async function deleteJournalEntry(userId: string, entryId: string): Promise<void> {
  if (!userId || !entryId) return;
  const docRef = doc(db, 'users', userId, 'journalEntries', entryId);
  await deleteDoc(docRef);
}