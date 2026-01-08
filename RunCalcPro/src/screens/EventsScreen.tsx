/**
 * Events Screen
 * Displays all race events and allows adding new ones
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  RaceEvent,
  saveRaceEvent,
  loadRaceEvents,
  deleteRaceEvent,
} from '../utils/storage';
import '../i18n/i18nConfig';

export default function EventsScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDateValue, setEventDateValue] = useState<Date>(new Date());
  const [showEventDatePicker, setShowEventDatePicker] = useState(false);
  const [eventType, setEventType] = useState<'5KM' | '10KM' | 'Half Marathon' | 'Marathon' | 'Trail Run' | 'Other'>('5KM');
  const [eventDistance, setEventDistance] = useState('');
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const styles = createStyles(isDark);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const eventsData = await loadRaceEvents();
    setEvents(eventsData);
  };

  // Calculate days until event
  const getDaysUntilEvent = (eventDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get upcoming event
  const getUpcomingEvent = (): RaceEvent | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = events
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
    
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  };

  const upcomingEvent = getUpcomingEvent();
  const daysUntil = upcomingEvent ? getDaysUntilEvent(upcomingEvent.date) : null;

  // Format date as "DD MMM YY"
  const formatEventDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    return `${day} ${month} ${year}`;
  };

  // Get event type display name
  const getEventTypeDisplayName = (type: string): string => {
    switch (type) {
      case '5KM':
        return t('common.eventType5KM');
      case '10KM':
        return t('common.eventType10KM');
      case 'Half Marathon':
        return t('common.eventTypeHalfMarathon');
      case 'Marathon':
        return t('common.eventTypeMarathon');
      case 'Trail Run':
        return t('common.eventTypeTrailRun');
      case 'Other':
        return t('common.eventTypeOther');
      default:
        return type;
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
        <Text style={styles.headerTitle}>{t('common.eventsTitle')}</Text>
        <TouchableOpacity
          onPress={() => setShowAddForm(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Upcoming Event */}
        {upcomingEvent && daysUntil !== null && (
          <View style={styles.upcomingEventCard}>
            <Text style={styles.upcomingEventName}>Event - {upcomingEvent.eventName}</Text>
            <View style={styles.upcomingEventRow}>
              <Text style={styles.upcomingEventDays}>
                {daysUntil > 0 ? `${daysUntil} ${t('common.daysUntil')}` : daysUntil === 0 ? t('common.today') : ''}
              </Text>
              <Text style={styles.upcomingEventDate}>
                {formatEventDate(upcomingEvent.date)}
              </Text>
            </View>
            <Text style={styles.upcomingEventType}>
              {getEventTypeDisplayName(upcomingEvent.type)}
            </Text>
          </View>
        )}

        {/* Events List */}
        <View style={styles.eventsList}>
          <Text style={styles.eventsListTitle}>{t('common.eventsTitle')}</Text>
          {events.length === 0 ? (
            <Text style={styles.noEventsText}>{t('common.noEvents')}</Text>
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
                      <Text style={styles.eventCardDetail}>
                        {event.date} • {getEventTypeDisplayName(event.type)}
                        {event.distance ? ` • ${event.distance} km` : ''}
                      </Text>
                    </View>
                  </View>
                </Swipeable>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add Event Modal */}
      <Modal
        visible={showAddForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tipsModal}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsTitle}>{t('common.addEvent')}</Text>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.tipsContent} showsVerticalScrollIndicator={false}>
              <View style={styles.eventForm}>
                <View style={styles.formGroup}>
                  <TextInput
                    style={styles.input}
                    value={eventName}
                    onChangeText={setEventName}
                    placeholder={t('common.eventNamePlaceholder')}
                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                  />
                </View>

                <View style={styles.formGroup}>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowEventDatePicker(true)}
                  >
                    <Text style={{ color: eventDate ? (isDark ? '#ffffff' : '#1e293b') : (isDark ? '#94a3b8' : '#64748b'), fontSize: 16 }}>
                      {eventDate || 'YYYY-MM-DD'}
                    </Text>
                  </TouchableOpacity>
                  {showEventDatePicker && (
                    <DateTimePicker
                      value={eventDateValue}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowEventDatePicker(false);
                        if (event.type === 'set' && selectedDate) {
                          setEventDateValue(selectedDate);
                          const year = selectedDate.getFullYear();
                          const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                          const day = String(selectedDate.getDate()).padStart(2, '0');
                          setEventDate(`${year}-${month}-${day}`);
                        }
                      }}
                    />
                  )}
                </View>

                <View style={styles.formGroup}>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowEventTypePicker(true)}
                  >
                    <Text style={{ color: isDark ? '#ffffff' : '#1e293b', fontSize: 16 }}>
                      {getEventTypeDisplayName(eventType)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {(eventType === 'Trail Run' || eventType === 'Other') && (
                  <View style={styles.formGroup}>
                    <TextInput
                      style={styles.input}
                      value={eventDistance}
                      onChangeText={setEventDistance}
                      placeholder={t('common.eventDistancePlaceholder')}
                      keyboardType="decimal-pad"
                      placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    if (!eventName.trim()) {
                      Alert.alert('', t('common.eventNameRequired'));
                      return;
                    }
                    if (!eventDate.trim()) {
                      Alert.alert('', t('common.eventDateRequired'));
                      return;
                    }
                    if ((eventType === 'Trail Run' || eventType === 'Other') && !eventDistance.trim()) {
                      Alert.alert('', t('common.eventDistanceRequired'));
                      return;
                    }
                    try {
                      await saveRaceEvent({
                        eventName: eventName.trim(),
                        date: eventDate.trim(),
                        type: eventType,
                        distance: (eventType === 'Trail Run' || eventType === 'Other') ? eventDistance.trim() : undefined,
                      });
                      setEventName('');
                      setEventDate('');
                      setEventDateValue(new Date());
                      setEventType('5KM');
                      setEventDistance('');
                      setShowAddForm(false);
                      await loadEvents();
                    } catch (error) {
                      console.error('Error saving event:', error);
                    }
                  }}
                >
                  <Text style={styles.buttonText}>{t('common.saveEvent')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Type Picker Modal */}
      <Modal
        visible={showEventTypePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEventTypePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEventTypePicker(false)}
        >
          <View style={styles.typePickerModal}>
            <Text style={styles.typePickerTitle}>{t('common.eventType')}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.typePickerOptionModal}
                onPress={() => {
                  setEventType('5KM');
                  setEventDistance('');
                  setShowEventTypePicker(false);
                }}
              >
                <Text style={styles.typePickerOptionText}>{t('common.eventType5KM')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.typePickerOptionModal}
                onPress={() => {
                  setEventType('10KM');
                  setEventDistance('');
                  setShowEventTypePicker(false);
                }}
              >
                <Text style={styles.typePickerOptionText}>{t('common.eventType10KM')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.typePickerOptionModal}
                onPress={() => {
                  setEventType('Half Marathon');
                  setEventDistance('');
                  setShowEventTypePicker(false);
                }}
              >
                <Text style={styles.typePickerOptionText}>{t('common.eventTypeHalfMarathon')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.typePickerOptionModal}
                onPress={() => {
                  setEventType('Marathon');
                  setEventDistance('');
                  setShowEventTypePicker(false);
                }}
              >
                <Text style={styles.typePickerOptionText}>{t('common.eventTypeMarathon')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.typePickerOptionModal}
                onPress={() => {
                  setEventType('Trail Run');
                  setShowEventTypePicker(false);
                }}
              >
                <Text style={styles.typePickerOptionText}>{t('common.eventTypeTrailRun')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.typePickerOptionModal}
                onPress={() => {
                  setEventType('Other');
                  setShowEventTypePicker(false);
                }}
              >
                <Text style={styles.typePickerOptionText}>{t('common.eventTypeOther')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    addButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
      borderRadius: 20,
    },
    addButtonText: {
      fontSize: 24,
      color: '#ffffff',
      fontWeight: '600',
    },
    scrollView: {
      flex: 1,
    },
    upcomingEventCard: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      padding: 16,
      margin: 16,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: isDark ? '#3b82f6' : '#2563eb',
    },
    upcomingEventName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
      marginBottom: 12,
    },
    upcomingEventRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    upcomingEventDays: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#3b82f6' : '#2563eb',
      flex: 1,
    },
    upcomingEventDate: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#94a3b8' : '#64748b',
    },
    upcomingEventType: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
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
    eventCardDetail: {
      fontSize: 14,
      color: isDark ? '#94a3b8' : '#64748b',
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tipsModal: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 20,
      width: '90%',
      maxHeight: '80%',
      overflow: 'hidden',
    },
    tipsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    tipsTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#1e293b',
    },
    closeButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 24,
      color: isDark ? '#94a3b8' : '#64748b',
    },
    tipsContent: {
      maxHeight: 500,
    },
    eventForm: {
      padding: 16,
    },
    formGroup: {
      marginBottom: 16,
    },
    input: {
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#1e293b',
    },
    button: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    typePickerModal: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 16,
      padding: 20,
      maxHeight: '60%',
      width: '80%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    typePickerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#1e293b',
      marginBottom: 16,
      textAlign: 'center',
    },
    typePickerOptionModal: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#334155' : '#e2e8f0',
    },
    typePickerOptionText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#1e293b',
    },
  });
}
