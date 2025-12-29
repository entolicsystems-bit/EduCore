// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get login => 'Log In';

  @override
  String get emailHint => 'Enter your email';

  @override
  String get passwordHint => 'Enter Password';

  @override
  String get forgot => 'Forgot password?';

  @override
  String get loginButton => 'Log In';

  @override
  String get version => 'version : v1.0';

  @override
  String get help => 'Get help';

  @override
  String get emailRequired => 'Email is required';

  @override
  String get emailInvalid => 'Please enter a valid email address';

  @override
  String get passwordRequired => 'Password is required';

  @override
  String get passwordShort => 'Password must be at least 6 characters';

  @override
  String get loginSuccess => 'Login successful';
}
