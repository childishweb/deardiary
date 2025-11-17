import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

const AMBIENT_TRACKS = [
  { name: 'Peaceful Piano', url: 'https://assets.mixkit.co/music/preview/mixkit-piano-reflections-12.mp3' },
  { name: 'Calm Guitar', url: 'https://assets.mixkit.co/music/preview/mixkit-elegant-guitar-7.mp3' },
  { name: 'Dreamy Ambient', url: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3' },
];

export default function MusicPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: AMBIENT_TRACKS[currentTrack].url },
          { shouldPlay: true, isLooping: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const nextTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    const next = (currentTrack + 1) % AMBIENT_TRACKS.length;
    setCurrentTrack(next);
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Ionicons name="musical-notes" size={16} color={colors.primary} />
        <Text style={styles.trackName}>{AMBIENT_TRACKS[currentTrack].name}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={nextTrack} style={styles.button}>
          <Ionicons name="play-skip-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPause} style={styles.button}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackName: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
