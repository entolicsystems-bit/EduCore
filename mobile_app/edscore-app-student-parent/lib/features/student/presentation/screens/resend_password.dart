import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sizer/sizer.dart';
import '../../bloc/auth/reset_password/reset_bloc.dart';
import '../../bloc/auth/reset_password/reset_event.dart';
import '../../bloc/auth/reset_password/reset_state.dart';
import '../../../../core/theme/app_colours.dart';

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
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _obscureNewPassword = true;
  bool _obscureConfirmPassword = true;

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
            color: Color(0x14000000),
            blurRadius: 16,
            offset: Offset(0, 8),
          ),
        ],
      );
    }
  }

  @override
  void dispose() {
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
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
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocConsumer<ResetPasswordBloc, ResetPasswordState>(
        listener: (context, state) {
          if (state is ResetPasswordSuccess) {
            _showSnackBar('Password reset successful!', AppColors.success);
            Navigator.of(context).popUntil((route) => route.isFirst);
          } else if (state is ResetPasswordFailure) {
            _showSnackBar(state.error, AppColors.error);
          }
        },
        builder: (context, state) {
          String? newPasswordError;
          String? confirmPasswordError;

          if (state is ResetPasswordValidating) {
            newPasswordError = state.newPasswordError;
            confirmPasswordError = state.confirmPasswordError;
          }

          return Center(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              padding: EdgeInsets.symmetric(
                horizontal: isDesktop ? 8.w : 5.w,
                vertical: 2.h,
              ),
              child: Container(
                constraints: BoxConstraints(maxWidth: maxCardWidth),
                padding: EdgeInsets.all(isDesktop ? 4.h : 3.h),
                decoration: cardDecoration,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header with back button
                    Row(
                      children: [
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
                        SizedBox(width: 2.w),
                      ],
                    ),

                    SizedBox(height: isDesktop ? 1.5.h : 1.h),

                    // Title
                    Padding(
                      padding: EdgeInsets.only(left: 1.w),
                      child: Text(
                        'Reset Password',
                        style: TextStyle(
                          fontSize: isDesktop ? 16.sp : 20.sp,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),

                    SizedBox(height: isDesktop ? 3.5.h : 3.h),

                    // New Password Field
                    _PasswordField(
                      controller: _newPasswordController,
                      hintText: 'Enter New Password',
                      errorText: newPasswordError,
                      obscureText: _obscureNewPassword,
                      borderRadius: inputBorderRadius,
                      isDesktop: isDesktop,
                      onVisibilityToggle: () {
                        setState(() {
                          _obscureNewPassword = !_obscureNewPassword;
                        });
                      },
                    ),

                    SizedBox(height: isDesktop ? 2.5.h : 2.h),

                    // Confirm Password Field
                    _PasswordField(
                      controller: _confirmPasswordController,
                      hintText: 'Confirm Password',
                      errorText: confirmPasswordError,
                      obscureText: _obscureConfirmPassword,
                      borderRadius: inputBorderRadius,
                      isDesktop: isDesktop,
                      onVisibilityToggle: () {
                        setState(() {
                          _obscureConfirmPassword = !_obscureConfirmPassword;
                        });
                      },
                    ),

                    SizedBox(height: isDesktop ? 3.5.h : 3.h),

                    // Reset Button
                    SizedBox(
                      width: double.infinity,
                      height: isDesktop ? 50 : 6.h,
                      child: ElevatedButton(
                        onPressed: state is ResetPasswordLoading
                            ? null
                            : () {
                          context.read<ResetPasswordBloc>().add(
                            ResetPasswordSubmitted(
                              email: widget.email,
                              newPassword: _newPasswordController.text,
                              confirmPassword:
                              _confirmPasswordController.text,
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
                        child: state is ResetPasswordLoading
                            ? SizedBox(
                          height: isDesktop ? 20 : 2.5.h,
                          width: isDesktop ? 20 : 2.5.h,
                          child: const CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                            : Text(
                          'Reset',
                          style: TextStyle(
                            fontSize: isDesktop ? 12.sp : 16.sp,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),

                    SizedBox(height: 2.h),

                    // Back to Login Button
                    Center(
                      child: TextButton(
                        onPressed: () {
                          Navigator.of(context)
                              .popUntil((route) => route.isFirst);
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.primary,
                          padding: EdgeInsets.symmetric(
                            horizontal: 2.w,
                            vertical: 1.h,
                          ),
                        ),
                        child: Text(
                          'Go Back to Log in',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontSize: isDesktop ? 11.sp : 14.sp,
                            fontWeight: FontWeight.w500,
                          ),
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

// Extracted Password Field Widget
class _PasswordField extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final String? errorText;
  final bool obscureText;
  final BorderRadius borderRadius;
  final bool isDesktop;
  final VoidCallback onVisibilityToggle;

  const _PasswordField({
    required this.controller,
    required this.hintText,
    this.errorText,
    required this.obscureText,
    required this.borderRadius,
    required this.isDesktop,
    required this.onVisibilityToggle,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      style: TextStyle(
        fontSize: isDesktop ? 11.sp : 16.sp,
        color: AppColors.textPrimary,
      ),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(
          color: AppColors.textHint,
          fontSize: isDesktop ? 11.sp : 15.sp,
        ),
        errorText: errorText,
        errorStyle: TextStyle(
          fontSize: isDesktop ? 10.sp : 13.sp,
          color: AppColors.error,
        ),
        filled: true,
        fillColor: AppColors.surface,
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
            width: 1.5,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: borderRadius,
          borderSide: const BorderSide(
            color: AppColors.error,
            width: 1,
          ),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: borderRadius,
          borderSide: const BorderSide(
            color: AppColors.error,
            width: 1.5,
          ),
        ),
        contentPadding: EdgeInsets.symmetric(
          horizontal: isDesktop ? 20 : 4.w,
          vertical: isDesktop ? 16 : 2.h,
        ),
        suffixIcon: IconButton(
          icon: Icon(
            obscureText
                ? Icons.visibility_outlined
                : Icons.visibility_off_outlined,
            color: AppColors.primary,
            size: isDesktop ? 18.sp : 22.sp,
          ),
          onPressed: onVisibilityToggle,
        ),
      ),
    );
  }
}