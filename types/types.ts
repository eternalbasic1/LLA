export type RootStackParamList = {
  HomeScreen: undefined; // No parameters expected for HomeScreen
  NewPostScreen: { postId: string }; // NewPostScreen expects a `postId` parameter
  LoginScreen: undefined; // No parameters expected for LoginScreen
  SignupScreen: undefined; // No parameters expected for SignupScreen
};
