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

  // Cache computed values - using nullable to prevent reinitialization errors
  BoxDecoration? _cardDecoration;
  BorderRadius? _inputBorderRadius;
  BorderRadius? _buttonBorderRadius;
  double? _screenHeight;
  double? _screenWidth;

  // Getters for safe access
  BoxDecoration get cardDecoration => _cardDecoration!;
  BorderRadius get inputBorderRadius => _inputBorderRadius!;
  BorderRadius get buttonBorderRadius => _buttonBorderRadius!;
  double get screenHeight => _screenHeight ?? MediaQuery.of(context).size.height;
  double get screenWidth => _screenWidth ?? MediaQuery.of(context).size.width;

  // Responsive breakpoints
  bool get isTablet => screenWidth > 600;
  bool get isDesktop => screenWidth > 1024;

  double get maxCardWidth {
    if (isDesktop) return 500;
    if (isTablet) return 600;
    return 90.w;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    // Only initialize once to prevent reinitialization errors
    if (_screenHeight == null) {
      final size = MediaQuery.of(context).size;
      _screenHeight = size.height;
      _screenWidth = size.width;

      _inputBorderRadius = BorderRadius.circular(1.5.h);
      _buttonBorderRadius = BorderRadius.circular(1.5.h);
      _cardDecoration = BoxDecoration(
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
          style: TextStyle(fontSize: isDesktop ? 12.sp : 14.sp),
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
              padding: EdgeInsets.symmetric(
                horizontal: isDesktop ? 8.w : 5.w,
                vertical: 2.h,
              ),
              child: Form(
                key: _formKey,
                child: Container(
                  width: double.infinity,
                  constraints: BoxConstraints(maxWidth: maxCardWidth),
                  padding: EdgeInsets.all(isDesktop ? 4.h : 3.5.h),
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
                          size: isDesktop ? 20.sp : 24.sp,
                        ),
                        onPressed: () => Navigator.pop(context),
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),

                      SizedBox(height: isDesktop ? 2.5.h : 2.h),

                      // Title
                      Padding(
                        padding: EdgeInsets.only(left: 1.w),
                        child: Text(
                          'Forgot Password',
                          style: TextStyle(
                            fontSize: isDesktop ? 16.sp : 20.sp,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),

                      SizedBox(height: isDesktop ? 3.5.h : 3.h),

                      // Email Field with Validation
                      TextFormField(
                        controller: _emailController,
                        enabled: state is! ForgotPasswordLoading,
                        keyboardType: TextInputType.emailAddress,
                        style: TextStyle(
                          fontSize: isDesktop ? 11.sp : 14.sp,
                          color: AppColors.textPrimary,
                        ),
                        validator: _validateEmail,
                        autovalidateMode: AutovalidateMode.onUserInteraction,
                        decoration: InputDecoration(
                          hintText: 'Enter your email',
                          hintStyle: TextStyle(
                            color: AppColors.textHint,
                            fontSize: isDesktop ? 12.sp : 15.sp,
                          ),
                          filled: true,
                          fillColor: AppColors.surface,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: isDesktop ? 20 : 4.w,
                            vertical: isDesktop ? 16 : 2.h,
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
                            fontSize: isDesktop ? 10.sp : 13.sp,
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

                      SizedBox(height: isDesktop ? 3.5.h : 3.h),

                      // Send OTP Button
                      SizedBox(
                        width: double.infinity,
                        height: isDesktop ? 50 : 6.h,
                        child: ElevatedButton(
                          onPressed: state is ForgotPasswordLoading
                              ? null
                              : () => _handleSubmit(context),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            disabledBackgroundColor:
                            AppColors.primary.withValues(alpha: 0.6),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: buttonBorderRadius,
                            ),
                          ),
                          child: state is ForgotPasswordLoading
                              ? SizedBox(
                            height: isDesktop ? 20 : 2.5.h,
                            width: isDesktop ? 20 : 2.5.h,
                            child: const CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                              : Text(
                            'Send OTP',
                            style: TextStyle(
                              fontSize: isDesktop ? 12.sp : 16.sp,
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