import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDelete, deleteExpense } from '../redux/reducer/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";


const DisplayScreen = ({ updateTotalExpense, dateKey, expenses, setExpense }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);


  // const { isDelete } = useSelector(state => state.User);
  const dispatch = useDispatch();

  useEffect(() => { setIsDelete(false); }, [dateKey]);

  const handleDelete = () => {
    // dispatch(toggleDelete());
    setIsDelete(!isDelete);

  };

  const deleteExpenseItem = async (index) => {
    try {
      const storedExpenses = await AsyncStorage.getItem(dateKey);
      if (storedExpenses !== null) {
        const expensesArray = JSON.parse(storedExpenses);
        expensesArray.splice(index, 1);
        await AsyncStorage.setItem(dateKey, JSON.stringify(expensesArray));
        updateTotalExpense(expensesArray);
        setExpense(expensesArray)
        // dispatch(deleteExpense(index));
        setModalVisible(true)
        // Alert.alert('Deleted Successfully!!!')
      }
    } catch (error) {
      console.log('Delete Expense Item : ', error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.expenseItem}>
        <Text style={styles.itemText}>{item.detail}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.itemText}>{item.price.toFixed(2)}</Text>
          {isDelete ? (
            <TouchableOpacity onPress={() => deleteExpenseItem(index)} style={styles.deleteIconContainer}>
              <MaterialCommunityIcons name='delete' size={26} color={'red'} />
            </TouchableOpacity>
          ) : null}
        </View>

      </View>
    );
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 15, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ color: 'darkgreen', justifyContent: 'flex-start' }}>{expenses.length} Item(s)</Text>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            { backgroundColor: expenses.length === 0 ? '#4CAF50' : isDelete ? 'red' : '#4CAF50' },
            { opacity: expenses.length === 0 ? 0.5 : 1 }
          ]}
          onPress={handleDelete}
          disabled={expenses.length === 0}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        data={expenses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Modal

        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Item Deleted Successfully!!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  expenseItem: {

    marginHorizontal: 15,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#dcffcc',
    padding: 10,
    borderRadius: 5,
  },
  itemText: {
    color: 'darkgreen',
    fontSize: 16,
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIconContainer: {
    marginLeft: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#ccffb3',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'darkgreen',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'darkgreen',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default DisplayScreen;
