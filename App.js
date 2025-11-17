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

// Cute Korean aesthetic + studying vibe stickers - OpenMoji illustrated style
const STICKERS = [
  // Hearts & Love
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F49C.png' }, // purple heart
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F495.png' }, // two hearts
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F496.png' }, // sparkling heart
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F497.png' }, // growing heart
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F498.png' }, // heart with arrow
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F49D.png' }, // heart with ribbon

  // Flowers & Nature
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F338.png' }, // cherry blossom
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F33C.png' }, // blossom
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F337.png' }, // tulip
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F33B.png' }, // sunflower
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F339.png' }, // rose
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F340.png' }, // four leaf clover

  // Stars & Sparkles
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/2B50.png' }, // star
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F31F.png' }, // glowing star
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F320.png' }, // shooting star
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/2728.png' }, // sparkles

  // Cute Animals
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F431.png' }, // cat face
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F430.png' }, // rabbit face
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F43B.png' }, // bear
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F428.png' }, // koala
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F439.png' }, // hamster
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F98B.png' }, // butterfly

  // Study & School
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F4DA.png' }, // books
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F4D6.png' }, // open book
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/270F.png' }, // pencil
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F58A.png' }, // pen
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F4DD.png' }, // memo
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F4AF.png' }, // 100 points
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F393.png' }, // graduation cap

  // Food & Treats
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F370.png' }, // cake
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F382.png' }, // birthday cake
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F369.png' }, // donut
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F36D.png' }, // lollipop
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F36A.png' }, // cookie
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F9CB.png' }, // bubble tea
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/2615.png' }, // hot beverage

  // Objects & Decorations
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F48E.png' }, // gem stone
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F381.png' }, // wrapped gift
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F380.png' }, // ribbon
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F388.png' }, // balloon
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F389.png' }, // party popper
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F38A.png' }, // confetti ball

  // Weather & Sky
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F308.png' }, // rainbow
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/2601.png' }, // cloud
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F319.png' }, // crescent moon
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F31E.png' }, // sun with face

  // Music & Art
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F3B5.png' }, // musical note
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F3B6.png' }, // musical notes
  { type: 'image', value: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/1F3A8.png' }, // artist palette
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
