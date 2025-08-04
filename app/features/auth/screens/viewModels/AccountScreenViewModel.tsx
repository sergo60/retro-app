import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../../../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { login } from '../../authSlice';
import { useNavigation } from '@react-navigation/native';

export function AccountScreenViewModel() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: pseudo });

      dispatch(register(email));
      navigation.navigate('Login');
    } catch (e: any) {
      alert('Erreur lors de l’inscription : ' + e.message);
    }
  };

  return {
    pseudo,
    setPseudo,
    email,
    setEmail,
    password,
    setPassword,
    signUp,
  };
}
