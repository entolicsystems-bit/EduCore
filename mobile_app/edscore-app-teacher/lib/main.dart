import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:educore/presentation/bloc/auth/locale/locale_bloc.dart';
import 'package:educore/presentation/bloc/auth/locale/locale_state.dart';
import 'package:educore/presentation/screen/login_screen.dart';
import 'package:educore/core/storage/secure_token_storage.dart';

import 'l10n/app_localizations.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

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
          localizationsDelegates:
          AppLocalizations.localizationsDelegates,
          home: const AuthGate(),
        );
      },
    );
  }
}

/// ================= AUTH GATE =================
class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<AuthResult>(
      future: _checkAuthStatus(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const SplashScreen();
        }

        final result = snapshot.data ?? AuthResult.loggedOut;

        switch (result) {
          case AuthResult.teacher:
            return const TeacherDashboard();

          case AuthResult.loggedOut:
          default:
            return const LoginScreen();
        }
      },
    );
  }

  Future<AuthResult> _checkAuthStatus() async {
    final isLoggedIn = await SecureTokenStorage.isLoggedIn();
    if (!isLoggedIn) return AuthResult.loggedOut;

    final isTeacher = await SecureTokenStorage.isTeacher();
    if (isTeacher) return AuthResult.teacher;

    return AuthResult.loggedOut;
  }
}

/// ================= ENUM =================
enum AuthResult {
  loggedOut,
  teacher,
}

/// ================= SCREENS =================
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}

class TeacherDashboard extends StatelessWidget {
  const TeacherDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          'Teacher Dashboard - Coming Soon',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
