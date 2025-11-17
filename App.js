import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const MOODS = [
  { key: 'happy', emoji: '😊', label: 'Happy' },
  { key: 'sad', emoji: '😢', label: 'Sad' },
  { key: 'excited', emoji: '🤩', label: 'Excited' },
  { key: 'calm', emoji: '😌', label: 'Calm' },
  { key: 'anxious', emoji: '😰', label: 'Anxious' },
  { key: 'loved', emoji: '🥰', label: 'Loved' },
];

// Cute Korean aesthetic + studying vibe stickers (IMAGE URLs)
const STICKERS = [
  // Using placeholder cute sticker images - you can replace with your own URLs
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/cherry-blossom_1f338.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/sparkles_2728.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/star_2b50.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/cloud_2601-fe0f.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/rainbow_1f308.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/strawberry_1f353.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/birthday-cake_1f382.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/bubble-tea_1f9cb.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/books_1f4da.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/pencil_270f-fe0f.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/laptop_1f4bb.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/hot-beverage_2615.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/ribbon_1f380.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/teddy-bear_1f9f8.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/crescent-moon_1f319.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/butterfly_1f98b.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/sparkle_2747-fe0f.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/two-hearts_1f495.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/sparkling-heart_1f496.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/growing-heart_1f497.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/artist-palette_1f3a8.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/musical-note_1f3b5.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/headphone_1f3a7.png' },
  { type: 'image', value: 'https://em-content.zobj.net/source/apple/391/balloon_1f388.png' },
];

export default function App() {
  const [entries, setEntries] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [stickers, setStickers] = useState([]);

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
      mood: mood,
      photos: photos,
      stickers: stickers,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    await AsyncStorage.setItem('diary_entries', JSON.stringify(updated));

    // Reset
    setTitle('');
    setContent('');
    setMood(null);
    setPhotos([]);
    setStickers([]);
    setShowEditor(false);
  };

  const deleteEntry = async (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem('diary_entries', JSON.stringify(updated));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera access');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const addSticker = (sticker) => {
    setStickers([...stickers, sticker]); // Store the whole sticker object
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

        <ScrollView style={styles.editor}>
          {/* Mood Selector */}
          <Text style={styles.label}>How are you feeling?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodRow}>
            {MOODS.map(m => (
              <TouchableOpacity
                key={m.key}
                onPress={() => setMood(m.key)}
                style={[styles.moodButton, mood === m.key && styles.moodActive]}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Title */}
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          {/* Content */}
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
          />

          {/* Photos */}
          {photos.length > 0 && (
            <ScrollView horizontal style={styles.photoRow}>
              {photos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.photo} />
              ))}
            </ScrollView>
          )}

          {/* Stickers */}
          {stickers.length > 0 && (
            <View style={styles.stickerRow}>
              {stickers.map((s, i) => (
                <Image key={i} source={{ uri: s.value }} style={styles.selectedSticker} />
              ))}
            </View>
          )}

          {/* Sticker Picker */}
          <Text style={styles.label}>Add Stickers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stickerPicker}>
            {STICKERS.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => addSticker(s)} style={styles.stickerButton}>
                <Image source={{ uri: s.value }} style={styles.stickerPickerImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tools */}
          <View style={styles.tools}>
            <TouchableOpacity onPress={pickImage} style={styles.toolButton}>
              <Text style={styles.toolEmoji}>🖼️</Text>
              <Text style={styles.toolLabel}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.toolButton}>
              <Text style={styles.toolEmoji}>📷</Text>
              <Text style={styles.toolLabel}>Camera</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dear Diary ✨</Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{item.title}</Text>
              {item.mood && (
                <Text style={styles.entryMood}>
                  {MOODS.find(m => m.key === item.mood)?.emoji}
                </Text>
              )}
            </View>
            <Text style={styles.entryDate}>{item.date}</Text>
            <Text style={styles.entryContent} numberOfLines={2}>
              {item.content}
            </Text>

            {item.photos && item.photos.length > 0 && (
              <ScrollView horizontal style={styles.entryPhotos}>
                {item.photos.map((uri, i) => (
                  <Image key={i} source={{ uri }} style={styles.entryPhoto} />
                ))}
              </ScrollView>
            )}

            {item.stickers && item.stickers.length > 0 && (
              <View style={styles.entryStickers}>
                {item.stickers.map((s, i) => (
                  <Image
                    key={i}
                    source={{ uri: s.value || s }}
                    style={styles.entrySticker}
                  />
                ))}
              </View>
            )}

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
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyText}>No entries yet</Text>
            <Text style={styles.emptySubtext}>Tap + to start your diary</Text>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginTop: 16,
    marginBottom: 8,
  },
  moodRow: {
    marginBottom: 16,
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    minWidth: 70,
  },
  moodActive: {
    backgroundColor: '#FF6B9D',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  contentInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  photoRow: {
    marginTop: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  stickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  selectedSticker: {
    width: 48,
    height: 48,
    marginRight: 8,
    marginBottom: 8,
  },
  stickerPicker: {
    marginBottom: 16,
  },
  stickerButton: {
    marginRight: 12,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  stickerPickerImage: {
    width: 50,
    height: 50,
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  toolButton: {
    alignItems: 'center',
  },
  toolEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  toolLabel: {
    fontSize: 12,
    color: '#757575',
  },
  entry: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    flex: 1,
  },
  entryMood: {
    fontSize: 24,
  },
  entryDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 16,
    color: '#2C2C2C',
    marginBottom: 12,
  },
  entryPhotos: {
    marginVertical: 12,
  },
  entryPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  entryStickers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  entrySticker: {
    width: 32,
    height: 32,
    marginRight: 6,
    marginBottom: 6,
  },
  deleteButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2C2C2C',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
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
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
});
