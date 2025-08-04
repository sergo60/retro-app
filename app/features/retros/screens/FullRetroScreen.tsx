import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CustomPostIt from '../../../ui/CustomPostIt';
import PrimaryButton from '../../../ui/PrimaryButton';
import { AntDesign } from '@expo/vector-icons';
import { FullRetroScreenViewModel } from './viewModels/FullRetroScreenViewModel';

const moods = ['😡', '😕', '😐', '🙂', '😄'];

export default function FullRetroScreen() {
  const {
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
    } = FullRetroScreenViewModel();

  const renderList = (data: string[]) => (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, index }) => (
        <CustomPostIt
          text={item}
          pseudo={authorPseudo}
          onDelete={() => handleDeleteItem(index)}
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
