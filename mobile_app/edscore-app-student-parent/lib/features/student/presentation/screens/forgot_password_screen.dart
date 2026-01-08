import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sizer/sizer.dart';
import '../../bloc/auth/forgot/forgot_bloc.dart';
import '../../bloc/auth/forgot/forgot_event.dart';
import '../../bloc/auth/forgot/forgot_state.dart';
import '../../../../core/theme/app_colours.dart';
import 'otp_screen.dart';

class ForgotPasswordScreen extends StatelessWidget {
  const ForgotPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ForgotPasswordBloc(),
      child: const ForgotPasswordView(),
    );
  }
}

class ForgotPasswordView extends StatefulWidget {
  const ForgotPasswordView({super.key});

  @override
  State<ForgotPasswordView> createState() => _ForgotPasswordViewState();
}

class _ForgotPasswordViewState extends State<ForgotPasswordView> {
  final _emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  // Cache computed values
  late final BoxDecoration cardDecoration;
  late final BorderRadius inputBorderRadius;
  late final BorderRadius buttonBorderRadius;
  late final double screenHeight;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    screenHeight = MediaQuery.of(context).size.height;
    inputBorderRadius = BorderRadius.circular(1.5.h);
    buttonBorderRadius = BorderRadius.circular(1.5.h);
    cardDecoration = BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(2.5.h),
      boxShadow: const [
        BoxShadow(
          color: Color(0x0F000000),
          blurRadius: 20,
          offset: Offset(0, 4),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _showSnackBar(String message, Color backgroundColor) {
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: TextStyle(fontSize: 14.sp),
        ),
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        margin: EdgeInsets.only(
          top: 5.h,
          left: 4.w,
          right: 4.w,
          bottom: screenHeight - 15.h,
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }

    // Email regex pattern
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!emailRegex.hasMatch(value)) {
      return 'Please enter a valid email';
    }

    return null;
  }

  void _handleSubmit(BuildContext context) {
    // Validate form
    if (_formKey.currentState?.validate() ?? false) {
      // Trigger bloc event
      context.read<ForgotPasswordBloc>().add(
        ForgotPasswordSubmitted(_emailController.text.trim()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocConsumer<ForgotPasswordBloc, ForgotPasswordState>(
        listener: (context, state) {
          if (state is ForgotPasswordSuccess) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => OtpScreen(email: _emailController.text.trim()),
              ),
            );
          } else if (state is ForgotPasswordFailure) {
            _showSnackBar(state.error, AppColors.error);
          }
        },
        builder: (context, state) {
          return Center(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              padding: EdgeInsets.symmetric(horizontal: 5.w),
              child: Form(
                key: _formKey,
                child: Container(
                  width: double.infinity,
                  constraints: BoxConstraints(maxWidth: 90.w),
                  padding: EdgeInsets.all(3.5.h),
                  decoration: cardDecoration,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Back Button
                      IconButton(
                        icon: Icon(
                          Icons.arrow_back,
                          color: AppColors.textPrimary,
                          size: 24.sp,
                        ),
                        onPressed: () => Navigator.pop(context),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),

                      SizedBox(height: 2.h),

                      // Title
                      Padding(
                        padding: EdgeInsets.only(left: 1.w),
                        child: Text(
                          'Forgot Password',
                          style: TextStyle(
                            fontSize: 20.sp,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),

                      SizedBox(height: 3.h),

                      // Email Field with Validation
                      TextFormField(
                        controller: _emailController,
                        enabled: state is! ForgotPasswordLoading,
                        keyboardType: TextInputType.emailAddress,
                        style: TextStyle(
                          fontSize: 14.sp,
                          color: AppColors.textPrimary,
                        ),
                        validator: _validateEmail,
                        autovalidateMode: AutovalidateMode.onUserInteraction,
                        decoration: InputDecoration(
                          hintText: 'Enter your email',
                          hintStyle: TextStyle(
                            color: AppColors.textHint,
                            fontSize: 15.sp,
                          ),
                          filled: true,
                          fillColor: AppColors.surface,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 4.w,
                            vertical: 2.h,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: inputBorderRadius,
                            borderSide: const BorderSide(
                              color: AppColors.border,
                              width: 1,
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: inputBorderRadius,
                            borderSide: const BorderSide(
                              color: AppColors.border,
                              width: 1,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: inputBorderRadius,
                            borderSide: const BorderSide(
                              color: AppColors.primary,
                              width: 1.5,
                            ),
                          ),
                          errorBorder: OutlineInputBorder(
                            borderRadius: inputBorderRadius,
                            borderSide: const BorderSide(
                              color: AppColors.error,
                              width: 1,
                            ),
                          ),
                          focusedErrorBorder: OutlineInputBorder(
                            borderRadius: inputBorderRadius,
                            borderSide: const BorderSide(
                              color: AppColors.error,
                              width: 1.5,
                            ),
                          ),
                          errorStyle: TextStyle(
                            fontSize: 13.sp,
                            color: AppColors.error,
                          ),
                        ),
                        onChanged: (value) {
                          // Optional: Update bloc state for real-time validation
                          context.read<ForgotPasswordBloc>().add(
                            ForgotPasswordEmailChanged(value),
                          );
                        },
                      ),

                      SizedBox(height: 3.h),

                      // Send OTP Button
                      SizedBox(
                        width: double.infinity,
                        height: 6.h,
                        child: ElevatedButton(
                          onPressed: state is ForgotPasswordLoading
                              ? null
                              : () => _handleSubmit(context),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            disabledBackgroundColor: AppColors.primary.withValues(alpha: 0.6),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: buttonBorderRadius,
                            ),
                          ),
                          child: state is ForgotPasswordLoading
                              ? SizedBox(
                            height: 2.5.h,
                            width: 2.5.h,
                            child: const CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                              : Text(
                            'Send OTP',
                            style: TextStyle(
                              fontSize: 16.sp,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
//