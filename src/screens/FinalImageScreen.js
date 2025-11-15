import React, { useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderMenu from "../components/HeaderMenu";
// import AdminFab from "../components/AdminFab";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function FinalImageScreen({ route, navigation }) {
  const { roomImage, overlays, roomDimensions } = route.params || {};
  const viewShotRef = useRef();

  // Use roomDimensions if available, otherwise use screen dimensions
  const displayWidth = roomDimensions?.width || screenWidth;
  const displayHeight = roomDimensions?.height || 300;

  const saveImage = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.requestPermissionsAsync();
      await MediaLibrary.saveToLibraryAsync(uri);
      alert("✅ Image saved to gallery!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Final Image!</Text>
        <HeaderMenu />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: "jpg", quality: 1 }}
          style={[
            styles.captureArea,
            { width: displayWidth, height: displayHeight },
          ]}
        >
          <Image
            source={{ uri: roomImage }}
            style={[
              styles.roomImage,
              { width: displayWidth, height: displayHeight },
            ]}
            resizeMode="contain"
          />

          {overlays &&
            overlays.length > 0 &&
            overlays.map((o, index) => (
              <Image
                key={o.id || index}
                source={o.isLocal ? o.src : { uri: o.src }}
                style={{
                  position: "absolute",
                  left: o.x,
                  top: o.y,
                  width: o.width,
                  height: o.height,
                  transform: [{ rotate: `${o.rotation || 0}deg` }],
                  resizeMode: "contain",
                }}
              />
            ))}
        </ViewShot>
      </ScrollView>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>⬅ Back</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.btn} onPress={saveImage}>
          <Text style={styles.btnText}>💾 Save Image</Text>
        </TouchableOpacity> */}
      </View>

      {/* <AdminFab /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  captureArea: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomImage: {
    resizeMode: "contain",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  btn: {
    padding: 14,
    backgroundColor: "#5d9680ff",
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
