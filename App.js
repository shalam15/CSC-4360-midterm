import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "./context";
import { Input, Button, Card, ListItem, Avatar } from "react-native-elements";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import * as Facebook from "expo-facebook";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";

import * as GoogleAuthentication from "expo-google-app-auth";
// import * as GoogleSignIn from "expo-google-sign-in";
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppAuth from "expo-app-auth";

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
if (!Firebase.apps.length) {
  Firebase.initializeApp(firebaseConfig);
} else {
  Firebase.app(); // if already initialized, use that one
}

const doSome = (uid, firstName, lastName, userEmail) => {
  Firebase.firestore()
    .collection("allusers")
    .add({
      uid: uid,
      email: userEmail,
      firstName: firstName,
      lastName: lastName,
      datetime: new Date(),
      userRole: "customer",
    })
    .then((res) => {
      console.log("User Creted in firestore");
    })
    .catch((error) => {
      Alert.alert("Error creating user", [
        {
          text: "OK",
          onPress: () => console.log(error),
          style: "cancel",
        },
      ]);
    });
};

export default function App() {
  const [user, setUser] = React.useState(null);
  const AuthStack = createStackNavigator();
  Firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      setUser(user);
      console.log(user.uid);
    } else {
      // No user is signed in.
      console.log("User Does not exist");
      setUser(null);
    }
  });
  // doSome(user.uid, "Anonymouse clout", "Weeber",  "NO-EMAIL")

  const AuthStackScreen = (user) => {
    return (
      <AuthStack.Navigator initialRouteName="Home">
        <AuthStack.Screen name="Home" component={Home} />
        <AuthStack.Screen name="Home2" component={Home} />
        <AuthStack.Screen
          name="PhoneSignInScreen"
          component={PhoneSignInScreen}
        />
        <AuthStack.Screen
          name="EmailAndPassword"
          component={EmailAndPassword}
        />
        <AuthStack.Screen name="EmailOnly" component={EmailOnly} EmailOnly />
        <AuthStack.Screen name="LoggedIn" component={LoggedInScreen} />
        <AuthStack.Screen name="Profile" component={ProfileScreen} />
      </AuthStack.Navigator>
    );
  };

  // State management using React hooks/ Context
  const authContext = React.useMemo(() => {
    return {
      signInWithEmailOnly: () => {},
    };
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <AuthStackScreen user={user} />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export const ScreenContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const Home = ({ navigation }) => {
  const { URLSchemes } = AppAuth;
  const signInWithGoogle = () =>
    GoogleAuthentication.logInAsync({
      androidStandaloneAppClientId:
        "26984943290-0he0akttpofpe143p0212e2d5h674f35.apps.googleusercontent.com",
      iosStandaloneAppClientId:
        "26984943290-u89j882k6lrs7afnem90ulf6dgmh2vp9.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    })
      .then((logInResult) => {
        if (logInResult.type === "success") {
          navigation.push("Home2", { name: "React Native School" });
          console.log("succeeded");
          const { idToken, accessToken } = logInResult;
          const credential = Firebase.auth.GoogleAuthProvider.credential(
            idToken,
            accessToken
          );

          return Firebase.auth().signInWithCredential(credential);
          // Successful sign in is handled by firebase.auth().onAuthStateChanged
        }
        return Promise.reject(); // Or handle user cancelation separatedly
      })
      .catch((error) => {
        console.log(error);
        // ...
      });
  return (
    <ScreenContainer>
      <Text>Authentication List</Text>
      <Button
        title="Email and Password"
        onPress={() =>
          navigation.navigate("EmailAndPassword", {
            name: "EmailNAdpassword",
          })
        }
      />
      <Button
        title="Email without password"
        onPress={() => navigation.push("EmailOnly", { name: "EmailOnly" })}
      />
      <Button
        title="Phone Number"
        onPress={() =>
          navigation.navigate("PhoneSignInScreen", { name: "Phone Signin" })
        }
      />
      <Button
        title="Facebook"
        onPress={async () => {
          try {
            const { type, token } =
              await Facebook.logInWithReadPermissionsAsync("238653818236056", {
                permissions: ["public_profile"],
              });
            if (type === "success") {
              await Firebase.auth().setPersistence(
                Firebase.auth.Auth.Persistence.LOCAL
              );
              const credential =
                Firebase.auth.FacebookAuthProvider.credential(token);
              const facebookProfileData =
                await Firebase.auth().signInWithCredential(credential);
              navigation.push("LoggedIn", { name: "Logged" });
            }
          } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
            console.log(message);
          }
        }}
      />
      <Button
        title="Google"
        onPress={() => {
          signInWithGoogle().then(() => console.log("Signed in with Google!"));
        }}
      />
      <Button
        title="Anonymous"
        onPress={() => {
          Firebase.auth()
            .signInAnonymously()
            .then(() => {
              console.log("User signed in anonymously");
            })
            .catch((error) => {
              if (error.code === "auth/operation-not-allowed") {
                console.log("Enable anonymous in your firebase console.");
              }

              console.error(error);
            });
          navigation.push("LoggedIn", { name: "Logged in" });
        }}
      />
    </ScreenContainer>
  );
};
export const CustomListItem = ({ id, firstName, email, navigation , enterProfile, datetime}) => {
  return (
    <ListItem
      onPress={() => {console.log(firstName, email) , enterProfile(id, firstName, email)}}
      key={id}
      bottomDivider
    >
      <Avatar
        rounded
        source={{
          uri: "https://picsum.photos/200",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {firstName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {email}
        </ListItem.Subtitle>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
         Date Joined:  {JSON.stringify(datetime)}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export const LoggedInScreen = ({ navigation }) => {
  const [users, setUsers] = React.useState([]);
  useEffect(() => {
    const unsubscribe = Firebase.firestore()
      .collection("allusers")
      .onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);
  navigation.setOptions({
    title: "Home",
    headerStyle: { backgroundColor: "#fff" },
    headerTitleStyle: { color: "black" },
    headerTintColor: "black",

    headerRight: () => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 80,
          marginRight: 20,
        }}
      >
      
        <TouchableOpacity
          onPress={() => {
            Firebase.auth()
              .signOut()
              .then(() => console.log("User signed out!"))
              .catch((error) => console.log(error));
            navigation.push("Home", { name: "React Native School" });
          }}
        >
           <Text>Sign out</Text>
        </TouchableOpacity>
      </View>
    ),
  });

  const enterProfile =(uid, firstName, email, datetime) => {
navigation.navigate("Profile", {
  uid, id, firstName, email, datetime
});
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <Text>Logged In</Text>
      <ScrollView style={styles.container2}>
        {users.map(({ id, data: {uid, firstName, email , datetime} }) => (
          <CustomListItem
            key={id}
            id={id}
            uid={uid}
            firstName={firstName}
            email={email}
            datetime={datetime}
            enterProfile={enterProfile}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
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
  const [emailAddress, setemailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [SignUpErrors, setSignUpErrors] = React.useState({});
  const [user, setUser] = React.useState(null);

  return (
    <ScreenContainer>
      <View style={styles.EMP}>
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
                  navigation.navigate("LoggedIn");
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
        </Card>
      </View>
    </ScreenContainer>
  );
};
export const EmailOnly = ({ navigation }) => {
  const [emailAddress, setemailAddress] = React.useState("");
  const [SignUpErrors, setSignUpErrors] = React.useState({});

  return (
    <ScreenContainer>
      <View style={styles.EMP}>
        <Card>
          <Input
            label={"Email"}
            placeholder="Email"
            value={emailAddress}
            onChangeText={setemailAddress}
            errorStyle={{ color: "red" }}
            errorMessage={SignUpErrors ? SignUpErrors.email : null}
          />

          <Button
            buttonStyle={{ margin: 10, marginTop: 50 }}
            title="Sign in"
            onPress={() => {
              navigation.navigate("LoggedIn");
              // Firebase.auth()
              //   .signInWithEmailAndPassword(emailAddress, password)
              //   .then((res) => {
              //     console.log("User logged-in  to firebase successfully!");
              //     navigation.navigate("LoggedIn");
              //   })
              //   .catch((error) => {
              //     Alert.alert(
              //       "Wrong credentials",
              //       "", // <- this part is optional, you can pass an empty string
              //       [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              //       { cancelable: false }
              //     );
              //     console.log("unable to login through fireabser", error);
              //   });
            }}
          />
        </Card>
      </View>
    </ScreenContainer>
  );
};

export const ProfileScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View>
      <Avatar
        rounded
        source={{
          uri: "https://picsum.photos/200",
        }}
      />
        <Text>{route.params.uid}</Text>
        <Text>{route.params.firstName}</Text>
        <Text>{route.params.email}</Text>
        <Text>{route.params.datetime}</Text>

        <Button
        title="Go Back"
        onPress={() =>
          navigation.goBack()
        }
      />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  EMP:{
width:"100%"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  container2: {
    height: "100%",
  },
});
