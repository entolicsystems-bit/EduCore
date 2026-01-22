import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sizer/sizer.dart';
import 'package:student/features/parent/presentation/screens/document_preview_screen.dart';
import 'package:student/features/parent/presentation/screens/student_profile_screen.dart';

import 'core/theme/app_colours.dart';
import 'core/storage/secure_token_storage.dart';

import 'features/parent/bloc/parent_bloc.dart';
import 'features/parent/bloc/parent_home_bloc.dart';
import 'features/parent/bloc/student_profile/student_profile_bloc.dart';

import 'features/parent/data/repository/student_repository.dart';

import 'features/parent/presentation/screens/offer_letter_screen.dart';
import 'features/parent/presentation/screens/parent_home_screen.dart';
import 'features/student/presentation/screens/student_details_screen.dart';
import 'features/student/presentation/screens/login_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Sizer(
      builder: (context, orientation, deviceType) {
        return MultiBlocProvider(
          providers: [
            BlocProvider(create: (_) => ParentBloc()),
            BlocProvider(create: (_) => ParentHomeBloc()),

            /// ✅ Student Profile Bloc
            BlocProvider(
              create: (_) => StudentProfileBloc(
                StudentRepository(
                  "http://3.7.212.22:3000/v1", // ✅ BASE URL
                ),
              ),
            ),
          ],
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Student App',
            theme: AppTheme.lightTheme,
            home: const AuthCheck(),
          ),
        );
      },
    );
  }
}

/// ======================================================
/// AUTH CHECK
/// ======================================================
class AuthCheck extends StatelessWidget {
  const AuthCheck({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: _checkAuthStatus(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final data = snapshot.data ?? {};
        final isLoggedIn = data['isLoggedIn'] ?? false;
        final role = data['role'];

        if (isLoggedIn) {
          if (role == 'STUDENT') {
            return const StudentDetailsScreen();
          } else if (role == 'PARENT') {
            return const ParentHomeScreen();
          }
        }

        /// ✅ NOT LOGGED IN → LOGIN SCREEN
        return const StudentProfileScreen(studentId: '', token: '');
      },
    );
  }

  Future<Map<String, dynamic>> _checkAuthStatus() async {
    final isLoggedIn = await SecureTokenStorage.isLoggedIn();
    final role = await SecureTokenStorage.getRole();

    return {
      'isLoggedIn': isLoggedIn,
      'role': role,
    };
  }
}
