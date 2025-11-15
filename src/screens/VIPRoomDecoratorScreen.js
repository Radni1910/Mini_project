import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PanResponder,
  Alert,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderMenu from "../components/HeaderMenu";

const { width } = Dimensions.get("window");

const FURNITURE_CATEGORIES = {
  sofas: [
    { id: 1, name: "Modern Sofa", image: require("../../assets/sofa5.png") },
    { id: 2, name: "Luxury Sofa", image: require("../../assets/sofa3.png") },
    { id: 3, name: "Corner Sofa", image: require("../../assets/sf2.png") },
    { id: 4, name: "Leather Sofa", image: require("../../assets/sofa.png") },
  ],
  lamps: [
    { id: 5, name: "Table Lamp", image: require("../../assets/lamp.png") },
    { id: 6, name: "Floor Lamp", image: require("../../assets/lamp2.png") },
    { id: 7, name: "Modern Lamp", image: require("../../assets/lamp3.png") },
    { id: 8, name: "Designer Lamp", image: require("../../assets/lamp4.png") },
  ],
  tables: [
    { id: 9, name: "Coffee Table", image: require("../../assets/table1.png") },
    { id: 10, name: "Dining Table", image: require("../../assets/table2.png") },
    { id: 11, name: "Side Table", image: require("../../assets/table3.png") },
    { id: 12, name: "Modern Table", image: require("../../assets/table4.png") },
  ],
  plants: [
    { id: 13, name: "Monstera", image: require("../../assets/plant.png") },
    { id: 14, name: "Fiddle Leaf", image: require("../../assets/plant1.png") },
    { id: 15, name: "Snake Plant", image: require("../../assets/plant3.png") },
    { id: 16, name: "Pothos", image: require("../../assets/plant4.png") },
  ],
  TV: [
    { id: 17, name: "Normal", image: require("../../assets/tv1.png") },
    { id: 18, name: "stand", image: require("../../assets/tv2.png") },
    { id: 19, name: "wall", image: require("../../assets/tv3.png") },
    { id: 20, name: "OLED", image: require("../../assets/tv4.png") },
  ],
  Bookshelves: [
    { id: 21, name: "wall-mounted", image: require("../../assets/shelf1.png") },
    { id: 22, name: "freestanding", image: require("../../assets/shelf2.png") },
    { id: 23, name: "cube", image: require("../../assets/shelf3.png") },
    { id: 24, name: "floating", image: require("../../assets/shelf4.png") },
  ],
  Bed: [
    { id: 25, name: "Single", image: require("../../assets/bed3.png") },
    { id: 26, name: "Double ", image: require("../../assets/bed4.png") },
    { id: 27, name: "Queen", image: require("../../assets/bed1.png") },
    { id: 28, name: "King", image: require("../../assets/bed2.png") },
  ],
  Wardrobes: [
    { id: 29, name: "wooden", image: require("../../assets/wd1.png") },
    { id: 30, name: "antic", image: require("../../assets/wd2.png") },
    { id: 31, name: "glass", image: require("../../assets/wd3.png") },
    { id: 32, name: "modern", image: require("../../assets/wd4.png") },
  ],
  Nightstands: [
    { id: 33, name: "modern", image: require("../../assets/s1.png") },
    { id: 34, name: "designer", image: require("../../assets/s2.png") },
    { id: 35, name: "drawer", image: require("../../assets/s3.png") },
    { id: 36, name: "wooden", image: require("../../assets/s4.png") },
  ],
  Kitchen: [
    { id: 37, name: "wooden", image: require("../../assets/k1.png") },
    { id: 38, name: "stand", image: require("../../assets/k2.png") },
    { id: 39, name: "modular", image: require("../../assets/k3.png") },
    { id: 40, name: "multipurpose", image: require("../../assets/k4.png") },
  ],
  office: [
    { id: 41, name: "Office Desk", image: require("../../assets/table.png") },
    { id: 42, name: "Office Chair", image: require("../../assets/chair.png") },
    { id: 43, name: "Printer Table", image: require("../../assets/print.png") },
    { id: 44, name: "Computer Table", image: require("../../assets/comp.png") },
  ],
  Balcony: [
    { id: 45, name: "Swing", image: require("../../assets/swing.png") },
    {
      id: 46,
      name: "Outdoor Chairs",
      image: require("../../assets/bchairs.png"),
    },
    { id: 47, name: "Patio Table", image: require("../../assets/patio.png") },
    { id: 48, name: "Garden Bench", image: require("../../assets/bench.png") },
  ],
};

