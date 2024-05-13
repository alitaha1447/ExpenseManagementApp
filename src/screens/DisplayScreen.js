import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Pressable, Alert } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { toggleDelete } from '../redux/reducer/User';
import { deleteExpense } from '../redux/reducer/User';
import { useDispatch, useSelector } from 'react-redux'

const DisplayScreen = (props) => {
  // const { detail, price } = props.expenseList
  const { expenseData, isDelete } = useSelector(state => state.User)
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(toggleDelete())
  }

  const deleteExpense1 = (index) => {
    dispatch(deleteExpense(index))
  }
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.expenseItem}>
        <Text style={styles.itemText}>{item.detail}</Text>
        <Text style={styles.itemText}>{item.price.toFixed(2)}
          {isDelete ? (
            <Pressable onPress={() => deleteExpense1(index)}>
              <MaterialCommunityIcons name='delete' size={20} color={'red'} />
            </Pressable>
          ) : ''}
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, }}>
      <View style={{ marginHorizontal: 15, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ color: 'darkgreen', justifyContent: 'flex-start' }}>{expenseData.length} Item(s)</Text>

        <TouchableOpacity
          style={[
            styles.deleteButton,
            isDelete ? { backgroundColor: 'red' } : { backgroundColor: '#4CAF50' },
            { opacity: expenseData.length === 0 ? 0.5 : 1 } // Adjust opacity based on data
          ]}
          onPress={handleDelete}
          disabled={expenseData.length === 0}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={expenseData}
        keyExtractor={(item, index) => (index.toString())}  // Using index as a key
        renderItem={renderItem}
        style={styles.list}
      />
    </View >
  )
}

export default DisplayScreen;
const styles = StyleSheet.create({
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10
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
})
