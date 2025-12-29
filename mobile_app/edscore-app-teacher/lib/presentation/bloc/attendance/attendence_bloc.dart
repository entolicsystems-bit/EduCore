// // ==================== LOGIN - EVENTS ====================
// // login_event.dart
// abstract class LoginEvent {}
//
// class LoginSubmitted extends LoginEvent {
//   final String email;
//   final String password;
//
//   LoginSubmitted({required this.email, required this.password});
// }
//
// class LoginEmailChanged extends LoginEvent {
//   final String email;
//   LoginEmailChanged(this.email);
// }
//
// class LoginPasswordChanged extends LoginEvent {
//   final String password;
//   LoginPasswordChanged(this.password);
// }
//
// // ==================== LOGIN - STATES ====================
// // login_state.dart
// abstract class LoginState {}
//
// class LoginInitial extends LoginState {}
//
// class LoginLoading extends LoginState {}
//
// class LoginSuccess extends LoginState {
//   final String message;
//   LoginSuccess({this.message = 'Login successful!'});
// }
//
// class LoginFailure extends LoginState {
//   final String error;
//   LoginFailure(this.error);
// }
//
// class LoginValidating extends LoginState {
//   final String? emailError;
//   final String? passwordError;
//
//   LoginValidating({this.emailError, this.passwordError});
// }
//
// // ==================== LOGIN - BLOC ====================
// // login_bloc.dart
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class LoginBloc extends Bloc<LoginEvent, LoginState> {
//   LoginBloc() : super(LoginInitial()) {
//     on<LoginSubmitted>(_onLoginSubmitted);
//     on<LoginEmailChanged>(_onEmailChanged);
//     on<LoginPasswordChanged>(_onPasswordChanged);
//   }
//
//   String? _validateEmail(String email) {
//     if (email.isEmpty) return 'Email is required';
//     final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
//     if (!emailRegex.hasMatch(email)) return 'Invalid email format';
//     return null;
//   }
//
//   String? _validatePassword(String password) {
//     if (password.isEmpty) return 'Password is required';
//     if (password.length < 6) return 'Password must be at least 6 characters';
//     return null;
//   }
//
//   // Admin email list - only these emails can login
//   final List<String> _adminEmails = [
//     'admin@educore.com',
//     'superadmin@educore.com',
//     // Add more admin emails here
//   ];
//
//   bool _isAdmin(String email) {
//     return _adminEmails.contains(email.toLowerCase().trim());
//   }
//
//   Future<void> _onLoginSubmitted(
//       LoginSubmitted event,
//       Emitter<LoginState> emit,
//       ) async {
//     final emailError = _validateEmail(event.email);
//     final passwordError = _validatePassword(event.password);
//
//     if (emailError != null || passwordError != null) {
//       emit(LoginValidating(
//         emailError: emailError,
//         passwordError: passwordError,
//       ));
//       return;
//     }
//
//     // Check if user is admin
//     if (!_isAdmin(event.email)) {
//       emit(LoginFailure('Access denied. Only admin users can login.'));
//       return;
//     }
//
//     emit(LoginLoading());
//
//     try {
//       await Future.delayed(const Duration(seconds: 2));
//       // TODO: Replace with your API call
//       // Verify admin credentials with backend
//       // final response = await authRepository.login(event.email, event.password);
//
//       emit(LoginSuccess());
//     } catch (e) {
//       emit(LoginFailure(e.toString()));
//     }
//   }
//
//   void _onEmailChanged(LoginEmailChanged event, Emitter<LoginState> emit) {
//     final error = _validateEmail(event.email);
//     if (error != null) {
//       emit(LoginValidating(emailError: error));
//     } else {
//       emit(LoginInitial());
//     }
//   }
//
//   void _onPasswordChanged(LoginPasswordChanged event, Emitter<LoginState> emit) {
//     final error = _validatePassword(event.password);
//     if (error != null) {
//       emit(LoginValidating(passwordError: error));
//     } else {
//       emit(LoginInitial());
//     }
//   }
// }
//
// // ==================== FORGOT PASSWORD - EVENTS ====================
// // forgot_password_event.dart
// abstract class ForgotPasswordEvent {}
//
// class ForgotPasswordSubmitted extends ForgotPasswordEvent {
//   final String email;
//   ForgotPasswordSubmitted(this.email);
// }
//
// class ForgotPasswordEmailChanged extends ForgotPasswordEvent {
//   final String email;
//   ForgotPasswordEmailChanged(this.email);
// }
//
// // ==================== FORGOT PASSWORD - STATES ====================
// // forgot_password_state.dart
// abstract class ForgotPasswordState {}
//
// class ForgotPasswordInitial extends ForgotPasswordState {}
//
// class ForgotPasswordLoading extends ForgotPasswordState {}
//
// class ForgotPasswordSuccess extends ForgotPasswordState {
//   final String email;
//   ForgotPasswordSuccess(this.email);
// }
//
// class ForgotPasswordFailure extends ForgotPasswordState {
//   final String error;
//   ForgotPasswordFailure(this.error);
// }
//
// class ForgotPasswordValidating extends ForgotPasswordState {
//   final String? emailError;
//   ForgotPasswordValidating({this.emailError});
// }
//
// // ==================== FORGOT PASSWORD - BLOC ====================
// // forgot_password_bloc.dart
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class ForgotPasswordBloc extends Bloc<ForgotPasswordEvent, ForgotPasswordState> {
//   ForgotPasswordBloc() : super(ForgotPasswordInitial()) {
//     on<ForgotPasswordSubmitted>(_onForgotPasswordSubmitted);
//     on<ForgotPasswordEmailChanged>(_onEmailChanged);
//   }
//
//   String? _validateEmail(String email) {
//     if (email.isEmpty) return 'Email is required';
//     final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
//     if (!emailRegex.hasMatch(email)) return 'Invalid email format';
//     return null;
//   }
//
//   Future<void> _onForgotPasswordSubmitted(
//       ForgotPasswordSubmitted event,
//       Emitter<ForgotPasswordState> emit,
//       ) async {
//     final emailError = _validateEmail(event.email);
//
//     if (emailError != null) {
//       emit(ForgotPasswordValidating(emailError: emailError));
//       return;
//     }
//
//     emit(ForgotPasswordLoading());
//
//     try {
//       await Future.delayed(const Duration(seconds: 2));
//       // TODO: Replace with your API call
//       emit(ForgotPasswordSuccess(event.email));
//     } catch (e) {
//       emit(ForgotPasswordFailure(e.toString()));
//     }
//   }
//
//   void _onEmailChanged(ForgotPasswordEmailChanged event, Emitter<ForgotPasswordState> emit) {
//     final error = _validateEmail(event.email);
//     if (error != null) {
//       emit(ForgotPasswordValidating(emailError: error));
//     } else {
//       emit(ForgotPasswordInitial());
//     }
//   }
// }
//
// // ==================== OTP - EVENTS ====================
// // otp_event.dart
// abstract class OtpEvent {}
//
// class OtpSubmitted extends OtpEvent {
//   final String otp;
//   final String email;
//
//   OtpSubmitted({required this.otp, required this.email});
// }
//
// class OtpResendRequested extends OtpEvent {
//   final String email;
//   OtpResendRequested(this.email);
// }
//
// // ==================== OTP - STATES ====================
// // otp_state.dart
// abstract class OtpState {}
//
// class OtpInitial extends OtpState {}
//
// class OtpLoading extends OtpState {}
//
// class OtpVerified extends OtpState {
//   final String email;
//   OtpVerified(this.email);
// }
//
// class OtpFailure extends OtpState {
//   final String error;
//   OtpFailure(this.error);
// }
//
// class OtpResent extends OtpState {}
//
// // ==================== OTP - BLOC ====================
// // otp_bloc.dart
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class OtpBloc extends Bloc<OtpEvent, OtpState> {
//   OtpBloc() : super(OtpInitial()) {
//     on<OtpSubmitted>(_onOtpSubmitted);
//     on<OtpResendRequested>(_onOtpResendRequested);
//   }
//
//   Future<void> _onOtpSubmitted(
//       OtpSubmitted event,
//       Emitter<OtpState> emit,
//       ) async {
//     if (event.otp.length != 4) {
//       emit(OtpFailure('Please enter 4-digit OTP'));
//       return;
//     }
//
//     emit(OtpLoading());
//
//     try {
//       await Future.delayed(const Duration(seconds: 2));
//       // TODO: Replace with your API call
//       emit(OtpVerified(event.email));
//     } catch (e) {
//       emit(OtpFailure(e.toString()));
//     }
//   }
//
//   Future<void> _onOtpResendRequested(
//       OtpResendRequested event,
//       Emitter<OtpState> emit,
//       ) async {
//     try {
//       await Future.delayed(const Duration(seconds: 1));
//       // TODO: Replace with your API call
//       emit(OtpResent());
//       emit(OtpInitial());
//     } catch (e) {
//       emit(OtpFailure(e.toString()));
//     }
//   }
// }
//
// // ==================== RESET PASSWORD - EVENTS ====================
// // reset_password_event.dart
// abstract class ResetPasswordEvent {}
//
// class ResetPasswordSubmitted extends ResetPasswordEvent {
//   final String newPassword;
//   final String confirmPassword;
//   final String email;
//
//   ResetPasswordSubmitted({
//     required this.newPassword,
//     required this.confirmPassword,
//     required this.email,
//   });
// }
//
// // ==================== RESET PASSWORD - STATES ====================
// // reset_password_state.dart
// abstract class ResetPasswordState {}
//
// class ResetPasswordInitial extends ResetPasswordState {}
//
// class ResetPasswordLoading extends ResetPasswordState {}
//
// class ResetPasswordSuccess extends ResetPasswordState {}
//
// class ResetPasswordFailure extends ResetPasswordState {
//   final String error;
//   ResetPasswordFailure(this.error);
// }
//
// class ResetPasswordValidating extends ResetPasswordState {
//   final String? newPasswordError;
//   final String? confirmPasswordError;
//
//   ResetPasswordValidating({
//     this.newPasswordError,
//     this.confirmPasswordError,
//   });
// }
//
// // ==================== RESET PASSWORD - BLOC ====================
// // reset_password_bloc.dart
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class ResetPasswordBloc extends Bloc<ResetPasswordEvent, ResetPasswordState> {
//   ResetPasswordBloc() : super(ResetPasswordInitial()) {
//     on<ResetPasswordSubmitted>(_onResetPasswordSubmitted);
//   }
//
//   String? _validatePassword(String password) {
//     if (password.isEmpty) return 'Password is required';
//     if (password.length < 6) return 'Password must be at least 6 characters';
//     return null;
//   }
//
//   Future<void> _onResetPasswordSubmitted(
//       ResetPasswordSubmitted event,
//       Emitter<ResetPasswordState> emit,
//       ) async {
//     final newPasswordError = _validatePassword(event.newPassword);
//     String? confirmPasswordError;
//
//     if (event.confirmPassword.isEmpty) {
//       confirmPasswordError = 'Confirm password is required';
//     } else if (event.newPassword != event.confirmPassword) {
//       confirmPasswordError = 'Passwords do not match';
//     }
//
//     if (newPasswordError != null || confirmPasswordError != null) {
//       emit(ResetPasswordValidating(
//         newPasswordError: newPasswordError,
//         confirmPasswordError: confirmPasswordError,
//       ));
//       return;
//     }
//
//     emit(ResetPasswordLoading());
//
//     try {
//       await Future.delayed(const Duration(seconds: 2));
//       // TODO: Replace with your API call
//       emit(ResetPasswordSuccess());
//     } catch (e) {
//       emit(ResetPasswordFailure(e.toString()));
//     }
//   }
// }
//
// // ==================== LOGIN SCREEN ====================
// // login_screen.dart
// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class LoginScreen extends StatelessWidget {
//   const LoginScreen({Key? key}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return BlocProvider(
//       create: (context) => LoginBloc(),
//       child: const LoginView(),
//     );
//   }
// }
//
// class LoginView extends StatefulWidget {
//   const LoginView({Key? key}) : super(key: key);
//
//   @override
//   State<LoginView> createState() => _LoginViewState();
// }
//
// class _LoginViewState extends State<LoginView> {
//   final _emailController = TextEditingController();
//   final _passwordController = TextEditingController();
//   bool _obscurePassword = true;
//
//   @override
//   void dispose() {
//     _emailController.dispose();
//     _passwordController.dispose();
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         backgroundColor: Colors.transparent,
//         elevation: 0,
//         leading: IconButton(
//           icon: const Icon(Icons.arrow_back, color: Colors.black),
//           onPressed: () => Navigator.pop(context),
//         ),
//       ),
//       body: BlocConsumer<LoginBloc, LoginState>(
//         listener: (context, state) {
//           if (state is LoginSuccess) {
//             ScaffoldMessenger.of(context).showSnackBar(
//               const SnackBar(
//                 content: Text('Login successful!'),
//                 backgroundColor: Colors.green,
//               ),
//             );
//             // TODO: Navigate to home screen
//           } else if (state is LoginFailure) {
//             ScaffoldMessenger.of(context).showSnackBar(
//               SnackBar(
//                 content: Text(state.error),
//                 backgroundColor: Colors.red,
//               ),
//             );
//           }
//         },
//         builder: (context, state) {
//           String? emailError;
//           String? passwordError;
//
//           if (state is LoginValidating) {
//             emailError = state.emailError;
//             passwordError = state.passwordError;
//           }
//
//           return SingleChildScrollView(
//             padding: const EdgeInsets.all(24.0),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 const SizedBox(height: 20),
//                 const Text(
//                   'Log In',
//                   style: TextStyle(
//                     fontSize: 28,
//                     fontWeight: FontWeight.bold,
//                     color: Colors.black,
//                   ),
//                 ),
//                 const SizedBox(height: 40),
//
//                 // Email Field
//                 TextField(
//                   controller: _emailController,
//                   keyboardType: TextInputType.emailAddress,
//                   decoration: InputDecoration(
//                     hintText: 'Enter your email',
//                     errorText: emailError,
//                     filled: true,
//                     fillColor: Colors.grey[100],
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                       borderSide: BorderSide.none,
//                     ),
//                     contentPadding: const EdgeInsets.symmetric(
//                       horizontal: 16,
//                       vertical: 16,
//                     ),
//                   ),
//                   onChanged: (value) {
//                     context.read<LoginBloc>().add(LoginEmailChanged(value));
//                   },
//                 ),
//                 const SizedBox(height: 16),
//
//                 // Password Field
//                 TextField(
//                   controller: _passwordController,
//                   obscureText: _obscurePassword,
//                   decoration: InputDecoration(
//                     hintText: 'Enter Password',
//                     errorText: passwordError,
//                     filled: true,
//                     fillColor: Colors.grey[100],
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                       borderSide: BorderSide.none,
//                     ),
//                     contentPadding: const EdgeInsets.symmetric(
//                       horizontal: 16,
//                       vertical: 16,
//                     ),
//                     suffixIcon: IconButton(
//                       icon: Icon(
//                         _obscurePassword
//                             ? Icons.visibility_off
//                             : Icons.visibility,
//                         color: Colors.grey,
//                       ),
//                       onPressed: () {
//                         setState(() {
//                           _obscurePassword = !_obscurePassword;
//                         });
//                       },
//                     ),
//                   ),
//                   onChanged: (value) {
//                     context.read<LoginBloc>().add(LoginPasswordChanged(value));
//                   },
//                 ),
//                 const SizedBox(height: 8),
//
//                 // Forgot Password
//                 Align(
//                   alignment: Alignment.centerRight,
//                   child: TextButton(
//                     onPressed: () {
//                       Navigator.push(
//                         context,
//                         MaterialPageRoute(
//                           builder: (_) => const ForgotPasswordScreen(),
//                         ),
//                       );
//                     },
//                     child: const Text(
//                       'Forgot Password?',
//                       style: TextStyle(color: Colors.blue),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 24),
//
//                 // Login Button
//                 SizedBox(
//                   width: double.infinity,
//                   height: 50,
//                   child: ElevatedButton(
//                     onPressed: state is LoginLoading
//                         ? null
//                         : () {
//                       context.read<LoginBloc>().add(
//                         LoginSubmitted(
//                           email: _emailController.text,
//                           password: _passwordController.text,
//                         ),
//                       );
//                     },
//                     style: ElevatedButton.styleFrom(
//                       backgroundColor: Colors.blue,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(8),
//                       ),
//                     ),
//                     child: state is LoginLoading
//                         ? const SizedBox(
//                       height: 20,
//                       width: 20,
//                       child: CircularProgressIndicator(
//                         strokeWidth: 2,
//                         color: Colors.white,
//                       ),
//                     )
//                         : const Text(
//                       'Log In',
//                       style: TextStyle(
//                         fontSize: 16,
//                         fontWeight: FontWeight.bold,
//                         color: Colors.white,
//                       ),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 180),
//
//                 // Version
//                 const Center(
//                   child: Text(
//                     'version : v1.0',
//                     style: TextStyle(
//                       color: Colors.grey,
//                       fontSize: 12,
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 8),
//
//                 // Get Help
//                 Center(
//                   child: TextButton(
//                     onPressed: () {
//                       // TODO: Navigate to help screen
//                     },
//                     child: const Text(
//                       'Get help',
//                       style: TextStyle(
//                         color: Colors.blue,
//                         fontSize: 14,
//                       ),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           );
//         },
//       ),
//     );
//   }
// }
//
// // ==================== FORGOT PASSWORD SCREEN ====================
// // forgot_password_screen.dart
// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class ForgotPasswordScreen extends StatelessWidget {
//   const ForgotPasswordScreen({Key? key}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return BlocProvider(
//       create: (context) => ForgotPasswordBloc(),
//       child: const ForgotPasswordView(),
//     );
//   }
// }
//
// class ForgotPasswordView extends StatefulWidget {
//   const ForgotPasswordView({Key? key}) : super(key: key);
//
//   @override
//   State<ForgotPasswordView> createState() => _ForgotPasswordViewState();
// }
//
// class _ForgotPasswordViewState extends State<ForgotPasswordView> {
//   final _emailController = TextEditingController();
//
//   @override
//   void dispose() {
//     _emailController.dispose();
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         backgroundColor: Colors.transparent,
//         elevation: 0,
//         leading: IconButton(
//           icon: const Icon(Icons.arrow_back, color: Colors.black),
//           onPressed: () => Navigator.pop(context),
//         ),
//       ),
//       body: BlocConsumer<ForgotPasswordBloc, ForgotPasswordState>(
//         listener: (context, state) {
//           if (state is ForgotPasswordSuccess) {
//             Navigator.push(
//               context,
//               MaterialPageRoute(
//                 builder: (_) => OtpScreen(email: state.email),
//               ),
//             );
//           } else if (state is ForgotPasswordFailure) {
//             ScaffoldMessenger.of(context).showSnackBar(
//               SnackBar(
//                 content: Text(state.error),
//                 backgroundColor: Colors.red,
//               ),
//             );
//           }
//         },
//         builder: (context, state) {
//           String? emailError;
//
//           if (state is ForgotPasswordValidating) {
//             emailError = state.emailError;
//           }
//
//           return SingleChildScrollView(
//             padding: const EdgeInsets.all(24.0),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 const SizedBox(height: 20),
//                 const Text(
//                   'Forgot Password',
//                   style: TextStyle(
//                     fontSize: 28,
//                     fontWeight: FontWeight.bold,
//                     color: Colors.black,
//                   ),
//                 ),
//                 const SizedBox(height: 40),
//
//                 // Email Field
//                 TextField(
//                   controller: _emailController,
//                   keyboardType: TextInputType.emailAddress,
//                   decoration: InputDecoration(
//                     hintText: 'Enter your email',
//                     errorText: emailError,
//                     filled: true,
//                     fillColor: Colors.grey[100],
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                       borderSide: BorderSide.none,
//                     ),
//                     contentPadding: const EdgeInsets.symmetric(
//                       horizontal: 16,
//                       vertical: 16,
//                     ),
//                   ),
//                   onChanged: (value) {
//                     context.read<ForgotPasswordBloc>().add(
//                       ForgotPasswordEmailChanged(value),
//                     );
//                   },
//                 ),
//                 const SizedBox(height: 24),
//
//                 // Send OTP Button
//                 SizedBox(
//                   width: double.infinity,
//                   height: 50,
//                   child: ElevatedButton(
//                     onPressed: state is ForgotPasswordLoading
//                         ? null
//                         : () {
//                       context.read<ForgotPasswordBloc>().add(
//                         ForgotPasswordSubmitted(
//                           _emailController.text,
//                         ),
//                       );
//                     },
//                     style: ElevatedButton.styleFrom(
//                       backgroundColor: Colors.blue,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(8),
//                       ),
//                     ),
//                     child: state is ForgotPasswordLoading
//                         ? const SizedBox(
//                       height: 20,
//                       width: 20,
//                       child: CircularProgressIndicator(
//                         strokeWidth: 2,
//                         color: Colors.white,
//                       ),
//                     )
//                         : const Text(
//                       'Send OTP',
//                       style: TextStyle(
//                         fontSize: 16,
//                         fontWeight: FontWeight.bold,
//                         color: Colors.white,
//                       ),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           );
//         },
//       ),
//     );
//   }
// }
//
// // ==================== OTP SCREEN ====================
// // otp_screen.dart
// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class OtpScreen extends StatelessWidget {
//   final String email;
//
//   const OtpScreen({Key? key, required this.email}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return BlocProvider(
//       create: (context) => OtpBloc(),
//       child: OtpView(email: email),
//     );
//   }
// }
//
// class OtpView extends StatefulWidget {
//   final String email;
//
//   const OtpView({Key? key, required this.email}) : super(key: key);
//
//   @override
//   State<OtpView> createState() => _OtpViewState();
// }
//
// class _OtpViewState extends State<OtpView> {
//   final List<TextEditingController> _controllers = List.generate(
//     4,
//         (index) => TextEditingController(),
//   );
//   final List<FocusNode> _focusNodes = List.generate(
//     4,
//         (index) => FocusNode(),
//   );
//
//   @override
//   void dispose() {
//     for (var controller in _controllers) {
//       controller.dispose();
//     }
//     for (var node in _focusNodes) {
//       node.dispose();
//     }
//     super.dispose();
//   }
//
//   String _getOtp() {
//     return _controllers.map((c) => c.text).join();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         backgroundColor: Colors.transparent,
//         elevation: 0,
//         leading: IconButton(
//           icon: const Icon(Icons.arrow_back, color: Colors.black),
//           onPressed: () => Navigator.pop(context),
//         ),
//       ),
//       body: BlocConsumer<OtpBloc, OtpState>(
//         listener: (context, state) {
//           if (state is OtpVerified) {
//             Navigator.push(
//               context,
//               MaterialPageRoute(
//                 builder: (_) => ResetPasswordScreen(email: widget.email),
//               ),
//             );
//           } else if (state is OtpFailure) {
//             ScaffoldMessenger.of(context).showSnackBar(
//               SnackBar(
//                 content: Text(state.error),
//                 backgroundColor: Colors.red,
//               ),
//             );
//           } else if (state is OtpResent) {
//             ScaffoldMessenger.of(context).showSnackBar(
//               const SnackBar(
//                 content: Text('OTP resent successfully!'),
//                 backgroundColor: Colors.green,
//               ),
//             );
//           }
//         },
//         builder: (context, state) {
//           return SingleChildScrollView(
//             padding: const EdgeInsets.all(24.0),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 const SizedBox(height: 20),
//                 const Text(
//                   'Enter Otp',
//                   style: TextStyle(
//                     fontSize: 28,
//                     fontWeight: FontWeight.bold,
//                     color: Colors.black,
//                   ),
//                 ),
//                 const SizedBox(height: 40),
//
//                 // OTP Input Boxes
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                   children: List.generate(4, (index) {
//                     return SizedBox(
//                       width: 60,
//                       height: 60,
//                       child: TextField(
//                         controller: _controllers[index],
//                         focusNode: _focusNodes[index],
//                         textAlign: TextAlign.center,
//                         keyboardType: TextInputType.number,
//                         maxLength: 1,
//                         style: const TextStyle(
//                           fontSize: 24,
//                           fontWeight: FontWeight.bold,
//                         ),
//                         decoration: InputDecoration(
//                           counterText: '',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(8),
//                             borderSide: BorderSide.none,
//                           ),
//                           contentPadding: const EdgeInsets.all(16),
//                         ),
//                         onChanged: (value) {
//                           if (value.isNotEmpty && index < 3) {
//                             _focusNodes[index + 1].requestFocus();
//                           } else if (value.isEmpty && index > 0) {
//                             _focusNodes[index - 1].requestFocus();
//                           }
//                         },
//                       ),
//                     );
//                   }),
//                 ),
//                 const SizedBox(height: 24),
//
//                 // Verify Button
//                 SizedBox(
//                   width: double.infinity,
//                   height: 50,
//                   child: ElevatedButton(
//                     onPressed: state is OtpLoading
//                         ? null
//                         : () {
//                       context.read<OtpBloc>().add(
//                         OtpSubmitted(
//                           otp: _getOtp(),
//                           email: widget.email,
//                         ),
//                       );
//                     },
//                     style: ElevatedButton.styleFrom(
//                       backgroundColor: Colors.blue,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(8),
//                       ),
//                     ),
//                     child: state is OtpLoading
//                         ? const SizedBox(
//                       height: 20,
//                       width: 20,
//                       child: CircularProgressIndicator(
//                         strokeWidth: 2,
//                         color: Colors.white,
//                       ),
//                     )
//                         : const Text(
//                       'Verify',
//                       style: TextStyle(
//                         fontSize: 16,
//                         fontWeight: FontWeight.bold,
//                         color: Colors.white,
//                       ),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 16),
//
//                 // Resend OTP
//                 Center(
//                   child: TextButton(
//                     onPressed: () {
//                       context.read<OtpBloc>().add(
//                         OtpResendRequested(widget.email),
//                       );
//                     },
//                     child: RichText(
//                       text: const TextSpan(
//                         text: 'Resend OTP in ',
//                         style: TextStyle(color: Colors.grey),
//                         children: [
//                           TextSpan(
//                             text: '00:30',
//                             style: TextStyle(color: Colors.blue),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           );
//         },
//       ),
//     );
//   }
// }
//
// // ==================== RESET PASSWORD SCREEN ====================
// // reset_password_screen.dart
// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
//
// class ResetPasswordScreen extends StatelessWidget {
//   final String email;
//
//   const ResetPasswordScreen({Key? key, required this.email}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return BlocProvider(
//       create: (context) => ResetPasswordBloc(),
//       child: ResetPasswordView(email: email),
//     );
//   }
// }
//
// class ResetPasswordView extends StatefulWidget {
//   final String email;
//
//   const ResetPasswordView({Key? key, required this.email}) : super(key: key);
//
//   @override
//   State<ResetPasswordView> createState() => _ResetPasswordViewState();
// }
//
// class _ResetPasswordViewState extends State<ResetPasswordView> {
//   final _newPasswordController = TextEditingController();
//   final _confirmPasswordController = TextEditingController();
//   bool _obscureNewPassword = true;
//   bool _obscureConfirmPassword = true;
//
//   @override
//   void dispose() {
//     _newPasswordController.dispose();
//     _confirmPasswordController.dispose();
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         backgroundColor: Colors.transparent,
//         elevation: 0,
//         leading: IconButton(
//           icon: const Icon(Icons.arrow_back, color: Colors.black),
//           onPressed: () => Navigator.pop(context),
//         ),
//       ),
//       body: BlocConsumer<ResetPasswordBloc, ResetPasswordState>(
//         listener: (context, state) {
//           if (state is ResetPasswordSuccess) {
//             ScaffoldMessenger.of(context).showSnackBar(
//               const SnackBar(
//                 content: Text('Password reset successful!'),
//                 backgroundColor: Colors.green,
//               ),
//             );
//             // Navigate back to login screen
//             Navigator.of(context).popUntil((route) => route.isFirst);
//           } else if (state is ResetPasswordFailure) {
//             ScaffoldMessenger.of(context).showSnackBar(
//               SnackBar(
//                 content: Text(state.error),
//                 backgroundColor: Colors.red,
//               ),
//             );
//           }
//         },
//         builder: (context, state) {
//           String? newPasswordError;
//           String? confirmPasswordError;
//
//           if (state is ResetPasswordValidating) {
//             newPasswordError = state.newPasswordError;
//             confirmPasswordError = state.confirmPasswordError;
//           }
//
//           return SingleChildScrollView(
//             padding: const EdgeInsets.all(24.0),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 const SizedBox(height: 20),
//                 const Text(
//                   'Reset Password',
//                   style: TextStyle(
//                     fontSize: 28,
//                     fontWeight: FontWeight.bold,
//                     color: Colors.black,
//                   ),
//                 ),
//                 const SizedBox(height: 40),
//
//                 // New Password Field
//                 TextField(
//                   controller: _newPasswordController,
//                   obscureText: _obscureNewPassword,
//                   decoration: InputDecoration(
//                     hintText: 'Enter New Password',
//                     errorText: newPasswordError,
//                     filled: true,
//                     fillColor: Colors.grey[100],
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                       borderSide: BorderSide.none,
//                     ),
//                     contentPadding: const EdgeInsets.symmetric(
//                       horizontal: 16,
//                       vertical: 16,
//                     ),
//                     suffixIcon: IconButton(
//                       icon: Icon(
//                         _obscureNewPassword
//                             ? Icons.visibility_off
//                             : Icons.visibility,
//                         color: Colors.grey,
//                       ),
//                       onPressed: () {
//                         setState(() {
//                           _obscureNewPassword = !_obscureNewPassword;
//                         });
//                       },
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 16),
//
//                 // Confirm Password Field
//                 TextField(
//                   controller: _confirmPasswordController,
//                   obscureText: _obscureConfirmPassword,
//                   decoration: InputDecoration(
//                     hintText: 'Confirm Password',
//                     errorText: confirmPasswordError,
//                     filled: true,
//                     fillColor: Colors.grey[100],
//                     border: OutlineInputBorder(
//                       borderRadius: BorderRadius.circular(8),
//                       borderSide: BorderSide.none,
//                     ),
//                     contentPadding: const EdgeInsets.symmetric(
//                       horizontal: 16,
//                       vertical: 16,
//                     ),
//                     suffixIcon: IconButton(
//                       icon: Icon(
//                         _obscureConfirmPassword
//                             ? Icons.visibility_off
//                             : Icons.visibility,
//                         color: Colors.grey,
//                       ),
//                       onPressed: () {
//                         setState(() {
//                           _obscureConfirmPassword = !_obscureConfirmPassword;
//                         });
//                       },
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 24),
//
//                 // Reset Button
//                 SizedBox(
//                   width: double.infinity,
//                   height: 50,
//                   child: ElevatedButton(
//                     onPressed: state is ResetPasswordLoading
//                         ? null
//                         : () {
//                       context.read<ResetPasswordBloc>().add(
//                         ResetPasswordSubmitted(
//                           newPassword: _newPasswordController.text,
//                           confirmPassword: _confirmPasswordController.text,
//                           email: widget.email,
//                         ),
//                       );
//                     },
//                     style: ElevatedButton.styleFrom(
//                       backgroundColor: Colors.blue,
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(8),
//                       ),
//                     ),
//                     child: state is ResetPasswordLoading
//                         ? const SizedBox(
//                       height: 20,
//                       width: 20,
//                       child: CircularProgressIndicator(
//                         strokeWidth: 2,
//                         color: Colors.white,
//                       ),
//                     )
//                         : const Text(
//                       'Reset',
//                       style: TextStyle(
//                         fontSize: 16,
//                         fontWeight: FontWeight.bold,
//                         color: Colors.white,
//                       ),
//                     ),
//                   ),
//                 ),
//                 const SizedBox(height: 16),
//
//                 // Go back to login
//                 Center(
//                   child: TextButton(
//                     onPressed: () {
//                       Navigator.of(context).popUntil((route) => route.isFirst);
//                     },
//                     child: const Text(
//                       'Go back to Log in',
//                       style: TextStyle(
//                         color: Colors.blue,
//                         fontSize: 14,
//                       ),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           );
//         },
//       ),
//     );
//   }
// }
//
// // ==================== DEPENDENCIES ====================
// /*
// Add to pubspec.yaml:
//
// dependencies:
//   flutter_bloc: ^8.1.3
//   equatable: ^2.0.5  # Optional but recommended
//
// Run: flutter pub get
// */