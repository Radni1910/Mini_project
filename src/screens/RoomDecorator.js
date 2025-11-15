import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  PanResponder,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderMenu from "../components/HeaderMenu";
// import AdminFab from "../components/AdminFab";

const { width } = Dimensions.get("window");

export default function RoomDecorator() {
  const navigation = useNavigation();
  const [roomImage, setRoomImage] = useState(null);
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("lamp");
  const [loading, setLoading] = useState(false);
  const [overlays, setOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [selectedObjectToPlace, setSelectedObjectToPlace] = useState(null);
  const [roomDimensions, setRoomDimensions] = useState({ width: 0, height: 0 });
  const [draggingOverlay, setDraggingOverlay] = useState(null);

  const API_KEY = "49370388-2c98c7b1daf6ac2fd69d4a721";

  useEffect(() => {
    if (query.trim()) {
      fetchImages();
    }
  }, [query]);

  async function fetchImages() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
          query
        )}&image_type=vector&per_page=20`
      );
      const data = await res.json();
      setImages(data.hits || []);
    } catch (err) {
      console.error("Error fetching:", err);
      Alert.alert("Error", "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setRoomImage(result.assets[0].uri);
      setOverlays([]);
      setSelectedObjectToPlace(null);
    }
  }
  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission Required", "Camera permission is needed.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setRoomImage(result.assets[0].uri);
      setOverlays([]);
      setSelectedObjectToPlace(null);
    }
  }

  function handleObjectSelect(imgUrl) {
    setSelectedObjectToPlace(imgUrl);
    setSelectedOverlay(null);
  }

  function handleRoomPress(event) {
    if (!selectedObjectToPlace) return;

    const { locationX, locationY } = event.nativeEvent;

    const newOverlay = {
      id: Date.now(),
      src: selectedObjectToPlace,
      x: locationX - 75,
      y: locationY - 75,
      width: 150,
      height: 150,
      rotation: 0,
    };

    setOverlays([...overlays, newOverlay]);
    setSelectedOverlay(newOverlay.id);
    setSelectedObjectToPlace(null);
  }

  function createPanResponder(overlay) {
    return PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only respond if touching the overlay itself
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Start dragging if moved more than 5 pixels
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        setDraggingOverlay(overlay.id);
        setSelectedOverlay(overlay.id);
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = overlay.x + gestureState.dx;
        const newY = overlay.y + gestureState.dy;

        // Keep overlay within bounds
        const maxX = roomDimensions.width - overlay.width;
        const maxY = roomDimensions.height - overlay.height;

        updateOverlay(overlay.id, {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      },
      onPanResponderRelease: () => {
        setDraggingOverlay(null);
      },
      onPanResponderTerminationRequest: () => false,
    });
  }

  function updateOverlay(id, updates) {
    setOverlays(overlays.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  }

  function deleteOverlay(id) {
    setOverlays(overlays.filter((o) => o.id !== id));
    if (selectedOverlay === id) setSelectedOverlay(null);
  }

  function handleOverlayPress(overlayId) {
    setSelectedOverlay(overlayId);
  }

  function handleRotate(id) {
    const overlay = overlays.find((o) => o.id === id);
    if (overlay) {
      updateOverlay(id, { rotation: (overlay.rotation + 45) % 360 });
    }
  }

  function handleResize(id, delta) {
    const overlay = overlays.find((o) => o.id === id);
    if (overlay) {
      const newWidth = Math.max(50, Math.min(300, overlay.width + delta));
      const newHeight = Math.max(50, Math.min(300, overlay.height + delta));
      updateOverlay(id, { width: newWidth, height: newHeight });
    }
  }

  const renderObjectItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.objectCard,
        selectedObjectToPlace === item.webformatURL &&
          styles.objectCardSelected,
      ]}
      onPress={() => handleObjectSelect(item.webformatURL)}
    >
      <Image
        source={{ uri: item.webformatURL }}
        style={styles.objectImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  if (!roomImage) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={{ alignItems: "flex-end", padding: 12 }}>
          <HeaderMenu />
        </View>
        <View style={styles.uploadContainer}>
          <Ionicons name="cloud-upload-outline" size={80} color="#9CA3AF" />
          <Text style={styles.uploadTitle}>Upload Your Room Photo</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadButtonText}>Choose Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Text style={styles.cameraButtonText}>Take Live Photo</Text>
          </TouchableOpacity>
        </View>
        {/* <AdminFab /> */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{ alignItems: "flex-end", padding: 12 }}>
        <HeaderMenu />
      </View>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomButtonLeft}
            onPress={() => {
              setRoomImage(null);
              setOverlays([]);
            }}
          >
            <Text style={styles.bottomButtonText}>Change Room</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomButtonRight}
            onPress={() =>
              navigation.navigate("FinalImageScreen", {
                roomImage,
                overlays,
                roomDimensions,
              })
            }
          >
            <Text style={styles.bottomButtonText}>Final Image</Text>
          </TouchableOpacity>
        </View>

        {/* Place Object Banner */}
        {selectedObjectToPlace && (
          <View style={styles.placeObjectBanner}>
            <Ionicons name="hand-left-outline" size={24} color="#1E40AF" />
            <Text style={styles.placeObjectText}>
              Tap anywhere on the room to place the object
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedObjectToPlace(null)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Room Preview with Draggable Overlays */}
        <View style={styles.roomContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleRoomPress}
            style={[
              styles.roomTouchable,
              selectedObjectToPlace && styles.roomContainerActive,
            ]}
          >
            <Image
              source={{ uri: roomImage }}
              style={styles.roomImage}
              resizeMode="contain"
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setRoomDimensions({ width, height });
              }}
            />
          </TouchableOpacity>
          {overlays.map((overlay) => {
            const panResponder = createPanResponder(overlay);
            const isDragging = draggingOverlay === overlay.id;

            return (
              <View
                key={overlay.id}
                {...panResponder.panHandlers}
                style={[
                  styles.draggableOverlay,
                  {
                    left: overlay.x,
                    top: overlay.y,
                    width: overlay.width,
                    height: overlay.height,
                    transform: [{ rotate: `${overlay.rotation}deg` }],
                    opacity: isDragging ? 0.8 : 1,
                  },
                  selectedOverlay === overlay.id && styles.overlaySelected,
                ]}
              >
                <Image
                  source={{ uri: overlay.src }}
                  style={styles.overlayImage}
                  resizeMode="contain"
                />
                <View style={styles.overlayControls}>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => handleRotate(overlay.id)}
                  >
                    <Ionicons name="refresh" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => handleResize(overlay.id, 10)}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => handleResize(overlay.id, -10)}
                  >
                    <Ionicons name="remove" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => deleteOverlay(overlay.id)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Edit Selected Overlay Actions */}
        {selectedOverlay && (
          <View style={styles.editPanel}>
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteOverlay(selectedOverlay)}
              >
                <Ionicons name="trash-outline" size={20} color="#FFF" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deselectButton}
                onPress={() => setSelectedOverlay(null)}
              >
                <Text style={styles.deselectButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Search Objects */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Add Objects</Text>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search sofa, plant, lamp..."
              value={query}
              onChangeText={setQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#8B5CF6"
              style={styles.loader}
            />
          )}

          <FlatList
            data={images}
            renderItem={renderObjectItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            columnWrapperStyle={styles.objectRow}
          />
        </View>
      </ScrollView>
      {/* <AdminFab /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    flex: 1,
  },
  uploadContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    marginVertical: 20,
  },
  uploadButton: {
    backgroundColor: "#5d9680ff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // changeRoomButton: {
  //   marginTop: 10,
  //   backgroundColor: "#529c75ff",
  //   paddingVertical: 8,
  //   paddingHorizontal: 10,
  //   borderRadius: 7,
  // },
  // changeRoomText: {
  //   color: "#fff",
  //   fontSize: 13,
  //   fontWeight: "600",
  // },
  // finalButton: {
  //   backgroundColor: "#529c75ff",
  //   paddingVertical: 8,
  //   paddingHorizontal: 12,
  //   borderRadius: 6,
  //   marginLeft: 10, // gives space between both buttons
  // },

  // finalButtonText: {
  //   color: "#fdf9f9ff",
  //   fontWeight: "600",
  //   fontSize: 14,
  // },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    zIndex: 999, // Add this
    elevation: 10,
  },

  bottomButtonLeft: {
    flex: 1,
    backgroundColor: "#529c75ff",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },

  bottomButtonRight: {
    flex: 1,
    backgroundColor: "#529c75ff",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },

  bottomButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  cameraButton: {
    marginTop: 12,
    backgroundColor: "#55a19cff",
    paddingHorizontal: 30,
    paddingVertical: 17,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  changeButton: {
    backgroundColor: "#6B7280",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  cameraButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  roomContainer: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    position: "relative",
    minHeight: 300,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  roomContainerActive: {
    borderColor: "#3B82F6",
    borderStyle: "dashed",
  },
  roomTouchable: {
    width: "100%",
  },
  roomImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  draggableOverlay: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "transparent",
    zIndex: 10,
  },
  overlaySelected: {
    borderColor: "#3B82F6",
    borderStyle: "dashed",
  },
  overlayImage: {
    width: "100%",
    height: "100%",
  },
  overlayControls: {
    position: "absolute",
    top: -8,
    right: -8,
    flexDirection: "row",
    gap: 4,
  },
  controlBtn: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  placeObjectBanner: {
    backgroundColor: "#DBEAFE",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  placeObjectText: {
    flex: 1,
    color: "#1E40AF",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  editPanel: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  controlRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  sliderContainer: {
    flex: 1,
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 8,
  },
  controlButton: {
    backgroundColor: "#E5E7EB",
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 60,
    textAlign: "center",
  },
  valueInput: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 60,
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  deselectButton: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deselectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  searchSection: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  loader: {
    marginVertical: 20,
  },
  objectGrid: {
    paddingBottom: 20,
  },
  objectRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  objectCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: 8,
  },
  objectCardSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  objectImage: {
    width: "100%",
    height: 80,
  },
});
