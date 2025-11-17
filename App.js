import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('diary_entries');
      if (data) {
        setEntries(JSON.parse(data));
      }
    } catch (e) {
      console.log('Error loading', e);
    }
  };

  const saveEntry = async () => {
    if (!title && !content) return;

    const newEntry = {
      id: Date.now().toString(),
      title: title || 'Untitled',
      content: content,
      date: new Date().toLocaleDateString(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    await AsyncStorage.setItem('diary_entries', JSON.stringify(updated));

    setTitle('');
    setContent('');
    setShowEditor(false);
  };

  const deleteEntry = async (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem('diary_entries', JSON.stringify(updated));
  };

  if (showEditor) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowEditor(false)}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Entry</Text>
          <TouchableOpacity onPress={saveEntry}>
            <Text style={styles.headerButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editor}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dear Diary</Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entryDate}>{item.date}</Text>
            <Text style={styles.entryContent} numberOfLines={2}>
              {item.content}
            </Text>
            <TouchableOpacity
              onPress={() => deleteEntry(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No entries yet</Text>
            <Text style={styles.emptySubtext}>Tap + to start</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowEditor(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    backgroundColor: '#FF6B9D',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  editor: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  entry: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 16,
    color: '#2C2C2C',
  },
  deleteButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#FF6B9D',
    fontSize: 14,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});
