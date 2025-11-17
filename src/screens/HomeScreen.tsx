import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DiaryEntry } from '../types';
import { storageUtils } from '../utils/storage';
import { colors, spacing, borderRadius, fontSize, shadows } from '../constants/theme';
import MusicPlayer from '../components/MusicPlayer';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const moodEmojis = {
  happy: '😊',
  sad: '😢',
  excited: '🤩',
  calm: '😌',
  anxious: '😰',
  loved: '🥰',
};

export default function HomeScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    const loaded = await storageUtils.loadEntries();
    setEntries(loaded.sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  const filteredEntries = entries.filter(
    entry =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderEntry = ({ item }: { item: DiaryEntry }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => navigation.navigate('EntryDetail', { entry: item })}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{item.title || 'Untitled Entry'}</Text>
        {item.mood && (
          <Text style={styles.moodEmoji}>{moodEmojis[item.mood]}</Text>
        )}
      </View>
      <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
      <Text style={styles.entryPreview} numberOfLines={2}>
        {item.content}
      </Text>
      {item.photos.length > 0 && (
        <View style={styles.photoIndicator}>
          <Ionicons name="image" size={14} color={colors.primary} />
          <Text style={styles.photoCount}>{item.photos.length} photo(s)</Text>
        </View>
      )}
      {item.stickers.length > 0 && (
        <View style={styles.stickerPreview}>
          {item.stickers.slice(0, 3).map((sp, index) => {
            const sticker = require('../constants/stickers').STICKERS.find(
              (s: any) => s.id === sp.stickerId
            );
            return sticker ? (
              <Text key={index} style={styles.stickerEmoji}>
                {sticker.emoji}
              </Text>
            ) : null;
          })}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dear Diary</Text>
          <Text style={styles.subtitle}>Your beautiful journal</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <MusicPlayer />

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredEntries}
          renderItem={renderEntry}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>✨</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No entries found' : 'Start your diary journey'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search' : 'Tap + to create your first entry'}
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('EntryEditor', {})}
        >
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  list: {
    paddingBottom: spacing.xxl + spacing.lg,
  },
  entryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  entryTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  moodEmoji: {
    fontSize: 24,
    marginLeft: spacing.sm,
  },
  entryDate: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  entryPreview: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  photoCount: {
    fontSize: fontSize.xs,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  stickerPreview: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  stickerEmoji: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textLight,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    borderRadius: borderRadius.full,
    ...shadows.large,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
