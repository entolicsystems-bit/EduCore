// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Hindi (`hi`).
class AppLocalizationsHi extends AppLocalizations {
  AppLocalizationsHi([String locale = 'hi']) : super(locale);

  @override
  String get login => 'लॉग इन';

  @override
  String get emailHint => 'ईमेल दर्ज करें';

  @override
  String get passwordHint => 'पासवर्ड दर्ज करें';

  @override
  String get forgot => 'पासवर्ड भूल गए?';

  @override
  String get loginButton => 'लॉग इन';

  @override
  String get version => 'संस्करण : v1.0';

  @override
  String get help => 'मदद लें';

  @override
  String get emailRequired => 'ईमेल आवश्यक है';

  @override
  String get emailInvalid => 'कृपया मान्य ईमेल दर्ज करें';

  @override
  String get passwordRequired => 'पासवर्ड आवश्यक है';

  @override
  String get passwordShort => 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए';

  @override
  String get loginSuccess => 'लॉगिन सफल';
}
