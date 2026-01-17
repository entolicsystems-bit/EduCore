import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sizer/sizer.dart';
import '../../bloc/auth/login/login_bloc.dart';
import '../../bloc/auth/login/login_event.dart';
import '../../bloc/auth/login/login_state.dart';
import '../../../../core/theme/app_colours.dart';
import 'forgot_password_screen.dart';
import 'student_details_screen.dart';
import '../../../parent/presentation/screens/parent_home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool isStudentSelected = true;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  double? _screenHeight;
  double? _screenWidth;
  BoxDecoration? _cardDecoration;
  BorderRadius? _inputBorderRadius;
  BorderRadius? _tabBorderRadiusLeft;
  BorderRadius? _tabBorderRadiusRight;
  BorderRadius? _buttonBorderRadius;

  double get screenHeight => _screenHeight ?? MediaQuery.of(context).size.height;
  double get screenWidth => _screenWidth ?? MediaQuery.of(context).size.width;
  BoxDecoration get cardDecoration => _cardDecoration!;
  BorderRadius get inputBorderRadius => _inputBorderRadius!;
  BorderRadius get tabBorderRadiusLeft => _tabBorderRadiusLeft!;
  BorderRadius get tabBorderRadiusRight => _tabBorderRadiusRight!;
  BorderRadius get buttonBorderRadius => _buttonBorderRadius!;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    // Only initialize once
    if (_screenHeight == null) {
      final size = MediaQuery.of(context).size;
      _screenHeight = size.height;
      _screenWidth = size.width;

      _inputBorderRadius = BorderRadius.circular(1.5.h);
      _tabBorderRadiusLeft = BorderRadius.only(
        topLeft: Radius.circular(1.5.h),
        bottomLeft: Radius.circular(1.5.h),
      );
      _tabBorderRadiusRight = BorderRadius.only(
        topRight: Radius.circular(1.5.h),
        bottomRight: Radius.circular(1.5.h),
      );
      _buttonBorderRadius = BorderRadius.circular(1.5.h);
      _cardDecoration = BoxDecoration(
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
  }

  bool get isTablet => screenWidth > 600;
  bool get isDesktop => screenWidth > 1024;

  double get maxCardWidth {
    if (isDesktop) return 500;
    if (isTablet) return 600;
    return 90.w;
  }

  double get logoWidth {
    if (isDesktop) return 200;
    if (isTablet) return 250;
    return 40.w;
  }

  double get logoHeight {
    if (isDesktop) return 80;
    if (isTablet) return 90;
    return 10.h;
  }

  void _showSnackBar(String message, Color backgroundColor) {
    if (!mounted) return;
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
        duration: const Duration(seconds: 2),
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
            final expectedRole = isStudentSelected ? 'STUDENT' : 'PARENT';
            final actualRole = state.userRole?.toUpperCase();

            if (actualRole != null && actualRole != expectedRole) {
              final roleText = actualRole == 'STUDENT' ? 'a Student' : 'a Parent';
              _showSnackBar(
                'You are logged in as $roleText. Please select the correct tab and try again.',
                AppColors.error,
              );

              Future.delayed(const Duration(seconds: 2), () {
                if (mounted) {
                  context.read<LoginBloc>().add(LogoutRequested());
                }
              });
              return;
            }

            if (state.isStudent) {
              _showSnackBar(
                'Login successful! Welcome Student',
                AppColors.success,
              );

              Future.delayed(const Duration(milliseconds: 500), () {
                if (mounted) {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                      builder: (_) => const StudentDetailsScreen(),
                    ),
                  );
                }
              });
            } else if (state.isParent) {
              _showSnackBar(
                'Login successful! Welcome Parent',
                AppColors.success,
              );

              Future.delayed(const Duration(milliseconds: 500), () {
                if (mounted) {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                      builder: (_) => const ParentHomeScreen(),
                    ),
                  );
                }
              });
            }
          }

          if (state.errorMessage != null) {
            _showSnackBar(
              state.errorMessage!,
              AppColors.error,
            );
          }
        },
        child: Scaffold(
          backgroundColor: AppColors.background,
          body: Center(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              padding: EdgeInsets.symmetric(
                horizontal: isDesktop ? 8.w : 4.w,
                vertical: 2.h,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo Container
                  Container(
                    height: logoHeight,
                    width: logoWidth,
                    margin: EdgeInsets.only(bottom: isDesktop ? 4.h : 3.h),
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
                          fontSize: isDesktop ? 16.sp : 20.sp,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),

                  // Login Card
                  Container(
                    width: maxCardWidth,
                    constraints: BoxConstraints(
                      maxWidth: maxCardWidth,
                    ),
                    padding: EdgeInsets.all(isDesktop ? 4.h : 2.5.h),
                    decoration: cardDecoration,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Tab Buttons
                        Row(
                          children: [
                            Expanded(
                              child: _TabButton(
                                label: 'Students',
                                isSelected: isStudentSelected,
                                onTap: () {
                                  if (!isStudentSelected) {
                                    setState(() => isStudentSelected = true);
                                  }
                                },
                                borderRadius: tabBorderRadiusLeft,
                                isDesktop: isDesktop,
                              ),
                            ),
                            Expanded(
                              child: _TabButton(
                                label: 'Parent',
                                isSelected: !isStudentSelected,
                                onTap: () {
                                  if (isStudentSelected) {
                                    setState(() => isStudentSelected = false);
                                  }
                                },
                                borderRadius: tabBorderRadiusRight,
                                isDesktop: isDesktop,
                              ),
                            ),
                          ],
                        ),

                        SizedBox(height: isDesktop ? 4.h : 3.5.h),

                        // Title
                        Text(
                          'Log In',
                          style: TextStyle(
                            fontSize: isDesktop ? 14.sp : 18.sp,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),

                        SizedBox(height: isDesktop ? 3.h : 2.5.h),

                        // Email Field
                        BlocBuilder<LoginBloc, LoginState>(
                          buildWhen: (previous, current) =>
                          previous.isLoading != current.isLoading,
                          builder: (context, state) {
                            return TextField(
                              controller: _emailController,
                              enabled: !state.isLoading,
                              onChanged: (value) {
                                context.read<LoginBloc>().add(EmailChanged(value));
                              },
                              keyboardType: TextInputType.emailAddress,
                              style: TextStyle(
                                fontSize: isDesktop ? 11.sp : 14.sp,
                                color: AppColors.textPrimary,
                              ),
                              decoration: InputDecoration(
                                hintText: 'Enter your email',
                                hintStyle: TextStyle(
                                  color: AppColors.textHint,
                                  fontSize: isDesktop ? 11.sp : 15.sp,
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

                        SizedBox(height: isDesktop ? 2.5.h : 2.h),

                        // Password Field
                        BlocBuilder<LoginBloc, LoginState>(
                          buildWhen: (previous, current) =>
                          previous.isLoading != current.isLoading ||
                              previous.isPasswordVisible !=
                                  current.isPasswordVisible,
                          builder: (context, state) {
                            return TextField(
                              controller: _passwordController,
                              enabled: !state.isLoading,
                              obscureText: !state.isPasswordVisible,
                              onChanged: (value) {
                                context
                                    .read<LoginBloc>()
                                    .add(PasswordChanged(value));
                              },
                              style: TextStyle(
                                fontSize: isDesktop ? 11.sp : 14.sp,
                                color: AppColors.textPrimary,
                              ),
                              decoration: InputDecoration(
                                hintText: 'Enter Password',
                                hintStyle: TextStyle(
                                  color: AppColors.textHint,
                                  fontSize: isDesktop ? 11.sp : 15.sp,
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
                                    size: isDesktop ? 18.sp : 22.sp,
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

                        SizedBox(height: isDesktop ? 3.5.h : 3.h),

                        // Login Button
                        BlocBuilder<LoginBloc, LoginState>(
                          buildWhen: (previous, current) =>
                          previous.isLoading != current.isLoading,
                          builder: (context, state) {
                            return SizedBox(
                              width: double.infinity,
                              height: isDesktop ? 50 : 6.5.h,
                              child: ElevatedButton(
                                onPressed: state.isLoading
                                    ? null
                                    : () {
                                  context
                                      .read<LoginBloc>()
                                      .add(LoginSubmitted());
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
                                  height: isDesktop ? 20 : 2.5.h,
                                  width: isDesktop ? 20 : 2.5.h,
                                  child: const CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                                    : Text(
                                  'Log In',
                                  style: TextStyle(
                                    fontSize: isDesktop ? 12.sp : 16.sp,
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
                                  builder: (context) =>
                                  const ForgotPasswordScreen(),
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
                                fontSize: isDesktop ? 11.sp : 15.sp,
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: isDesktop ? 8.h : 18.h),

                  // Footer
                  Column(
                    children: [
                      Text(
                        'version : v1.0',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: isDesktop ? 10.sp : 14.sp,
                        ),
                      ),
                      SizedBox(height: 1.h),
                      Text(
                        'Get help',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: isDesktop ? 10.sp : 14.sp,
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

class _TabButton extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;
  final BorderRadius borderRadius;
  final bool isDesktop;

  const _TabButton({
    required this.label,
    required this.isSelected,
    required this.onTap,
    required this.borderRadius,
    required this.isDesktop,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(
          vertical: isDesktop ? 14 : 1.8.h,
        ),
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
              fontSize: isDesktop ? 11.sp : 15.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}