import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View,  } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "./context";
import {
  Input,
  Button
} from 'react-native-elements';
import Firebase from "./firebase";
export default function App() {
  const [user, setUser] = React.useState(null);
  const AuthStack = createStackNavigator();
  
  // const  PhoneSignIn = ()=> {
  //   // If null, no SMS has been sent
  //   const [confirm, setConfirm] = React.useState(null);
  //   const [code, setCode] = React.useState('');
  
  //   // Handle the button press
  //   async function signInWithPhoneNumber(phoneNumber) {
  //     const confirmation = await Firebase.auth().signInWithPhoneNumber(phoneNumber);
  //     setConfirm(confirmation);
  //   }
  
  //   async function confirmCode() {
  //     try {
  //       await confirm.confirm(code);
  //     } catch (error) {
  //       console.log('Invalid code.');
  //     }
  //   }
  
  //   if (!confirm) {
  //     return (
  //       <Button
  //         title="Phone Number Sign In"
  //         onPress={() => signInWithPhoneNumber('+1 650-555-3434')}
  //       />
  //     );
  //   }
  
  //   return (
  //     <>
  //       <TextInput value={code} onChangeText={text => setCode(text)} />
  //       <Button title="Confirm Code" onPress={() => confirmCode()} />
  //     </>
  //   );
  // }
 
  const AuthStackScreen = (user) => {
    return (
      <AuthStack.Navigator initialRouteName="Home">
        <AuthStack.Screen name="Home" component={Home} />
        <AuthStack.Screen name="Home2" component={Home} />
        <AuthStack.Screen name="PhoneSignInScreen" component={PhoneSignInScreen} />
      </AuthStack.Navigator>
    );
  };

  // State management using React hooks/ Context
  const authContext = React.useMemo(() => {
    return {
      signinWithEmailAndPass: () =>{
        Firebase.auth()
          .signInWithEmailAndPassword(props.emailAddress, props.password)
          .then((res) => {
            console.log("User logged-in  to firebase successfully!");
            // setUser(user);
            Firebase.auth().onAuthStateChanged(function (user) {
              if (user) {
                // User is signed in.
                setUser(user);
                console.log(user.uid);
              } else {
                // No user is signed in.
                setUser(null);
              }
            });
          })
          .catch((error) =>
          {
            Alert.alert(
              'Wrong credentials',
              '', // <- this part is optional, you can pass an empty string
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              {cancelable: false},
            );
            console.log("unable to login through fireabser", error)

          }
            
          );
      }, 

      signInWithEmailOnly: ()=>{

      }


    };
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {/* <RootStackScreen user={user} /> */}
        <AuthStackScreen user={user}/>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Home = ({ navigation }) => {
  return (
    <ScreenContainer>
      <Text>Authentication List</Text>
      <Button
        title="Email and Password"
        onPress={() =>
          navigation.navigate("Home2", { name: "React Native School" })
        }
      />
      <Button
        title="Email without password"
        onPress={() =>
          navigation.push("Home2", { name: "React Native School" })
        }
      />
      <Button
        title="Phone Number"
        onPress={() =>
          navigation.navigate("PhoneSignInScreen", { name: "Phone Signin" })
        }
      />
      <Button
        title="Facebook"
        onPress={() =>
          navigation.push("Home2", { name: "React Native School" })
        }
      />
      <Button
        title="Google"
        onPress={() =>
          navigation.push("Home2", { name: "React Native School" })
        }
      />
      <Button
        title="Anonymous"
        onPress={() =>
          navigation.push("Home2", { name: "React Native School" })
        }
      />
    </ScreenContainer>
  );
};

export const PhoneSignInScreen = ({ navigation }) =>{
  const [phone, setPhone] = React.useState(' ');
  const [confirm, setConfirm] = React.useState(null);
  const [code, setCode] = React.useState('');
  
  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
  const confirmation = await Firebase.auth().signInWithPhoneNumber(phoneNumber);
  setConfirm(confirmation)
  console.log(confirmation);
  }
  return (
    <ScreenContainer>
          <Input
            label={"Phone"}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
          />
          <Button
            buttonStyle={{ margin: 10, marginTop: 50 }}
            title="Sign in"
            onPress={() => signInWithPhoneNumber(phone)}
          />
          <Text
            style={{ marginLeft: 100 }}
            onPress={() => {
              navigation.push("Home");
            }}
          >
            No Acount? Sign Up
          </Text>
    </ScreenContainer>
    
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
