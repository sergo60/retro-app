import { useDispatch } from 'react-redux';
import { login } from '../../authSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../../FirebaseConfig';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export function LoginScreenViewModel() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        dispatch(login(email));
        navigation.navigate('Retro');
      }
    } catch (e: any) {
      alert('Erreur de connexion : ' + e.message);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    signIn,
  };
}
