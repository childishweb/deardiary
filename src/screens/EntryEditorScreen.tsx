import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DiaryEntry, StickerPlacement, Sticker } from '../types';
import { storageUtils } from '../utils/storage';
import { colors, spacing, borderRadius, fontSize, shadows } from '../constants/theme';
import StickerPicker from '../components/StickerPicker';

type EntryEditorNavigationProp = StackNavigationProp<RootStackParamList, 'EntryEditor'>;
type EntryEditorRouteProp = RouteProp<RootStackParamList, 'EntryEditor'>;

interface Props {
  navigation: EntryEditorNavigationProp;
  route: EntryEditorRouteProp;
}

const moods = [
  { key: 'happy', emoji: '😊', label: 'Happy' },
  { key: 'sad', emoji: '😢', label: 'Sad' },
  { key: 'excited', emoji: '🤩', label: 'Excited' },
  { key: 'calm', emoji: '😌', label: 'Calm' },
  { key: 'anxious', emoji: '😰', label: 'Anxious' },
  { key: 'loved', emoji: '🥰', label: 'Loved' },
] as const;

export default function EntryEditorScreen({ navigation, route }: Props) {
  const existingEntry = route.params?.entry;

  const [title, setTitle] = useState(existingEntry?.title || '');
  const [content, setContent] = useState(existingEntry?.content || '');
  const [mood, setMood] = useState<typeof moods[number]['key'] | undefined>(existingEntry?.mood);
  const [photos, setPhotos] = useState<string[]>(existingEntry?.photos || []);
  const [stickers, setStickers] = useState<StickerPlacement[]>(existingEntry?.stickers || []);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSelectSticker = (sticker: Sticker) => {
    const newSticker: StickerPlacement = {
      id: `${Date.now()}-${Math.random()}`,
      stickerId: sticker.id,
      x: 0.5,
      y: 0.5,
      scale: 1,
      rotation: 0,
    };
    setStickers([...stickers, newSticker]);
    setShowStickerPicker(false);
  };

  const saveEntry = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty entry', 'Please add a title or content to your entry');
      return;
    }

    const entry: DiaryEntry = {
      id: existingEntry?.id || `${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      date: existingEntry?.date || new Date(),
      mood,
      photos,
      stickers,
      createdAt: existingEntry?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await storageUtils.saveEntry(entry);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {existingEntry ? 'Edit Entry' : 'New Entry'}
          </Text>
          <TouchableOpacity onPress={saveEntry}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>How are you feeling?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {moods.map(m => (
              <TouchableOpacity
                key={m.key}
                style={[
                  styles.moodButton,
                  mood === m.key && styles.moodButtonActive,
                ]}
                onPress={() => setMood(mood === m.key ? undefined : m.key)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    mood === m.key && styles.moodLabelActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <TextInput
            style={styles.titleInput}
            placeholder="Entry title..."
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textLight}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {photos.map((uri, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {stickers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Stickers</Text>
            <View style={styles.stickerDisplay}>
              {stickers.map((sp, index) => {
                const sticker = require('../constants/stickers').STICKERS.find(
                  (s: any) => s.id === sp.stickerId
                );
                return sticker ? (
                  <Text key={index} style={styles.displaySticker}>
                    {sticker.emoji}
                  </Text>
                ) : null;
              })}
            </View>
          </View>
        )}

        {showStickerPicker && (
          <View style={styles.section}>
            <StickerPicker onSelectSticker={handleSelectSticker} />
          </View>
        )}

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color={colors.primary} />
            <Text style={styles.toolLabel}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color={colors.primary} />
            <Text style={styles.toolLabel}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => setShowStickerPicker(!showStickerPicker)}
          >
            <Ionicons name="happy" size={24} color={colors.primary} />
            <Text style={styles.toolLabel}>Stickers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  moodButton: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBackground,
    ...shadows.small,
  },
  moodButtonActive: {
    backgroundColor: colors.primary,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  moodLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  titleInput: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  contentInput: {
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 200,
    ...shadows.small,
  },
  photoContainer: {
    marginRight: spacing.md,
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.md,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: borderRadius.full,
  },
  stickerDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  displaySticker: {
    fontSize: 32,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  toolButton: {
    alignItems: 'center',
  },
  toolLabel: {
    fontSize: fontSize.xs,
    color: colors.text,
    marginTop: spacing.xs,
  },
});
