// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Marathi (`mr`).
class AppLocalizationsMr extends AppLocalizations {
  AppLocalizationsMr([String locale = 'mr']) : super(locale);

  @override
  String get login => 'लॉग इन';

  @override
  String get emailHint => 'ईमेल टाका';

  @override
  String get passwordHint => 'पासवर्ड टाका';

  @override
  String get forgot => 'पासवर्ड विसरलात?';

  @override
  String get loginButton => 'लॉग इन';

  @override
  String get version => 'आवृत्ती : v1.0';

  @override
  String get help => 'मदत घ्या';

  @override
  String get emailRequired => 'ईमेल आवश्यक आहे';

  @override
  String get emailInvalid => 'कृपया वैध ईमेल टाका';

  @override
  String get passwordRequired => 'पासवर्ड आवश्यक आहे';

  @override
  String get passwordShort => 'पासवर्ड किमान 6 अक्षरांचा असावा';

  @override
  String get loginSuccess => 'लॉगिन यशस्वी';
}
