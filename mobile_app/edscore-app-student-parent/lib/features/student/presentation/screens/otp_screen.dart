import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sizer/sizer.dart';
import '../../bloc/auth/otp_screen/otp_bloc.dart';
import '../../bloc/auth/otp_screen/otp_event.dart';
import '../../bloc/auth/otp_screen/otp_state.dart';
import '../../../../core/theme/app_colours.dart';
import 'resend_password.dart';

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
  final List<FocusNode> _focusNodes =
  List.generate(4, (_) => FocusNode());

  Timer? _timer;
  int _secondsRemaining = 30;
  bool _isExpired = false;

  // Cache computed values
  late final BoxDecoration cardDecoration;
  late final BorderRadius otpFieldBorderRadius;
  late final BorderRadius buttonBorderRadius;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    otpFieldBorderRadius = BorderRadius.circular(1.5.h);
    buttonBorderRadius = BorderRadius.circular(1.5.h);
    cardDecoration = BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(2.5.h),
      boxShadow: const [
        BoxShadow(
          color: Color(0x14000000),
          blurRadius: 16,
          offset: Offset(0, 8),
        ),
      ],
    );
  }

  void _startTimer() {
    _timer?.cancel();
    if (mounted) {
      setState(() {
        _secondsRemaining = 30;
        _isExpired = false;
      });
    }

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

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

  String _getOtp() =>
      _controllers.map((controller) => controller.text).join();

  bool get _isOtpComplete =>
      _controllers.every((controller) => controller.text.isNotEmpty);

  @override
  void dispose() {
    _timer?.cancel();
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  void _clearOtp() {
    for (final c in _controllers) {
      c.clear();
    }
    if (_focusNodes.isNotEmpty && _focusNodes.first.canRequestFocus) {
      _focusNodes.first.requestFocus();
    }
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
                content: Text(
                  state.error,
                  style: TextStyle(fontSize: 14.sp),
                ),
                backgroundColor: AppColors.error,
                behavior: SnackBarBehavior.floating,
                margin: EdgeInsets.only(
                  top: 5.h,
                  left: 4.w,
                  right: 4.w,
                  bottom: MediaQuery.of(context).size.height - 15.h,
                ),
              ),
            );
          } else if (state is OtpResent) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'OTP resent successfully',
                  style: TextStyle(fontSize: 15.sp),
                ),
                backgroundColor: AppColors.success,
                behavior: SnackBarBehavior.floating,
                margin: EdgeInsets.only(
                  top: 5.h,
                  left: 4.w,
                  right: 4.w,
                  bottom: MediaQuery.of(context).size.height - 15.h,
                ),
              ),
            );
            _clearOtp();
            _startTimer();
          }
        },
        builder: (context, state) {
          return Center(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              padding: EdgeInsets.symmetric(horizontal: 5.w),
              child: Container(
                constraints: BoxConstraints(maxWidth: 90.w),
                padding: EdgeInsets.all(3.h),
                decoration: cardDecoration,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header with back button
                    Align(
                      alignment: Alignment.centerLeft,
                      child: IconButton(
                        icon: Icon(
                          Icons.arrow_back,
                          color: AppColors.textPrimary,
                          size: 24.sp,
                        ),
                        onPressed: () => Navigator.pop(context),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ),

                    SizedBox(height: 2.h),

                    // Title
                    Text(
                      'Enter Otp',
                      style: TextStyle(
                        fontSize: 21.sp,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),

                    SizedBox(height: 4.h),

                    // OTP Input Fields
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: List.generate(4, (index) {
                        return _OtpInputField(
                          controller: _controllers[index],
                          focusNode: _focusNodes[index],
                          isExpired: _isExpired,
                          borderRadius: otpFieldBorderRadius,
                          onChanged: (value) {
                            if (value.isNotEmpty && index < 3) {
                              _focusNodes[index + 1].requestFocus();
                            } else if (value.isEmpty && index > 0) {
                              _focusNodes[index - 1].requestFocus();
                            }
                          },
                        );
                      }),
                    ),

                    SizedBox(height: 1.5.h),

                    // Expiry Message
                    if (_isExpired)
                      Text(
                        'OTP expired. Please resend.',
                        style: TextStyle(
                          color: AppColors.error,
                          fontSize: 13.sp,
                        ),
                      ),

                    SizedBox(height: 3.h),

                    // Verify Button
                    SizedBox(
                      width: double.infinity,
                      height: 6.h,
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
                          disabledBackgroundColor: AppColors.disabled,
                          shape: RoundedRectangleBorder(
                            borderRadius: buttonBorderRadius,
                          ),
                        ),
                        child: state is OtpLoading
                            ? SizedBox(
                          height: 2.5.h,
                          width: 2.5.h,
                          child: const CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                            : Text(
                          'Verify',
                          style: TextStyle(
                            fontSize: 17.sp,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),

                    SizedBox(height: 2.h),

                    // Resend OTP Button
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
                          text: 'Resend OTP in : ',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 15.sp,
                          ),
                          children: [
                            TextSpan(
                              text: _isExpired
                                  ? 'Tap to resend'
                                  : '00:${_secondsRemaining.toString().padLeft(2, '0')}',
                              style: TextStyle(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w600,
                                fontSize: 15.sp,
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
}

// Extracted OTP Input Field Widget
class _OtpInputField extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final bool isExpired;
  final BorderRadius borderRadius;
  final ValueChanged<String> onChanged;

  const _OtpInputField({
    required this.controller,
    required this.focusNode,
    required this.isExpired,
    required this.borderRadius,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 15.w,
      height: 7.h,
      child: TextField(
        controller: controller,
        focusNode: focusNode,
        enabled: !isExpired,
        maxLength: 1,
        keyboardType: TextInputType.number,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 20.sp,
          fontWeight: FontWeight.bold,
          color: AppColors.textPrimary,
        ),
        decoration: InputDecoration(
          counterText: '',
          filled: true,
          fillColor: isExpired ? AppColors.disabled : AppColors.surface,
          border: OutlineInputBorder(
            borderRadius: borderRadius,
            borderSide: const BorderSide(
              color: AppColors.border,
              width: 1,
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: borderRadius,
            borderSide: const BorderSide(
              color: AppColors.border,
              width: 1,
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: borderRadius,
            borderSide: const BorderSide(
              color: AppColors.primary,
              width: 2,
            ),
          ),
          contentPadding: EdgeInsets.zero,
        ),
        onChanged: onChanged,
      ),
    );
  }
}