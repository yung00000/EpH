/**
 * Past Events Screen
 * Displays old/past race events
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import {
  RaceEvent,
  loadRaceEvents,
  deleteRaceEvent,
} from '../utils/storage';
import '../i18n/i18nConfig';

export default function PastEventsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const [events, setEvents] = useState<RaceEvent[]>([]);

  const styles = createStyles(isDark);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const eventsData = await loadRaceEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter only past events and sort by date (most recent first - descending order)
    const pastEvents = eventsData
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending: most recent past events first
      });
    
    setEvents(pastEvents);
  };

  // Format date as "DD MMM YY (Day)"
  const formatEventDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${day} ${month} ${year} (${dayOfWeek})`;
  };

  // Get event type display name (Race/Training/Event)
  const getEventTypeDisplayName = (type: 'Race' | 'Training' | 'Event'): string => {
    switch (type) {
      case 'Race':
        return t('common.eventTypeRace');
      case 'Training':
        return t('common.eventTypeTraining');
      case 'Event':
        return t('common.eventTypeEvent');
      default:
        return type;
    }
  };

  // Get event distance display name
  const getEventDistanceDisplayName = (distance: string): string => {
    switch (distance) {
      case '5KM':
        return t('common.eventDistance5KM');
      case '10KM':
        return t('common.eventDistance10KM');
      case 'Half Marathon':
        return t('common.eventDistanceHalfMarathon');
      case 'Marathon':
        return t('common.eventDistanceMarathon');
      case 'Trail Run':
        return t('common.eventDistanceTrailRun');
      case 'Other':
        return t('common.eventDistanceOther');
      default:
        return distance;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('common.pastEventsTitle')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Past Events List */}
        <View style={styles.eventsList}>
          <Text style={styles.eventsListTitle}>{t('common.pastEventsTitle')}</Text>
          {events.length === 0 ? (
            <Text style={styles.noEventsText}>{t('common.noPastEvents')}</Text>
          ) : (
            events.map((event) => {
              const renderDeleteAction = () => (
                <TouchableOpacity
                  style={styles.deleteAction}
                  onPress={async () => {
                    try {
                      await deleteRaceEvent(event.id);
                      await loadEvents();
                    } catch (error) {
                      console.error('Error deleting event:', error);
                    }
                  }}
                >
                  <Ionicons name="trash" size={20} color="#ffffff" />
                </TouchableOpacity>
              );

              return (
                <Swipeable
                  key={event.id}
                  renderRightActions={renderDeleteAction}
                  overshootRight={false}
                >
                  <View style={styles.eventCard}>
                    <View style={styles.eventCardContent}>
                      <Text style={styles.eventCardName}>{event.eventName}</Text>
                      <View style={styles.eventCardRow}>
                        <Text style={styles.eventCardDetail}>
                          {formatEventDate(event.date)} • {getEventTypeDisplayName(event.type)} • {getEventDistanceDisplayName(event.distance)}
                          {event.customDistance ? ` • ${event.customDistance} km` : ''}
                          {event.eventNotes ? ` • ${event.eventNotes}` : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Swipeable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingBottom: 12,
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonText: {
      fontSize: 24,
      color: isDark ? '#ffffff' : '#1e293b',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#1e293b',
    },
    placeholder: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 32,
    },
    eventsList: {
      padding: 16,
    },
    eventsListTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
      marginBottom: 16,
    },
    eventCard: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      alignItems: 'center',
    },
    eventCardContent: {
      flex: 1,
    },
    eventCardName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
      marginBottom: 8,
    },
    eventCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventCardDetail: {
      fontSize: 14,
      color: isDark ? '#94a3b8' : '#64748b',
      flex: 1,
    },
    deleteAction: {
      backgroundColor: '#ef4444',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 12,
      marginBottom: 12,
    },
    noEventsText: {
      fontSize: 16,
      color: isDark ? '#94a3b8' : '#64748b',
      textAlign: 'center',
      padding: 40,
    },
  });
}
