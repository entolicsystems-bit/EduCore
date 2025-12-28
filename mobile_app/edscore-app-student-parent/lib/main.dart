import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student/features/student/presentation/screens/forgot_password_screen.dart';
import 'package:student/features/student/presentation/screens/login_screen.dart';
import 'package:student/features/student/presentation/screens/otp_screen.dart';
import 'package:student/features/student/presentation/screens/resend_password.dart';

import 'features/student/bloc/student_bloc.dart';
import 'features/student/presentation/screens/student_list_screeen.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: LoginPage(),
    );
  }
}

