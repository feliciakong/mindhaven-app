import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { JournalEntry, ChatMessage, SessionInsights } from '../types';

/**
 * Sanitizes an object by removing keys with `undefined` values,
 * which Firestore rejects.
 */
function sanitizePayload<T extends Record<string, any>>(payload: T): Partial<T> {
  const clean: Record<string, any> = {};
  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  });
  return clean as Partial<T>;
}

/**
 * Helper to generate subcollection reference `/users/{userId}/journalEntries`
 */
const getJournalEntriesRef = (userId: string) => {
  return collection(db, 'users', userId, 'journalEntries');
};

/**
 * Fetch all journal entries for a given user ordered by createdAt desc
 */
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

/**
 * Create a new journal entry under `/users/{userId}/journalEntries/{entryId}`
 */
export async function createNewJournalEntry(
  userId: string,
  initialUserMessage?: string,
  mood?: string
): Promise<JournalEntry> {
  if (!userId) throw new Error('User ID is required');

  const entriesRef = getJournalEntriesRef(userId);
  const newDocRef = doc(entriesRef); // Auto-generated ID

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

  // Generate an auto title from the initial message or default
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

/**
 * Save updated messages array and timestamps for a journal entry
 */
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

  // If title was still default, update title based on first user message
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

/**
 * Update title or mood or tags of a journal entry
 */
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

/**
 * Delete a journal entry document from Firestore
 */
export async function deleteJournalEntry(userId: string, entryId: string): Promise<void> {
  if (!userId || !entryId) return;
  const docRef = doc(db, 'users', userId, 'journalEntries', entryId);
  await deleteDoc(docRef);
}
