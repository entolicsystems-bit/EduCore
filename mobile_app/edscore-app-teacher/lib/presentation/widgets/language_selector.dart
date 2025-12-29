import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/auth/locale/locale_bloc.dart';
import '../bloc/auth/locale/locale_event.dart';
import '../bloc/auth/locale/locale_state.dart';


class LanguageSelector extends StatelessWidget {
  const LanguageSelector({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LocaleBloc, LocaleState>(
      builder: (context, state) {
        return PopupMenuButton<Locale>(
          icon: const Icon(Icons.language, color: Colors.blue),
          onSelected: (locale) {
            context.read<LocaleBloc>().add(ChangeLanguage(locale));
          },
          itemBuilder: (_) => [
            _item('English', 'en', state),
            _item('मराठी', 'mr', state),
            _item('हिंदी', 'hi', state),
          ],
        );
      },
    );
  }

  PopupMenuItem<Locale> _item(
      String text, String code, LocaleState state) {
    return PopupMenuItem(
      value: Locale(code),
      child: Row(
        children: [
          if (state.locale.languageCode == code)
            const Icon(Icons.check, color: Colors.blue, size: 18),
          const SizedBox(width: 8),
          Text(text),
        ],
      ),
    );
  }
}
