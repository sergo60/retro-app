import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, collection, onSnapshot, updateDoc, currentUser } from 'firebase/firestore';
import { db } from '../../../../../FirebaseConfig';
import { getAuth } from 'firebase/auth';

export function FullRetroScreenViewModel() {
  const route = useRoute();
  const navigation = useNavigation();
  const { entry } = route.params as any;

  const [keep, setKeep] = useState<string[]>([]);
  const [drop, setDrop] = useState<string[]>([]);
  const [start, setStart] = useState<string[]>([]);
  const [mood, setMood] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedTab, setSelectedTab] = useState<'Keep' | 'Drop' | 'Start'>('Keep');
  const [authorPseudo, setAuthorPseudo] = useState('');

  const user = getAuth().currentUser;

  const addItem = () => {
    if (inputValue.trim() === '') return;

    const value = inputValue.trim();
    if (selectedTab === 'Keep') setKeep(prev => [...prev, value]);
    if (selectedTab === 'Drop') setDrop(prev => [...prev, value]);
    if (selectedTab === 'Start') setStart(prev => [...prev, value]);

    setInputValue('');
  };

  const handleDeleteItem = (index: number) => {
    const update = (list: string[]) => {
      const updated = [...list];
      updated.splice(index, 1);
      return updated;
    };

    if (selectedTab === 'Keep') setKeep(update(keep));
    if (selectedTab === 'Drop') setDrop(update(drop));
    if (selectedTab === 'Start') setStart(update(start));
  };

  const handleValidate = async () => {
    const retroRef = doc(db, 'retros', entry.id);
    const detailsDocRef = doc(retroRef, 'fullData', 'details');

    try {
      await updateDoc(detailsDocRef, { keep, drop, start, mood });
      navigation.goBack();
    } catch (err: any) {
      if (err.code === 'not-found') {
        try {
          await setDoc(detailsDocRef, {
            userId: user?.uid,
            pseudo: user?.displayName || '',
            keep,
            drop,
            start,
            mood,
          });
          navigation.goBack();
        } catch (error) {
          console.error('Erreur lors de la création du document :', error);
        }
      } else {
        console.error('Erreur lors de la mise à jour :', err);
      }
    }
  };

  const handleReset = () => {
    setKeep([]);
    setDrop([]);
    setStart([]);
    setMood(null);
  };

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
        setAuthorPseudo(user?.displayName || '');
      }
    });

    return unsubscribe;
  }, [entry?.id]);

  return {
    entry,
    keep,
    drop,
    start,
    mood,
    inputValue,
    selectedTab,
    authorPseudo,
    setMood,
    setSelectedTab,
    setInputValue,
    handleDeleteItem,
    addItem,
    handleValidate,
    handleReset,
  };
}
