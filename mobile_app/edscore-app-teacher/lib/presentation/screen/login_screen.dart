import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:educore/l10n/app_localizations.dart';

import '../bloc/auth/login/auth_bloc.dart';
import '../bloc/auth/login/auth_event.dart';
import '../bloc/auth/login/auth_state.dart';
import 'forgot_password.dart';
import 'package:educore/core/theme/app_colors.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => LoginBloc(),
      child: const LoginView(),
    );
  }
}

class LoginView extends StatefulWidget {
  const LoginView({super.key});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _emailTouched = false;
  bool _passwordTouched = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  String? _validateEmail(String? value) {
    if (!_emailTouched) return null;

    final t = AppLocalizations.of(context)!;

    if (value == null || value.trim().isEmpty) {
      return t.emailRequired;
    }

    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!emailRegex.hasMatch(value.trim())) {
      return t.emailInvalid;
    }

    return null;
  }

  String? _validatePassword(String? value) {
    if (!_passwordTouched) return null;

    final t = AppLocalizations.of(context)!;

    if (value == null || value.isEmpty) {
      return t.passwordRequired;
    }

    if (value.length < 6) {
      return t.passwordShort;
    }

    return null;
  }

  void _submitForm() {
    setState(() {
      _emailTouched = true;
      _passwordTouched = true;
    });

    if (_formKey.currentState!.validate()) {
      context.read<LoginBloc>().add(
        LoginSubmitted(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocConsumer<LoginBloc, LoginState>(
        listener: (context, state) {
          if (state is LoginSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(t.loginSuccess),
                backgroundColor: AppColors.success,
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.only(top: 16, left: 16, right: 16),
              ),
            );
          } else if (state is LoginFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.error),
                backgroundColor: AppColors.error,
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.only(top: 16, left: 16, right: 16),
              ),
            );
          }
        },
        builder: (context, state) {
          return Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [

                    /// LOGO BOX
                    Container(
                      height: 162,
                      width: 267,
                      constraints: const BoxConstraints(maxWidth: 380),
                      padding: const EdgeInsets.symmetric(vertical: 28),
                      margin: const EdgeInsets.only(bottom: 20),
                      decoration: BoxDecoration(
                        color: AppColors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppColors.border,
                          width: 2,
                        ),
                      ),
                      child: const Center(
                        child: Text(
                          'logo',
                          style: TextStyle(
                            fontSize: 30,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2,
                            color: AppColors.textDark,
                          ),
                        ),
                      ),
                    ),

                    Container(
                      constraints: const BoxConstraints(maxWidth: 380),
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppColors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 15,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            t.login,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                          const SizedBox(height: 24),

                          TextFormField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            validator: _validateEmail,
                            onTap: () {
                              if (!_emailTouched) {
                                setState(() => _emailTouched = true);
                              }
                            },
                            onChanged: (_) => setState(() {}),
                            decoration: InputDecoration(
                              hintText: t.emailHint,
                              filled: true,
                              fillColor: AppColors.inputBg,

                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: AppColors.border,
                                  width: 1,
                                ),
                              ),

                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: AppColors.border,
                                  width: 1,
                                ),
                              ),

                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: AppColors.primary,
                                  width: 1,
                                ),
                              ),
                            ),
                          ),


                          const SizedBox(height: 14),

                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscurePassword,
                            validator: _validatePassword,
                            onTap: () {
                              if (!_passwordTouched) {
                                setState(() => _passwordTouched = true);
                              }
                            },
                            onChanged: (_) => setState(() {}),
                            decoration: InputDecoration(
                              hintText: t.passwordHint,
                              filled: true,
                              fillColor: AppColors.inputBg,

                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: AppColors.border,
                                  width: 1,
                                ),
                              ),

                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: AppColors.border,
                                  width: 1,
                                ),
                              ),

                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: AppColors.primary,
                                  width: 1,
                                ),
                              ),

                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword ? Icons.visibility_off : Icons.visibility,
                                  color: AppColors.textGrey,
                                ),
                                onPressed: () {
                                  setState(() {
                                    _obscurePassword = !_obscurePassword;
                                  });
                                },
                              ),
                            ),
                          ),

                          const SizedBox(height: 16),


                          SizedBox(
                            width: double.infinity,
                            height: 48,
                            child: ElevatedButton(
                              onPressed:
                              state is LoginLoading ? null : _submitForm,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              child: state is LoginLoading
                                  ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                                  : Text(
                                t.loginButton,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 10),

                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) =>
                                    const ForgotPasswordScreen(),
                                  ),
                                );
                              },
                              child: Text(
                                t.forgot,
                                style: const TextStyle(
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 100),

                    Text(
                      t.version,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textGrey,
                      ),
                    ),

                    TextButton(
                      onPressed: () {},
                      child: Text(
                        t.help,
                        style: const TextStyle(
                          fontSize: 18,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
