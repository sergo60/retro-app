import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../../../FirebaseConfig';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import {
  addItem as addItemAction,
  deleteItem,
  reset,
  setMood as setMoodAction,
  setInitialData,
} from '../../retroDetailsSlice';

export function FullRetroScreenViewModel() {
  const route = useRoute();
  const navigation = useNavigation();
  const { entry } = route.params as any;

  const dispatch = useAppDispatch();

  const keep = useAppSelector(state => state.retroDetails.keep);
  const drop = useAppSelector(state => state.retroDetails.drop);
  const start = useAppSelector(state => state.retroDetails.start);
  const mood = useAppSelector(state => state.retroDetails.mood);

  const [inputValue, setInputValue] = useState('');
  const [selectedTab, setSelectedTab] = useState<'Keep' | 'Drop' | 'Start'>('Keep');
  const [authorPseudo, setAuthorPseudo] = useState('');

  const user = getAuth().currentUser;

  const addItem = () => {
    if (inputValue.trim() === '') return;

    dispatch(addItemAction({ tab: selectedTab, value: inputValue.trim() }));
    setInputValue('');
  };

  const handleDeleteItem = (index: number) => {
    dispatch(deleteItem({ tab: selectedTab, index }));
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
    dispatch(reset());
  };

  const setMood = (value: number | null) => {
    dispatch(setMoodAction(value));
  };

  useEffect(() => {
    if (!entry?.id) return;

    const fullDataRef = doc(db, 'retros', entry.id, 'fullData', 'details');

    const unsubscribe = onSnapshot(fullDataRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        dispatch(
          setInitialData({
            keep: data.keep || [],
            drop: data.drop || [],
            start: data.start || [],
            mood: data.mood ?? null,
          }),
        );
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
