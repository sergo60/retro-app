import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RetroCard from '../ui/RetroCard';
import CustomTextInput from '../ui/CustomTextInput';
import CustomDateInput from '../ui/CustomDateInput';
import PrimaryButton from '../ui/PrimaryButton';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig';

export default function RetroScreen() {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = selectedDate => {
    const formattedDate = selectedDate.toLocaleDateString('fr-FR');
    setDate(formattedDate);
    hideDatePicker();
  };

  const handleSubmit = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    if (!title.trim() || !date.trim() || !description.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis.');
      return;
    }

    const updatedEntry = {
      title,
      date,
      description,
      userId: user.uid,
      createdAt: new Date(),
    };

    try {
      if (editingEntry) {
        const retroRef = doc(db, 'retros', editingEntry.id);
        await updateDoc(retroRef, updatedEntry);

        setEntries(prev => {
          const newEntry = { id: docRef.id, ...updatedEntry };
          const filtered = prev.filter(entry => entry.id !== docRef.id);
          return [newEntry, ...filtered];
        });
      } else {
        const docRef = await addDoc(collection(db, 'retros'), updatedEntry);
        setEntries(prev => {
          const newEntry = { id: docRef.id, ...updatedEntry };
          const filtered = prev.filter(entry => entry.id !== docRef.id);
          return [newEntry, ...filtered];
        });
      }

      setModalVisible(false);
      setEditingEntry(null);
      setTitle('');
      setDate('');
      setDescription('');
    } catch (error) {
      console.error('Erreur ajout ou édition rétro :', error);
    }
  };

  const deleteRetro = async (retroId: string) => {
    try {
      const retroRef = doc(db, 'retros', retroId);

      await deleteDoc(retroRef);

      console.log(`Rétro ${retroId} supprimée`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la rétro :', error);
    }
  };

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;

    const q = query(collection(db, 'retros'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    });

    return unsubscribe;
  }, []);

  const removeCart = async (entryId: string) => {
    await deleteRetro(entryId);
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setDate(entry.date);
    setDescription(entry.description);
    setModalVisible(true);
  };

  const renderCard = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FullRetro', { entry: item })}
    >
      <RetroCard
        title={item.title}
        date={item.date}
        description={item.description}
        onDelete={() => removeCart(item.id)}
        onEdit={() => handleEdit(item)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>Aucune rétro ajoutée.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <AntDesign name="pluscircle" size={56} color="#5C6BC0" />
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.sheet}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.sheetTitle}>Ajouter une rétro</Text>

            <Text style={styles.subTitle}>Titre</Text>
            <CustomTextInput placeholder="Rétro 1" value={title} onChangeText={setTitle} required />
            <Text style={styles.subTitle}>Date</Text>

            <CustomDateInput
              placeholder="Ex : 28/07/2025"
              value={date}
              onPress={showDatePicker}
              required
            />
            <Text style={styles.subTitle}>Description</Text>

            <TextInput
              placeholder="Ex : Participants..."
              style={[styles.input, { height: 80 }]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <PrimaryButton onPress={handleSubmit} title="Ajouter" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDate: { fontSize: 14, color: '#555' },
  cardDesc: { marginTop: 6, color: '#333' },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
