import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../core/theme/app_colors.dart';
import 'reset_screen.dart';

import '../bloc/auth/otp/otp_bloc.dart';
import '../bloc/auth/otp/otp_event.dart';
import '../bloc/auth/otp/otp_state.dart';


class OtpScreen extends StatelessWidget {
  final String email;

  const OtpScreen({super.key, required this.email});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => OtpBloc(),
      child: OtpView(email: email),
    );
  }
}

class OtpView extends StatefulWidget {
  final String email;

  const OtpView({super.key, required this.email});

  @override
  State<OtpView> createState() => _OtpViewState();
}

class _OtpViewState extends State<OtpView> {
  final List<TextEditingController> _controllers =
  List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

  Timer? _timer;
  int _secondsRemaining = 30;
  bool _isExpired = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() {
      _secondsRemaining = 30;
      _isExpired = false;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() {
          _secondsRemaining--;
        });
      } else {
        setState(() {
          _isExpired = true;
        });
        timer.cancel();
      }
    });
  }

  String _getOtp() => _controllers.map((c) => c.text).join();

  bool get _isOtpComplete => _controllers.every((c) => c.text.isNotEmpty);

  @override
  void dispose() {
    _timer?.cancel();
    for (final c in _controllers) c.dispose();
    for (final f in _focusNodes) f.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocConsumer<OtpBloc, OtpState>(
        listener: (context, state) {
          if (state is OtpVerified) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => ResetPasswordScreen(email: widget.email),
              ),
            );
          } else if (state is OtpFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.error),
                backgroundColor: AppColors.error,
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.all(16),
              ),
            );
          } else if (state is OtpResent) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('OTP resent successfully'),
                backgroundColor: AppColors.success,
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.all(16),
              ),
            );
            _clearOtp();
            _startTimer();
          }
        },
        builder: (context, state) {
          return Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 360),
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.cardBg,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [

                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
                          onPressed: () => Navigator.pop(context),
                        ),
                        const SizedBox(width: 8),
                        Padding(
                          padding: const EdgeInsets.only(top: 50),
                          child: const Text(
                            'Enter OTP',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),


                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(4, (index) {
                        return SizedBox(
                          width: 50,
                          height: 50,
                          child: TextField(
                            controller: _controllers[index],
                            focusNode: _focusNodes[index],
                            enabled: !_isExpired,
                            maxLength: 1,
                            keyboardType: TextInputType.number,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                            decoration: InputDecoration(
                              counterText: '',
                              filled: true,
                              fillColor: _isExpired
                                  ? AppColors.inputBg.withOpacity(0.5)
                                  : AppColors.inputBg,

                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: const BorderSide(
                                  color: AppColors.border,
                                  width: 1,
                                ),
                              ),

                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: const BorderSide(
                                  color: AppColors.border,
                                  width: 1,
                                ),
                              ),

                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: const BorderSide(
                                  color: AppColors.primary,
                                  width: 1,
                                ),
                              ),

                              disabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide(
                                  color: AppColors.border.withOpacity(0.5),
                                  width: 1,
                                ),
                              ),
                            ),
                            onChanged: (value) {
                              if (value.isNotEmpty && index < 3) {
                                _focusNodes[index + 1].requestFocus();
                              } else if (value.isEmpty && index > 0) {
                                _focusNodes[index - 1].requestFocus();
                              }
                            },
                          ),
                        );
                      }),
                    ),

                    const SizedBox(height: 12),

                    if (_isExpired)
                      const Text(
                        'OTP expired. Please resend.',
                        style: TextStyle(
                          color: AppColors.error,
                          fontSize: 13,
                        ),
                      ),

                    const SizedBox(height: 16),

                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: ElevatedButton(
                        onPressed: (!_isOtpComplete || _isExpired || state is OtpLoading)
                            ? null
                            : () {
                          context.read<OtpBloc>().add(
                            OtpSubmitted(
                              otp: _getOtp(),
                              email: widget.email,
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: state is OtpLoading
                            ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                            : const Text(
                          'Verify',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    TextButton(
                      onPressed: _isExpired
                          ? () {
                        context.read<OtpBloc>().add(
                          OtpResendRequested(widget.email),
                        );
                      }
                          : null,
                      child: RichText(
                        text: TextSpan(
                          text: _isExpired
                              ? 'Resend OTP'
                              : 'Resend OTP in ',
                          style: TextStyle(color: AppColors.textGrey),
                          children: _isExpired
                              ? []
                              : [
                            TextSpan(
                              text:
                              '00:${_secondsRemaining.toString().padLeft(2, '0')}',
                              style: TextStyle(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
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

  void _clearOtp() {
    for (final c in _controllers) c.clear();
    _focusNodes.first.requestFocus();
  }
}
