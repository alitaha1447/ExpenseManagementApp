import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DisplayScreen from './DisplayScreen';
import { useDispatch, useSelector } from 'react-redux';
import { addExp, resetExpenses } from '../redux/reducer/User';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const [currentDate, setCurrentDate] = useState({
    month: '',
    date: '',
    year: '',
    day: ''
  });
  // console.log(currentDate)
  const [expenseList, setExpenseList] = useState({
    detail: '',
    price: '',
  });
  const dispatch = useDispatch();
  const { expenseData } = useSelector(state => state.User);
  const res = (expenseData.map(item => item.price))
  const res1 = res.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  useEffect(() => {
    const date = new Date();
    console.log(date)
    const month = date.toLocaleString('default', { month: 'long' });
    const dateNumber = date.getDate();
    const year = date.getFullYear();
    const dayNumber = date.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[dayNumber]

    setCurrentDate({
      month: month,
      date: dateNumber,
      year: year,
      day: day,
      monthNumber: date.getMonth() // Store the month number for easier calculation

    });
  }, []);

  // Utility function to update state based on a Date object
  const updateAddDateState = (date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const dateNumber = date.getDate();
    const year = date.getFullYear();
    const day = date.toLocaleString('default', { weekday: 'long' });
    const monthNumber = date.getMonth();

    return {
      month: month,
      date: dateNumber,
      year: year,
      day: day,
      monthNumber: monthNumber
    };
  };
  // Handling Previous Date
  const handlePreviousDay = () => {
    setCurrentDate(prevState => {
      // Subtract one day
      const newDate = new Date(prevState.year, prevState.monthNumber, prevState.date - 1);
      return updateAddDateState(newDate);
    });
    setExpenseList({ detail: '', price: '' }); // Reset expenseList state
    dispatch(resetExpenses()); // Dispatch action to reset expenseData in Redux store

  };
  // Hnadling Next Date
  const handleNextDay = () => {
    setCurrentDate(prevState => {
      // Add one day
      const newDate = new Date(prevState.year, prevState.monthNumber, prevState.date + 1);
      return updateAddDateState(newDate);
    });
    setExpenseList({ detail: '', price: '' }); // Reset expenseList state
    dispatch(resetExpenses()); // Dispatch action to reset expenseData in Redux store

  };


  // Add Expensive
  const addExpense = () => {
    const trimmedDetail = expenseList.detail.trim();
    const trimmedPrice = expenseList.price.trim();

    if (trimmedDetail === '') {
      Alert.alert('Expense required');
      return;
    }
    else if (trimmedPrice === '') {
      Alert.alert('Price required');
      return;
    }
    const newExpense = { detail: trimmedDetail, price: parseFloat(trimmedPrice) }; // Ensure price is a number

    dispatch(addExp(newExpense))
    setExpenseList({ detail: '', price: '' })
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
            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
              <Text style={[styles.text,]}>{`${currentDate.month} ${currentDate.date}, ${currentDate.year}`}</Text>
              <Text style={[styles.text,]}>{`${currentDate.day}`}</Text>
              <Text style={[styles.text,]}>Expense</Text>
              <Text style={[styles.text,]}>{res1.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={handleNextDay}>
              <AntDesign name='caretright' size={50} color={'darkgreen'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ borderBottomWidth: 2, marginHorizontal: 15, borderBottomColor: 'darkgreen' }} />
        {/* Display All Expensive and Prices */}
        <DisplayScreen expenseList={expenseList} />
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
            onChangeText={(text) => setExpenseList((preState) => ({ ...preState, detail: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="grey"
            value={expenseList.price}
            onChangeText={(text) => setExpenseList((preState) => ({ ...preState, price: text }))}
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
    // backgroundColor: '#dcffcc',
    // borderBottomWidth: 2
  },
  topText: {
    color: 'black',
    fontSize: 20,
  },
  text: {
    color: 'darkgreen',  // assuming your text color
    fontSize: 16,    // assuming a font size, adjust as needed
    paddingBottom: 5, // Space between text and line
  },
  middleContainer: {
    backgroundColor: '#ccffb3',
    paddingVertical: 5,
    paddingHorizontal: 5,
    height: 'auto',  // Adjusted for better space management
    justifyContent: 'center',  // Center contents vertically
  },
  label: {
    color: 'darkgreen',
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Distribute space evenly between inputs
    marginBottom: 5,  // Space before the save button
  },
  input: {
    color: 'black',
    backgroundColor: '#ffffe6',
    borderRadius: 5,
    padding: 1,
    flex: 1,  // Flex property to adjust input width dynamically
  },
  saveButton: {
    marginHorizontal: 5,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',  // Align button in the center horizontally
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },


});

export default HomeScreen;
