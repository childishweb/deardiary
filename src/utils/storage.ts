import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '../types';

const ENTRIES_KEY = '@diary_entries';

export const storageUtils = {
  async saveEntries(entries: DiaryEntry[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(entries);
      await AsyncStorage.setItem(ENTRIES_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving entries:', e);
    }
  },

  async loadEntries(): Promise<DiaryEntry[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ENTRIES_KEY);
      if (jsonValue != null) {
        const entries = JSON.parse(jsonValue);
        // Convert date strings back to Date objects
        return entries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        }));
      }
      return [];
    } catch (e) {
      console.error('Error loading entries:', e);
      return [];
    }
  },

  async saveEntry(entry: DiaryEntry): Promise<void> {
    try {
      const entries = await this.loadEntries();
      const index = entries.findIndex(e => e.id === entry.id);

      if (index !== -1) {
        entries[index] = entry;
      } else {
        entries.push(entry);
      }

      await this.saveEntries(entries);
    } catch (e) {
      console.error('Error saving entry:', e);
    }
  },

  async deleteEntry(id: string): Promise<void> {
    try {
      const entries = await this.loadEntries();
      const filtered = entries.filter(e => e.id !== id);
      await this.saveEntries(filtered);
    } catch (e) {
      console.error('Error deleting entry:', e);
    }
  },
};
