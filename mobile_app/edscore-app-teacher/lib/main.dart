
import 'package:educore/presentation/bloc/auth/locale/locale_bloc.dart';
import 'package:educore/presentation/bloc/auth/locale/locale_state.dart';
import 'package:educore/presentation/screen/login_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

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
          localizationsDelegates:

          AppLocalizations.localizationsDelegates,
          home: LoginScreen(),
        );
      },
    );
  }
}
