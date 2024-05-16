import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, StatusBar, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DisplayScreen from './DisplayScreen';
import { useDispatch, useSelector } from 'react-redux';
import { addExp, toggleDelete } from '../redux/reducer/User';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [currentDate, setCurrentDate] = useState({
    month: '', date: '', year: '', day: '', monthNumber: 0
  });
  const [expenseList, setExpenseList] = useState({ detail: '', price: '' });
  const [expense, setExpense] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  // const { isDelete } = useSelector(state => state.User);
  const dispatch = useDispatch();

  useEffect(() => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const dateNumber = date.getDate();
    const year = date.getFullYear();
    const dayNumber = date.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[dayNumber];

    setCurrentDate({
      month, date: dateNumber, year, day, monthNumber: date.getMonth()
    });
  }, []);

  useEffect(() => {
    fetchExpenseForDate(currentDate);
  }, [currentDate]);

  const fetchExpenseForDate = async (date) => {
    const dateKey = `${date.year}-${date.monthNumber + 1}-${date.date}`;
    try {
      const value = await AsyncStorage.getItem(dateKey);
      if (value !== null) {
        const storedExpenses = JSON.parse(value);
        setExpense(storedExpenses);
        updateTotalExpense(storedExpenses);

      } else {
        setExpense([]);
        setTotalExpense(0);
      }
    } catch (error) {
      console.log('Fetch Expense For Date ', error);
    }
  };

  const updateAddDateState = (date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const dateNumber = date.getDate();
    const year = date.getFullYear();
    const day = date.toLocaleString('default', { weekday: 'long' });
    const monthNumber = date.getMonth();
    return { month, date: dateNumber, year, day, monthNumber };
  };

  const handlePreviousDay = () => {
    setCurrentDate(prevState => {
      const newDate = new Date(prevState.year, prevState.monthNumber, prevState.date - 1);
      return updateAddDateState(newDate);
    });
    setExpenseList({ detail: '', price: '' });
    // setExpense([]);
    // setTotalExpense(0);
  };

  const handleNextDay = () => {
    setCurrentDate(prevState => {
      const newDate = new Date(prevState.year, prevState.monthNumber, prevState.date + 1);
      return updateAddDateState(newDate);
    });
    setExpenseList({ detail: '', price: '' });
    // setExpense([]);
    // setTotalExpense(0);
  };

  const addExpense = async () => {
    const trimmedDetail = expenseList.detail;
    const trimmedPrice = expenseList.price.trim();

    if (trimmedDetail === '' || trimmedPrice === '') {
      Alert.alert('Expense and Price are required');
      return;
    }

    const newExpense = { detail: trimmedDetail, price: parseFloat(trimmedPrice) };
    // Update Redux state first
    dispatch(addExp(newExpense))
    const dateKey = `${currentDate.year}-${currentDate.monthNumber + 1}-${currentDate.date}`;

    try {
      const storedExpenses = await AsyncStorage.getItem(dateKey);
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      expenses.push(newExpense);
      await AsyncStorage.setItem(dateKey, JSON.stringify(expenses));
      setExpenseList({ detail: '', price: '' });
      setExpense(expenses);
      updateTotalExpense(expenses);

    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  const updateTotalExpense = (expensesArray) => {
    const total = expensesArray.reduce((acc, item) => acc + item.price, 0);
    setTotalExpense(total);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#669900'} />
      <View style={styles.topContainer}>
        <View style={styles.topContainer1}>
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={handlePreviousDay}>
              <AntDesign name='caretleft' size={50} color={'darkgreen'} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={styles.text}>{`${currentDate.month} ${currentDate.date}, ${currentDate.year}`}</Text>
              <Text style={styles.text}>{currentDate.day}</Text>
              <Text style={styles.text}>Expense</Text>
              <Text style={styles.text}>{totalExpense.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={handleNextDay}>
              <AntDesign name='caretright' size={50} color={'darkgreen'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ borderBottomWidth: 2, marginHorizontal: 15, borderBottomColor: 'darkgreen' }} />
        {/* Display Expense List */}
        <DisplayScreen expenses={expense} updateTotalExpense={updateTotalExpense} dateKey={`${currentDate.year}-${currentDate.monthNumber + 1}-${currentDate.date}`} setExpense={setExpense} />
        {/*  */}
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.label}>New:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { marginRight: 5 }]}
            placeholder="Detail"
            placeholderTextColor="grey"
            value={expenseList.detail}
            onChangeText={(text) => setExpenseList(preState => ({ ...preState, detail: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="grey"
            value={expenseList.price}
            onChangeText={(text) => setExpenseList(preState => ({ ...preState, price: text }))}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={addExpense}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffe6',
  },
  topContainer: {
    flex: 1,
  },
  topContainer1: {
    height: height / 4,
  },
  text: {
    color: 'darkgreen',
    fontSize: 16,
    paddingBottom: 5,
  },
  middleContainer: {
    backgroundColor: '#ccffb3',
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  label: {
    color: 'darkgreen',
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  input: {
    color: 'black',
    backgroundColor: '#ffffe6',
    borderRadius: 5,
    padding: 1,
    flex: 1,
  },
  saveButton: {
    marginHorizontal: 5,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;
