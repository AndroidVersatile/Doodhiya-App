import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Vibration,
  FlatList
} from "react-native";
const MultiSelectList = () => {
  const [items, setItems] = useState([
    { id: "1", name: "Apple" },
    { id: "2", name: "Banana" },
    { id: "3", name: "Orange" },
    { id: "4", name: "Mango" },
  ]);

  const [selected, setSelected] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const toggleSelect = (id) => {
    if (!selectionMode) return;
    Vibration.vibrate(50); // light vibration
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const startSelectionMode = (id) => {

    Vibration.vibrate(100); // stronger vibration

    setSelectionMode(true);
    setSelected([id]); // first selected item
  };

  const deleteSelected = () => {
    Vibration.vibrate(200); // strong warning vibration
    setItems((prev) => prev.filter((item) => !selected.includes(item.id)));
    setSelected([]);
    setSelectionMode(false);
  };

  const selectAll = () => {
    setSelected(items.map((item) => item.id));
  };

  const deselectAll = () => setSelected([]);
  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
        onLongPress={() => startSelectionMode(item.id)}
        style={[styles.item, isSelected && styles.selectedItem]}
      >
        {selectionMode && (
          <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
            {isSelected && <Text style={styles.checkMark}>✓</Text>}
          </View>
        )}

        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>

    );
  };

  return (
    <View style={styles.container}>
      {selectionMode && (
        <View style={styles.topBar}>
          <TouchableOpacity onPress={deleteSelected} style={styles.topBtn}>
            <Text style={styles.topBtnText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={selectAll} style={styles.topBtn}>
            <Text style={styles.topBtnText}>Select All</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={deselectAll} style={styles.topBtn}>
            <Text style={styles.topBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    marginTop: 40
  },

  topBar: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },

  topBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  topBtnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedItem: {
    backgroundColor: "#cce4ff",
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#777",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  checkedBox: {
    backgroundColor: "#2c7cff",
    borderColor: "#2c7cff",
  },

  checkMark: {
    color: "white",
    fontWeight: "bold"
  },

  text: {
    fontSize: 18
  },

  swipeDelete: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 10,
  },
});
export default MultiSelectList