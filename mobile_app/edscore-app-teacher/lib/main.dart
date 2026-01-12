import 'package:educore/presentation/bloc/auth/locale/locale_bloc.dart';
import 'package:educore/presentation/bloc/auth/locale/locale_state.dart';
import 'package:educore/presentation/screen/login_screen.dart';
import 'package:educore/core/storage/secure_token_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'l10n/app_localizations.dart';

void main() {
  runApp(
    BlocProvider(
      create: (_) => LocaleBloc(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LocaleBloc, LocaleState>(
      builder: (context, state) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          locale: state.locale,
          supportedLocales: const [
            Locale('en'),
            Locale('mr'),
            Locale('hi'),
          ],
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          home: const AuthCheck(), // ← FIXED: Check auth first
        );
      },
    );
  }
}

// Auth Check Widget
class AuthCheck extends StatelessWidget {
  const AuthCheck({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: _checkAuthStatus(),
      builder: (context, snapshot) {
        // Show loading while checking
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        // Check if user is authenticated
        final isLoggedIn = snapshot.data ?? false;

        if (isLoggedIn) {
          // Navigate to teacher dashboard
          return const Scaffold(
            body: Center(
              child: Text('Teacher Dashboard - Coming Soon'),
            ),
          );
        }

        // Show login screen
        return const LoginScreen();
      },
    );
  }

  Future<bool> _checkAuthStatus() async {
    final isLoggedIn = await SecureTokenStorage.isLoggedIn();
    final isTeacher = await SecureTokenStorage.isTeacher();

    // Only logged in if token exists, not expired, and is teacher
    return isLoggedIn && isTeacher;
  }
}