export default function VIPRoomDecoratorScreen() {
  const navigation = useNavigation();
  const [roomImage, setRoomImage] = useState(null);
  const [overlays, setOverlays] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("sofas");
  const [selectedObjectToPlace, setSelectedObjectToPlace] = useState(null);
  const [roomDimensions, setRoomDimensions] = useState({ width: 0, height: 0 });
  const [draggingOverlay, setDraggingOverlay] = useState(null);
  const viewShotRef = useRef();

  const categories = Object.keys(FURNITURE_CATEGORIES);

  async function pickRoomImage() {
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

  async function takeRoomPhoto() {
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

  function handleObjectSelect(item) {
    setSelectedObjectToPlace(item);
  }

  function handleRoomPress(event) {
    if (!selectedObjectToPlace || !roomImage) return;

    const { locationX, locationY } = event.nativeEvent;

    const newOverlay = {
      id: Date.now(),
      item: selectedObjectToPlace,
      x: locationX - 75,
      y: locationY - 75,
      width: 150,
      height: 150,
      rotation: 0,
    };

    setOverlays([...overlays, newOverlay]);
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

  const saveImage = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.requestPermissionsAsync();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "✅ Image saved to gallery!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save image");
    }
  };

  const goToFinalImage = () => {
    // For local images, we'll need to handle them differently
    // For now, we'll pass the image source directly
    navigation.navigate("FinalImageScreen", {
      roomImage,
      overlays: overlays.map((o) => ({
        id: o.id,
        src: o.item.image, // Local image source
        isLocal: true, // Flag to indicate local image
        x: o.x,
        y: o.y,
        width: o.width,
        height: o.height,
        rotation: o.rotation,
      })),
      roomDimensions,
    });
  };

  if (!roomImage) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.premiumHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.premiumTitle}>VIP Room Decorator</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity onPress={pickRoomImage}>
              <Ionicons name="refresh-outline" size={24} color="#FFD700" />
            </TouchableOpacity>
            <HeaderMenu color="#FFD700" background="#2a2a2a" />
          </View>
        </View>

        <View style={styles.roomSelectionContainer}>
          <Ionicons
            name="diamond"
            size={80}
            color="#FFD700"
            style={styles.diamondIcon}
          />
          <Text style={styles.welcomeTitle}>Choose Your Room</Text>
          <Text style={styles.welcomeSubtitle}>
            Select a photo of your room to start decorating
          </Text>

          <TouchableOpacity
            style={styles.premiumButton}
            onPress={pickRoomImage}
          >
            <Ionicons name="images-outline" size={24} color="#1a1a1a" />
            <Text style={styles.premiumButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.premiumButtonSecondary}
            onPress={takeRoomPhoto}
          >
            <Ionicons name="camera-outline" size={24} color="#FFD700" />
            <Text style={styles.premiumButtonTextSecondary}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentItems = FURNITURE_CATEGORIES[selectedCategory] || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Premium Header */}
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="diamond" size={20} color="#FFD700" />
          <Text style={styles.premiumTitle}>VIP Decorator</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={pickRoomImage}>
            <Ionicons name="refresh-outline" size={24} color="#FFD700" />
          </TouchableOpacity>
          <HeaderMenu color="#FFD700" background="#2a2a2a" />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Room Preview with Draggable Overlays */}
        <View style={styles.roomContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 1 }}
            style={styles.viewShot}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleRoomPress}
              style={styles.roomTouchable}
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
                  ]}
                >
                  <Image
                    source={overlay.item.image}
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
          </ViewShot>

          {selectedObjectToPlace && (
            <View style={styles.placeBanner}>
              <Ionicons name="hand-left" size={24} color="#FFD700" />
              <Text style={styles.placeBannerText}>
                Tap on the room to place the item
              </Text>
              <TouchableOpacity onPress={() => setSelectedObjectToPlace(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.categoryTabActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Ionicons
                  name={
                    category === "sofas"
                      ? "bed-outline"
                      : category === "lamps"
                      ? "bulb-outline"
                      : category === "tables"
                      ? "square-outline"
                      : category === "TV"
                      ? "tv-outline"
                      : category === "plants"
                      ? "leaf-outline"
                      : category === "Bookshelves"
                      ? "library-outline"
                      : category === "Bed"
                      ? "bed"
                      : category === "Wardrobes"
                      ? "business-outline"
                      : category === "Nightstands"
                      ? "cube-outline"
                      : category === "Kitchen"
                      ? "restaurant-outline"
                      : category === "office"
                      ? "briefcase-outline"
                       : category === "Balcony"
                      ? "sunny-outline"
                      : "grid-outline"
                  }
                  size={20}
                  color={selectedCategory === category ? "#FFD700" : "#999"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Furniture Items Grid */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>
            Premium{" "}
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </Text>
          <FlatList
            data={currentItems}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.itemCard,
                  selectedObjectToPlace?.id === item.id &&
                    styles.itemCardSelected,
                ]}
                onPress={() => handleObjectSelect(item)}
              >
                <View style={styles.itemImageContainer}>
                  <Image
                    source={item.image}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                  {selectedObjectToPlace?.id === item.id && (
                    <View style={styles.selectedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#FFD700"
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.itemsGrid}
          />
        </View>

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
            onPress={goToFinalImage}
          >
            <Text style={styles.bottomButtonText}>Final Image</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#2a2a2a",
    borderBottomWidth: 2,
    borderBottomColor: "#FFD700",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  roomSelectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  diamondIcon: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 40,
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    padding: 18,
    borderRadius: 12,
    width: "100%",
    marginBottom: 16,
    gap: 12,
  },
  premiumButtonText: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "bold",
  },
  premiumButtonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFD700",
    padding: 18,
    borderRadius: 12,
    width: "100%",
    gap: 12,
  },
  premiumButtonTextSecondary: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
  roomContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#2a2a2a",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  roomTouchable: {
    width: "100%",
  },
  viewShot: {
    position: "relative",
    width: "100%",
  },
  roomImage: {
    width: "100%",
    minHeight: 300,
    backgroundColor: "#000",
  },
  draggableOverlay: {
    position: "absolute",
    zIndex: 10,
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
  placeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFD700",
    gap: 12,
  },
  placeBannerText: {
    flex: 1,
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelText: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  categoryContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    gap: 8,
  },
  categoryTabActive: {
    backgroundColor: "#FFD700",
  },
  categoryText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#1a1a1a",
  },
  itemsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 16,
  },
  itemsGrid: {
    gap: 12,
  },
  itemCard: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 12,
    margin: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  itemCardSelected: {
    borderColor: "#FFD700",
    backgroundColor: "#3a3a3a",
  },
  itemImageContainer: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginBottom: 8,
    position: "relative",
  },
  itemImage: {
    width: "80%",
    height: "80%",
  },
  selectedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  itemName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#FFD700",
    zIndex: 999,
    elevation: 10,
  },
  bottomButtonLeft: {
    flex: 1,
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  bottomButtonRight: {
    flex: 1,
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
  },
});
