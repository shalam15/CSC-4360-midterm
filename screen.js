// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Button,
//   FlatList,
//   ActivityIndicator,
//   Modal,
//   Alert,
//   TextInput,
//   Pressable
// } from "react-native";
// import Firebase from "./firebase";
// import ActionButton from "react-native-action-button";
// import { Ionicons } from "@expo/vector-icons";
// import { AuthContext } from "./context";


// const ScreenContainer = ({ children }) => (
//     <View style={styles.container}>{children}</View>
//   );

//   export const Home = ({ navigation }) => {
//     // const { signOut } = React.useContext(AuthContext);
  
//     return (
//       <ScreenContainer>
//         <Text>Master List Screen on number</Text>
//         <Button
//           title="React Native by Example"
//           onPress={() =>
//             navigation.push("Details", { name: "React Native by Example " })
//           }
//         />
//         <Button
//           title="React Native School"
//           onPress={() =>
//             navigation.push("Details", { name: "React Native School" })
//           }
//         />
//         <Button title="SignOut" onPress={() => signOut()} />
//       </ScreenContainer>
//     );
//   };