import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "./context";
import { Input, Button, Card } from "react-native-elements";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import * as Facebook from 'expo-facebook';
import * as GoogleSignIn from 'expo-google-sign-in'

// import Firebase from "./firebase";
import * as Firebase from "firebase";
// import firebase from 'firebase/app'
// import 'firebase/auth';
// import 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdk5AMV0V5PGiniIKlygxTc-GSXqEtL4A",
  authDomain: "fanpage-app-af01d.firebaseapp.com",
  projectId: "fanpage-app-af01d",
  storageBucket: "fanpage-app-af01d.appspot.com",
  messagingSenderId: "26984943290",
  appId: "1:26984943290:web:5b2ce7192214e45e24bc83",
};
Firebase.initializeApp(firebaseConfig);
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
        <AuthStack.Screen
          name="PhoneSignInScreen"
          component={PhoneSignInScreen}
        />
        <AuthStack.Screen name="EmailAndPassword" component={EmailAndPassword}/>
        <AuthStack.Screen name="LoggedIn" component={LoggedInScreen} />
      </AuthStack.Navigator>
    );
  };

  // State management using React hooks/ Context
  const authContext = React.useMemo(() => {
    return {
      signinWithEmailAndPass: () => {
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
          .catch((error) => {
            Alert.alert(
              "Wrong credentials",
              "", // <- this part is optional, you can pass an empty string
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: false }
            );
            console.log("unable to login through fireabser", error);
          });
      },

      signInWithEmailOnly: () => {},
    };
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {/* <RootStackScreen user={user} /> */}
        <AuthStackScreen user={user} />
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
          navigation.navigate("EmailAndPassword", { name: "React Native School" })
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

export const LoggedInScreen = ({ navigation }) => {
  return (
    <ScreenContainer>
      <Text>Logged In</Text>
      <Button
        title="Anonymous"
        onPress={() => {
          Firebase.auth()
            .signOut()
            .then(() => console.log("User signed out!"))
            .catch((error) => console.log(error));
          navigation.push("Home", { name: "React Native School" });
        }}
      />
    </ScreenContainer>
  );
};

export const PhoneSignInScreen = ({ navigation }) => {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [message, showMessage] = React.useState(
    !firebaseConfig || Platform.OS === "web"
      ? {
          text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.",
        }
      : undefined
  );
  const attemptInvisibleVerification = false;

  return (
    <ScreenContainer>
      <View style={{ padding: 20, marginTop: 50 }}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={attemptInvisibleVerification}
        />
        <Text style={{ marginTop: 20 }}>Enter phone number</Text>
        <TextInput
          style={{ marginVertical: 10, fontSize: 17 }}
          placeholder="+1 999 999 9999"
          autoFocus
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
        />
        <Button
          title="Send Verification Code"
          disabled={!phoneNumber}
          onPress={async () => {
            // The FirebaseRecaptchaVerifierModal ref implements the
            // FirebaseAuthApplicationVerifier interface and can be
            // passed directly to `verifyPhoneNumber`.
            try {
              const phoneProvider = new Firebase.auth.PhoneAuthProvider();
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
              );
              setVerificationId(verificationId);
              showMessage({
                text: "Verification code has been sent to your phone.",
              });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: "red" });
            }
          }}
        />
        <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
        <TextInput
          style={{ marginVertical: 10, fontSize: 17 }}
          editable={!!verificationId}
          placeholder="123456"
          onChangeText={setVerificationCode}
        />
        <Button
          title="Confirm Verification Code"
          disabled={!verificationId}
          onPress={async () => {
            try {
              const credential = Firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              await Firebase.auth().signInWithCredential(credential);
              showMessage({ text: "Phone authentication successful 👍" });
              navigation.push("LoggedIn", { name: "Logged" });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: "red" });
            }
          }}
        />
        {message ? (
          <TouchableOpacity
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 0xffffffee, justifyContent: "center" },
            ]}
            onPress={() => showMessage(undefined)}
          >
            <Text
              style={{
                color: message.color || "blue",
                fontSize: 17,
                textAlign: "center",
                margin: 20,
              }}
            >
              {message.text}
            </Text>
          </TouchableOpacity>
        ) : undefined}
        {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      </View>
    </ScreenContainer>
  );
};
export const EmailAndPassword = ({ navigation }) => {
  const [emailAddress, setemailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [SignUpErrors, setSignUpErrors] = React.useState({});
  const [user, setUser] = React.useState(null);

  return (
    <ScreenContainer>
      <View>
        <Card>
          <Input
            label={"Email"}
            placeholder="Email"
            value={emailAddress}
            onChangeText={setemailAddress}
            errorStyle={{ color: "red" }}
            errorMessage={SignUpErrors ? SignUpErrors.email : null}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            errorStyle={{ color: "red" }}
            errorMessage={SignUpErrors ? SignUpErrors.password : null}
          />
          <Button
            buttonStyle={{ margin: 10, marginTop: 50 }}
            title="Sign in"
            onPress={() => {
              Firebase.auth()
                .signInWithEmailAndPassword(emailAddress, password)
                .then((res) => {
                  console.log("User logged-in  to firebase successfully!");
                  setUser(user);
                  Firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                      // User is signed in.
                    setUser(user);

                      navigation.navigate("LoggedIn")
                      console.log(user.uid);
                    } else {
                      // No user is signed in.
                  console.log("User Does not exist");
                  setUser(null);

                    }
                  });
                })
                .catch((error) => {
                  Alert.alert(
                    "Wrong credentials",
                    "", // <- this part is optional, you can pass an empty string
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                  );
                  console.log("unable to login through fireabser", error);
                });
            }}
          />
          <Text
            style={{ marginLeft: 100 }}
            onPress={() => {
              navigation.navigate("Signup");
            }}
          >
            No Acount? Sign Up
          </Text>
        </Card>
      </View>
    </ScreenContainer>
  );
};

export const FaceBookSignin=({navigation})=>{
  try {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('684399708713036', {
      permissions: ['public_profile'],
    });
    if (type === 'success') {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      const facebookProfileData = await firebase.auth().signInWithCredential(credential);
      this.onLoginSuccess.bind(this)
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }

  return(
    <ScreenContainer>

    </ScreenContainer>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
