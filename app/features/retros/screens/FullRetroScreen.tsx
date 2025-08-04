import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, setDoc, collection, onSnapshot, updateDoc, currentUser } from 'firebase/firestore';
import { db } from '../../../../FirebaseConfig';
import CustomPostIt from '../../../ui/CustomPostIt';
import PrimaryButton from '../../../ui/PrimaryButton';
import { AntDesign } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';

const moods = ['😡', '😕', '😐', '🙂', '😄'];

export default function FullRetroScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { entry } = route.params;

  const [keep, setKeep] = useState<string[]>([]);
  const [drop, setDrop] = useState<string[]>([]);
  const [start, setStart] = useState<string[]>([]);
  const [mood, setMood] = useState<number | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [selectedTab, setSelectedTab] = useState<'Keep' | 'Drop' | 'Start'>('Keep');
  const [authorPseudo, setAuthorPseudo] = useState('');

  const addItem = () => {
    if (inputValue.trim() === '') return;

    if (selectedTab === 'Keep') setKeep([...keep, inputValue.trim()]);
    if (selectedTab === 'Drop') setDrop([...drop, inputValue.trim()]);
    if (selectedTab === 'Start') setStart([...start, inputValue.trim()]);

    setInputValue('');
  };

  const handleValidate = async () => {
    try {
      const retroRef = doc(db, 'retros', entry.id);
      const detailsDocRef = doc(retroRef, 'fullData', 'details');

      await updateDoc(detailsDocRef, {
        keep,
        drop,
        start,
        mood,
      });

      console.log('Données fullRetro mises à jour');
      navigation.goBack();
    } catch (err) {
      if (err.code === 'not-found') {
        try {
          const retroRef = doc(db, 'retros', entry.id);
          const detailsDocRef = doc(retroRef, 'fullData', 'details');

          await setDoc(detailsDocRef, {
            userId: user.uid,
            pseudo: user.displayName,
            keep,
            drop,
            start,
            mood,
          });

          console.log('Données fullRetro créées (fallback)');
          navigation.goBack();
        } catch (error) {
          console.error('Erreur lors de la création du document :', error);
        }
      } else {
        console.error('Erreur lors de la mise à jour dans Firestore :', err);
      }
    }
  };

  const handleReset = () => {
    setKeep([]);
    setDrop([]);
    setStart([]);
    setMood(null);
  };

  const user = getAuth().currentUser;

  useEffect(() => {
    if (!entry?.id) return;

    const fullDataRef = doc(db, 'retros', entry.id, 'fullData', 'details');

    const unsubscribe = onSnapshot(fullDataRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setKeep(data.keep || []);
        setDrop(data.drop || []);
        setStart(data.start || []);
        setMood(data.mood ?? null);

        setAuthorPseudo(user.pseudo || '');
        console.log('pseudo ' + user.pseudo);
      } else {
        console.log('Pas de fullRetro trouvé pour cette rétro');
      }
    });

    return unsubscribe;
  }, [entry?.id]);

  const renderList = (data: string[]) => (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, index }) => (
        <CustomPostIt
          text={item}
          pseudo={authorPseudo}
          onDelete={() => {
            const updated = [...data];
            updated.splice(index, 1);
            if (selectedTab === 'Keep') setKeep(updated);
            if (selectedTab === 'Drop') setDrop(updated);
            if (selectedTab === 'Start') setStart(updated);
          }}
        />
      )}
      ListEmptyComponent={<Text style={styles.empty}>Aucun élément pour le moment.</Text>}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {entry?.title} ({entry?.date})
      </Text>
      <TouchableOpacity style={styles.fab} onPress={handleReset}>
        <AntDesign name="reload1" size={26} color="#5C6BC0" />
      </TouchableOpacity>

      {/* Mood Meter */}
      <Text style={styles.moodTitle}>Mood :</Text>
      <View style={styles.moodRow}>
        {moods.map((emoji, index) => (
          <TouchableOpacity key={emoji} onPress={() => setMood(index + 1)}>
            <Text style={[styles.mood, mood === index + 1 && styles.moodSelected]}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Onglets texte */}
      <View style={styles.tabs}>
        {['Keep', 'Drop', 'Start'].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab as any)}>
            <Text style={[styles.tab, selectedTab === tab && styles.tabSelected]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Saisie item */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputFlex}
          placeholder={`Ajouter un point à "${selectedTab}"...`}
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TouchableOpacity style={styles.iconButton} onPress={addItem}>
          <AntDesign name="pluscircle" size={26} color="#5C6BC0" />
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <View style={{ flex: 1 }}>
        {selectedTab === 'Keep' && renderList(keep)}
        {selectedTab === 'Drop' && renderList(drop)}
        {selectedTab === 'Start' && renderList(start)}
      </View>
      <PrimaryButton onPress={handleValidate} title="Valider la rétro" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  tab: { fontSize: 16, padding: 8, color: '#666' },
  tabSelected: { color: '#6200ee', fontWeight: 'bold' },
  input: {
    height: 50,
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EAF6',
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 15,
    paddingHorizontal: 25,
    fontSize: 16,
    color: '#3C4858',
    shadowColor: '#9E9E9E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  item: { fontSize: 16, paddingVertical: 4 },
  empty: { color: '#888', fontStyle: 'italic' },
  moodTitle: { fontSize: 16, marginTop: 12 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  mood: { fontSize: 28 },
  moodSelected: { borderBottomWidth: 2, borderColor: '#6200ee' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    marginTop: 15,
  },
});
