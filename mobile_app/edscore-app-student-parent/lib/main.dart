import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sizer/sizer.dart';
import 'package:student/common/document_preview_widget.dart';
import 'package:student/features/parent/bloc/birth/birth_bloc.dart';
import 'package:student/features/parent/presentation/screens/medical_screen.dart';
import 'core/theme/app_colours.dart';
import 'features/parent/presentation/screens/birth_screen.dart';


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
    // Sizer must wrap the **entire app** at the top
    return Sizer(
      builder: (context, orientation, deviceType) {
        // Wrap MaterialApp with BlocProviders, not the other way around
        return MultiBlocProvider(
          providers: [
            BlocProvider<BirthBloc>(
              create: (_) => BirthBloc(),
            ),
          ],
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Student App',
            theme: AppTheme.lightTheme,
            home: BirthScreen(),
          ),
        );
      },
    );
  }
}
