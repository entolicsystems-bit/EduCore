import 'package:educore/presentation/bloc/auth/reset/reset_bloc.dart';
import 'package:educore/presentation/bloc/auth/reset/reset_event.dart';
import 'package:educore/presentation/bloc/auth/reset/reset_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ResetPasswordScreen extends StatelessWidget {
  final String email;

  const ResetPasswordScreen({super.key, required this.email});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ResetPasswordBloc(),
      child: ResetPasswordView(email: email),
    );
  }
}

class ResetPasswordView extends StatefulWidget {
  final String email;

  const ResetPasswordView({super.key, required this.email});

  @override
  State<ResetPasswordView> createState() => _ResetPasswordViewState();
}

class _ResetPasswordViewState extends State<ResetPasswordView> {
  final _newController = TextEditingController();
  final _confirmController = TextEditingController();

  @override
  void dispose() {
    _newController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<ResetPasswordBloc, ResetPasswordState>(
        listener: (context, state) {
          if (state is ResetPasswordSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Password reset successful')),
            );
            Navigator.pop(context);
          } else if (state is ResetPasswordFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.error)),
            );
          }
        },
        builder: (context, state) {
          String? newError;
          String? confirmError;

          if (state is ResetPasswordValidating) {
            newError = state.newPasswordError;
            confirmError = state.confirmPasswordError;
          }

          return Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextField(
                  controller: _newController,
                  obscureText: true,
                  decoration: InputDecoration(
                    hintText: 'New password',
                    errorText: newError,
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _confirmController,
                  obscureText: true,
                  decoration: InputDecoration(
                    hintText: 'Confirm password',
                    errorText: confirmError,
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: state is ResetPasswordLoading
                        ? null
                        : () {
                      context.read<ResetPasswordBloc>().add(
                        ResetPasswordSubmitted(
                          email: widget.email,
                          newPassword: _newController.text,
                          confirmPassword:
                          _confirmController.text,
                        ),
                      );
                    },
                    child: state is ResetPasswordLoading
                        ? const CircularProgressIndicator(
                      color: Colors.white,
                    )
                        : const Text('Reset Password'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
