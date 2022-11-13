import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Button from "./src/components/Button";
import MapView from "react-native-maps";
import axios from "axios";

export default function App() {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [answer, setAnswer] = useState("");
  const cameraRef = useRef(null);
  const { width, height } = Dimensions.get("window");
  const ASP = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASP;
  const INITIAL_POSTION = {
    latitude: 26.51,
    longitude: 80.56,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermissions(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("Image Saved");
        setImage(null);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (hasCameraPermissions === false) {
    return <Text>No access to the camera</Text>;
  }

  async function predict(query) {
    var myParams = {
      data: query,
    };

    if (query != "") {
      await axios
        .post("https://10.0.2.2:7000/predict", myParams)
        .then(function (response) {
          console.log("SENT");
          console.log(response);
          setAnswer(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("The search query cannot be empty");
    }
  }

  const sendData = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:5000/predict",
        {
          data: image,
        },
        config
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 50,
              paddingTop: 50,
            }}
          >
            <Button
              icon={"retweet"}
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            />
            <Button
              icon={"flash"}
              color={
                flash === Camera.Constants.FlashMode.off ? "gray" : "#f1f1f1"
              }
              onPress={() => {
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                );
              }}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}
      <View>
        {image ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 50,
            }}
          >
            <Button
              title={"Retake"}
              icon="retweet"
              onPress={() => setImage(null)}
            />
            <Button title={"Save"} icon="check" onPress={saveImage} />
            <Button
              title={"Start Predicting"}
              icon="camera"
              onPress={() => setImage(image)}
            />
          </View>
        ) : (
          <View>
            <Button
              title={"Take a Picture"}
              icon="camera"
              onPress={takePicture}
            />
          </View>
        )}
      </View>
      <View style={styles.map_container}>
        <MapView style={styles.map} initialRegion={INITIAL_POSTION} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    width: "100%",
    height: "100%",
  },
  map: {
    position: "relative",
    width: Dimensions.get("window").width * 0.4,
    height: 200,
    top: 0,
  },
  map_container: {
    position: "absolute",
    right: 0,
    bottom: "10%",
    paddingHorizontal: 15,
  },
});
