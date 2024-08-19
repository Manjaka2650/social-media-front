import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "./components/Header";
import HomeScreen from "./components/error/HomeScreen";
import Detail from "./components/error/Detail";
import PostScreen from "./components/error/PostScreen";
import NewPost from "./components/NewPost";
import MessageScreen from "./components/error/MessageScreen";
import NewAccount from "./components/NewAccount";

// export default function Index() {
//   return (
//     <NavigationContainer>
//       <stack.Navigator
//         screenOptions={({ navigation }) => ({
//           header: () => <Header navigation={navigation} />,
//         })}
//       >
//         <stack.Screen name="Home" component={HomeScreen} />
//         <stack.Screen name="Detail" component={Detail} />
//         <stack.Screen name="Posts" component={PostScreen} />
//         <stack.Screen name="NewPost" component={NewPost} />
//         <stack.Screen name="Messages" component={MessageScreen} />
//         <stack.Screen name="NewAccount" component={NewAccount} />
//       </stack.Navigator>
//     </NavigationContainer>
//   );
// }
