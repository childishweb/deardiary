import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { storageUtils } from '../utils/storage';
import { colors, spacing, borderRadius, fontSize, shadows } from '../constants/theme';

type EntryDetailNavigationProp = StackNavigationProp<RootStackParamList, 'EntryDetail'>;
type EntryDetailRouteProp = RouteProp<RootStackParamList, 'EntryDetail'>;

interface Props {
  navigation: EntryDetailNavigationProp;
  route: EntryDetailRouteProp;
}

const moodEmojis = {
  happy: '😊',
  sad: '😢',
  excited: '🤩',
  calm: '😌',
  anxious: '😰',
  loved: '🥰',
};

export default function EntryDetailScreen({ navigation, route }: Props) {
  const { entry } = route.params;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await storageUtils.deleteEntry(entry.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EntryEditor', { entry });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
              <Ionicons name="create" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
          <Text style={styles.time}>{formatTime(entry.date)}</Text>
        </View>

        {entry.mood && (
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{moodEmojis[entry.mood]}</Text>
            <Text style={styles.moodText}>
              Feeling {entry.mood}
            </Text>
          </View>
        )}

        {entry.title && (
          <Text style={styles.title}>{entry.title}</Text>
        )}

        {entry.content && (
          <Text style={styles.contentText}>{entry.content}</Text>
        )}

        {entry.photos.length > 0 && (
          <View style={styles.photosSection}>
            {entry.photos.map((uri, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri }} style={styles.photo} />
              </View>
            ))}
          </View>
        )}

        {entry.stickers.length > 0 && (
          <View style={styles.stickersSection}>
            <Text style={styles.sectionLabel}>Decorations</Text>
            <View style={styles.stickerContainer}>
              {entry.stickers.map((sp, index) => {
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
          </View>
        )}

        <View style={styles.metaSection}>
          <Text style={styles.metaText}>
            Created: {formatDate(entry.createdAt)} at {formatTime(entry.createdAt)}
          </Text>
          {entry.updatedAt.getTime() !== entry.createdAt.getTime() && (
            <Text style={styles.metaText}>
              Updated: {formatDate(entry.updatedAt)} at {formatTime(entry.updatedAt)}
            </Text>
          )}
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: spacing.md,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  date: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  time: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  moodText: {
    fontSize: fontSize.md,
    color: colors.text,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  contentText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  photosSection: {
    marginBottom: spacing.lg,
  },
  photoWrapper: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.lg,
  },
  stickersSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  stickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  stickerEmoji: {
    fontSize: 40,
    marginRight: spacing.md,
    marginBottom: spacing.md,
  },
  metaSection: {
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
});
