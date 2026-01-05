import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sizer/sizer.dart';
import '../../bloc/auth/login/login_bloc.dart';
import '../../bloc/auth/login/login_event.dart';
import '../../bloc/auth/login/login_state.dart';
import '../../../../core/theme/app_colours.dart';
import 'forgot_password_screen.dart';
import 'student_details_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool isStudentSelected = true;

  // Cache computed values for better performance
  late final double screenHeight;
  late final BoxDecoration cardDecoration;
  late final BorderRadius inputBorderRadius;
  late final BorderRadius tabBorderRadiusLeft;
  late final BorderRadius tabBorderRadiusRight;
  late final BorderRadius buttonBorderRadius;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    screenHeight = MediaQuery.of(context).size.height;
    inputBorderRadius = BorderRadius.circular(1.5.h);
    tabBorderRadiusLeft = BorderRadius.only(
      topLeft: Radius.circular(1.5.h),
      bottomLeft: Radius.circular(1.5.h),
    );
    tabBorderRadiusRight = BorderRadius.only(
      topRight: Radius.circular(1.5.h),
      bottomRight: Radius.circular(1.5.h),
    );
    buttonBorderRadius = BorderRadius.circular(1.5.h);
    cardDecoration = BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(2.h),
      boxShadow: const [
        BoxShadow(
          color: Color(0x0D000000),
          blurRadius: 10,
          offset: Offset(0, 2),
        ),
      ],
    );
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
        duration: Duration(seconds: message.contains('Error') ? 3 : 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => LoginBloc()..add(CheckAuthStatus()),
      child: BlocListener<LoginBloc, LoginState>(
        listener: (context, state) {
          if (state.isAuthenticated && state.isSuccess) {
            _showSnackBar(
              isStudentSelected
                  ? 'Login successful! Welcome Student'
                  : 'Login successful! Welcome Parent',
              AppColors.success,
            );

            // Navigate to Student Details Screen
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (_) => const StudentDetailsScreen(),
              ),
            );
          }

          if (state.errorMessage != null) {
            _showSnackBar(
              state.errorMessage ?? 'An error occurred',
              AppColors.error,
            );
          }
        },
        child: Scaffold(
          backgroundColor: AppColors.background,
          body: Center(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              padding: EdgeInsets.symmetric(horizontal: 4.w),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo Container
                  Container(
                    height: 10.h,
                    width: 40.w,
                    margin: EdgeInsets.only(bottom: 3.h),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(2.h),
                      border: const Border.fromBorderSide(
                        BorderSide(
                          color: AppColors.border,
                          width: 1,
                        ),
                      ),
                    ),
                    child: Center(
                      child: Text(
                        'logo',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 20.sp,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),

                  // Main Card Container
                  Container(
                    width: 90.w,
                    padding: EdgeInsets.all(2.5.h),
                    decoration: cardDecoration,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Tab Buttons (Students / Parent)
                        Row(
                          children: [
                            Expanded(
                              child: _TabButton(
                                label: 'Students',
                                isSelected: isStudentSelected,
                                onTap: () {
                                  if (!isStudentSelected) {
                                    setState(() {
                                      isStudentSelected = true;
                                    });
                                  }
                                },
                                borderRadius: tabBorderRadiusLeft,
                              ),
                            ),
                            Expanded(
                              child: _TabButton(
                                label: 'Parent',
                                isSelected: !isStudentSelected,
                                onTap: () {
                                  if (isStudentSelected) {
                                    setState(() {
                                      isStudentSelected = false;
                                    });
                                  }
                                },
                                borderRadius: tabBorderRadiusRight,
                              ),
                            ),
                          ],
                        ),

                        SizedBox(height: 3.5.h),

                        // Log In Title
                        Text(
                          'Log In',
                          style: TextStyle(
                            fontSize: 18.sp,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),

                        SizedBox(height: 2.5.h),

                        // Email Field
                        BlocBuilder<LoginBloc, LoginState>(
                          buildWhen: (previous, current) =>
                          previous.isLoading != current.isLoading,
                          builder: (context, state) {
                            return TextField(
                              enabled: !state.isLoading,
                              onChanged: (value) {
                                context.read<LoginBloc>().add(EmailChanged(value));
                              },
                              keyboardType: TextInputType.emailAddress,
                              style: TextStyle(
                                fontSize: 14.sp,
                                color: AppColors.textPrimary,
                              ),
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
                                  ),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: inputBorderRadius,
                                  borderSide: const BorderSide(
                                    color: AppColors.border,
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: inputBorderRadius,
                                  borderSide: const BorderSide(
                                    color: AppColors.primary,
                                    width: 1.5,
                                  ),
                                ),
                              ),
                            );
                          },
                        ),

                        SizedBox(height: 2.h),

                        // Password Field
                        BlocBuilder<LoginBloc, LoginState>(
                          buildWhen: (previous, current) =>
                          previous.isLoading != current.isLoading ||
                              previous.isPasswordVisible != current.isPasswordVisible,
                          builder: (context, state) {
                            return TextField(
                              enabled: !state.isLoading,
                              obscureText: !state.isPasswordVisible,
                              onChanged: (value) {
                                context.read<LoginBloc>().add(PasswordChanged(value));
                              },
                              style: TextStyle(
                                fontSize: 14.sp,
                                color: AppColors.textPrimary,
                              ),
                              decoration: InputDecoration(
                                hintText: 'Enter Password',
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
                                  ),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: inputBorderRadius,
                                  borderSide: const BorderSide(
                                    color: AppColors.border,
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: inputBorderRadius,
                                  borderSide: const BorderSide(
                                    color: AppColors.primary,
                                    width: 1.5,
                                  ),
                                ),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    state.isPasswordVisible
                                        ? Icons.visibility_outlined
                                        : Icons.visibility_off_outlined,
                                    color: AppColors.primary,
                                    size: 22.sp,
                                  ),
                                  onPressed: () {
                                    context
                                        .read<LoginBloc>()
                                        .add(TogglePasswordVisibility());
                                  },
                                ),
                              ),
                            );
                          },
                        ),

                        SizedBox(height: 3.h),

                        // Login Button
                        BlocBuilder<LoginBloc, LoginState>(
                          buildWhen: (previous, current) =>
                          previous.isLoading != current.isLoading,
                          builder: (context, state) {
                            return SizedBox(
                              width: double.infinity,
                              height: 6.5.h,
                              child: ElevatedButton(
                                onPressed: state.isLoading
                                    ? null
                                    : () {
                                  context.read<LoginBloc>().add(LoginSubmitted());
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  elevation: 0,
                                  disabledBackgroundColor: AppColors.disabled,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: buttonBorderRadius,
                                  ),
                                ),
                                child: state.isLoading
                                    ? SizedBox(
                                  height: 2.5.h,
                                  width: 2.5.h,
                                  child: const CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                                    : Text(
                                  'Log In',
                                  style: TextStyle(
                                    fontSize: 16.sp,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            );
                          },
                        ),

                        SizedBox(height: 1.h),

                        // Forgot Password
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const ForgotPasswordScreen(),
                                ),
                              );
                            },
                            style: TextButton.styleFrom(
                              foregroundColor: AppColors.primary,
                              padding: EdgeInsets.symmetric(
                                horizontal: 2.w,
                                vertical: 0.5.h,
                              ),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            child: Text(
                              'forgot password',
                              style: TextStyle(
                                color: AppColors.primary,
                                fontSize: 15.sp,
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 18.h),

                  // Footer
                  Column(
                    children: [
                      Text(
                        'version : v1.0',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 14.sp,
                        ),
                      ),
                      SizedBox(height: 1.h),
                      Text(
                        'Get help',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: 14.sp,
                        ),
                      ),

                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// Extracted Tab Button Widget for better performance
class _TabButton extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;
  final BorderRadius borderRadius;

  const _TabButton({
    required this.label,
    required this.isSelected,
    required this.onTap,
    required this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 1.8.h),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.transparent,
          borderRadius: borderRadius,
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: 1,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : AppColors.textSecondary,
              fontSize: 15.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}