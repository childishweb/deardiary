import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { STICKERS } from '../constants/stickers';
import { Sticker } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

interface StickerPickerProps {
  onSelectSticker: (sticker: Sticker) => void;
}

const categories = ['hearts', 'stars', 'flowers', 'animals', 'food', 'nature'] as const;

export default function StickerPicker({ onSelectSticker }: StickerPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('hearts');

  const filteredStickers = STICKERS.filter(s => s.category === selectedCategory);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stickers}>
        {filteredStickers.map(sticker => (
          <TouchableOpacity
            key={sticker.id}
            onPress={() => onSelectSticker(sticker)}
            style={styles.stickerButton}
          >
            <Text style={styles.stickerEmoji}>{sticker.emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  categories: {
    marginBottom: spacing.md,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: fontSize.sm,
    color: colors.text,
    textTransform: 'capitalize',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stickers: {
    flexDirection: 'row',
  },
  stickerButton: {
    marginRight: spacing.md,
    padding: spacing.sm,
  },
  stickerEmoji: {
    fontSize: 32,
  },
});
