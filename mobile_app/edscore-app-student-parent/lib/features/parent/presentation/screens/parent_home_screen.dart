// lib/features/parent/presentation/pages/parent_home_screen.dart

import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../../../core/theme/app_colours.dart';
import '../../../student/presentation/screens/login_screen.dart';
import 'student_profile_screen.dart';

class ParentHomeScreen extends StatefulWidget {
  const ParentHomeScreen({Key? key}) : super(key: key);

  @override
  State<ParentHomeScreen> createState() => _ParentHomeScreenState();
}

class _ParentHomeScreenState extends State<ParentHomeScreen> {
  final String parentName = "Ajay";

  final List<Map<String, String>> students = [
    {
      "id": "1",
      "name": "Student 1",
      "grade": "Grade 10-A",
      "status": "Enrolled",
    },
    {
      "id": "2",
      "name": "Student 2",
      "grade": "Grade 10-A",
      "status": "Enrolled",
    },
    {
      "id": "3",
      "name": "Student 3",
      "grade": "Grade 10-A",
      "status": "Enrolled",
    },
  ];

  Future<void> _handleLogout(BuildContext context) async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Logout',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        content: Text(
          'Are you sure you want to logout?',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 14.sp,
            color: AppColors.textSecondary,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text(
              'Cancel',
              style: TextStyle(
                fontFamily: 'Poppins',
                color: AppColors.textSecondary,
                fontSize: 14.sp,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(2.w),
              ),
            ),
            child: Text(
              'Logout',
              style: TextStyle(
                fontFamily: 'Poppins',
                color: Colors.white,
                fontSize: 14.sp,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );

    if (shouldLogout == true && context.mounted) {
      const storage = FlutterSecureStorage(
        aOptions: AndroidOptions(encryptedSharedPreferences: true),
      );
      await storage.deleteAll();

      if (context.mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
              (route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),

      body: Column(
        children: [
          /// ============ HEADER SECTION ============
          Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              color: AppColors.primary,
            ),
            child: SafeArea(
              bottom: false,
              child: Column(
                children: [
                  /// Top Navigation Bar
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.5.h),
                    child: Row(
                      children: [
                        Icon(
                          Icons.home_outlined,
                          color: Colors.white,
                          size: 24.sp,
                        ),
                        SizedBox(width: 2.5.w),
                        Text(
                          "Home",
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            color: Colors.white,
                            fontSize: 24.sp,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Spacer(),
                        GestureDetector(
                          onTap: () => _handleLogout(context),
                          child: Icon(
                            Icons.exit_to_app_rounded,
                            color: Colors.white,
                            size: 24.sp,
                          ),
                        ),
                      ],
                    ),
                  ),

                  /// Welcome Section
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.fromLTRB(4.w, 1.h, 4.w, 3.h),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Welcome back, $parentName!",
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            color: Colors.white,
                            fontSize: 16.sp,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        SizedBox(height: 0.5.h),
                        Text(
                          "Here's your child's admission status",
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 14.sp,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          /// ============ STUDENT CARDS ============
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.fromLTRB(5.w, 0.h, 5.w, 2.h),
              itemCount: students.length,
              itemBuilder: (context, index) {
                final student = students[index];
                return _buildStudentCard(
                  context,
                  student["id"]!,
                  student["name"]!,
                  student["grade"]!,
                  student["status"]!,
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  /// ============ STUDENT CARD ============
  Widget _buildStudentCard(
      BuildContext context,
      String id,
      String name,
      String grade,
      String status,
      ) {
    Color statusBgColor;
    Color statusTextColor;

    switch (status.toLowerCase()) {
      case 'enrolled':
        statusBgColor = const Color(0xFFCEFFD1);
        statusTextColor = const Color(0xFF22C55E);
        break;
      case 'pending':
        statusBgColor = const Color(0xFFFEF3C7);
        statusTextColor = const Color(0xFFD97706);
        break;
      case 'rejected':
        statusBgColor = const Color(0xFFFEE2E2);
        statusTextColor = const Color(0xFFDC2626);
        break;
      default:
        statusBgColor = const Color(0xFFE5E7EB);
        statusTextColor = const Color(0xFF6B7280);
    }

    return Container(
      margin: EdgeInsets.only(bottom: 2.5.h),
      padding: EdgeInsets.all(4.5.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(4.w),
        border: Border.all(
          color: const Color(0xFFE5E7EB).withOpacity(0.5),
          width: 0.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            spreadRadius: 0,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// Avatar and Student Name Row
          Row(
            children: [
              /// Avatar Circle
              Padding(
                padding: const EdgeInsets.only(left: 13),
                child: CircleAvatar(
                  radius: 8.w,
                  backgroundColor: AppColors.primary,
                  child: Text(
                    'T',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      color: Colors.white,
                      fontSize: 22.sp,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 3.5.w),

              /// Student Name and Grade
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(left: 10),
                      child: Text(
                        name,
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 16.sp,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF202020),
                          letterSpacing: 0,
                        ),
                      ),
                    ),
                    SizedBox(height: 0.2.h),
                    Padding(
                      padding: const EdgeInsets.only(left: 10),
                      child: Text(
                        grade,
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 16.sp,
                          color: const Color(0xFF595959),
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          SizedBox(height: 2.h),

          /// Enrolled Badge - LEFT ALIGNED with proper sizing
          Align(
            alignment: Alignment.center,
            child: Container(
              height: 21.sp,
              width: 42.sp,
              padding: EdgeInsets.symmetric(
                horizontal: 3.5.w,
                vertical: 0,
              ),
              decoration: BoxDecoration(
                color: statusBgColor,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Center(
                child: Text(
                  status,
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    color: statusTextColor,
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w500,
                    height: 1.0,
                  ),
                ),
              ),
            ),
          ),

          SizedBox(height: 2.2.h),

          /// Divider Line
          Divider(
            color: const Color(0xFFE5E7EB),
            thickness: 2,
            height: 1,

          ),

          SizedBox(height: 2.2.h),

          /// View Profile Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => StudentProfileScreen(
                      studentId: id,
                      studentName: name,
                    ),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: EdgeInsets.symmetric(vertical: 1.7.h),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4.w),
                ),
              ),
              child: Text(
                "View Students Profile",
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 15.sp,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  letterSpacing: 0.2,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}