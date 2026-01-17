// lib/features/parent/presentation/pages/student_profile_screen.dart

import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';
import '../../../../core/theme/app_colours.dart';
import 'documents_screen.dart';

class StudentProfileScreen extends StatefulWidget {
  final String studentId;
  final String studentName;

  const StudentProfileScreen({
    Key? key,
    required this.studentId,
    required this.studentName,
  }) : super(key: key);

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen> {
  // Dummy data
  final String grade = "Grade 10-A";
  final String status = "Enrolled";

  // Track expanded state for each section - ALL CLOSED BY DEFAULT
  bool _isPersonalInfoExpanded = false;
  bool _isGuardianInfoExpanded = false; // Changed from true to false
  bool _isAcademicSummaryExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          /// Header Section with Student Info
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.primary,
            ),
            child: SafeArea(
              bottom: false,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// Back Button Row
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.5.h),
                    child: GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Icon(
                        Icons.arrow_back,
                        color: Colors.white,
                        size: 24.sp,
                      ),
                    ),
                  ),

                  /// Student Profile Info
                  Padding(
                    padding: EdgeInsets.fromLTRB(4.w, 0, 4.w, 3.h),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            /// Avatar
                            Padding(
                              padding: const EdgeInsets.only(left: 35),
                              child: CircleAvatar(
                                radius: 9.w,
                                backgroundColor: Colors.white,
                                child: Text(
                                  widget.studentName.isNotEmpty
                                      ? widget.studentName[0].toUpperCase()
                                      : 'S',
                                  style: TextStyle(
                                    fontFamily: 'Poppins',
                                    color: AppColors.primary,
                                    fontSize: 26.sp,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                            SizedBox(width: 3.w),

                            /// Name and Grade Column
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  /// Student Name
                                  Text(
                                    widget.studentName,
                                    style: TextStyle(
                                      fontFamily: 'Poppins',
                                      color: Colors.white,
                                      fontSize: 24.sp,
                                      fontWeight: FontWeight.w600,
                                      letterSpacing: 0.0,
                                    ),
                                  ),
                                  SizedBox(height: 0.3.h),

                                  /// Grade
                                  Text(
                                    grade,
                                    style: TextStyle(
                                      fontFamily: 'Poppins',
                                      color: Colors.white.withOpacity(0.95),
                                      fontSize: 16.sp,
                                      fontWeight: FontWeight.w400,
                                      letterSpacing: 0.0,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 1.5.h),

                        /// Status Badge - Left Aligned
                        Padding(
                          padding: const EdgeInsets.only(left: 115),
                          child: Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: 7.w,
                              vertical: 0.5.h,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20.w),
                            ),
                            child: Text(
                              status,
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                color: AppColors.success,
                                fontSize: 14.sp,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          /// Content Section
          Expanded(
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
                child: Column(
                  children: [
                    /// Personal Information Section
                    _buildExpandableSection(
                      title: "Personal Information",
                      isExpanded: _isPersonalInfoExpanded,
                      onTap: () {
                        setState(() {
                          _isPersonalInfoExpanded = !_isPersonalInfoExpanded;
                        });
                      },
                      child: _buildPersonalInfo(),
                    ),
                    SizedBox(height: 1.5.h),

                    /// Guardian Information Section
                    _buildExpandableSection(
                      title: "Guardian Information",
                      isExpanded: _isGuardianInfoExpanded,
                      onTap: () {
                        setState(() {
                          _isGuardianInfoExpanded = !_isGuardianInfoExpanded;
                        });
                      },
                      child: _buildGuardianInfo(),
                    ),
                    SizedBox(height: 1.5.h),

                    /// Academic Summary Section
                    _buildExpandableSection(
                      title: "Academic Summary",
                      isExpanded: _isAcademicSummaryExpanded,
                      onTap: () {
                        setState(() {
                          _isAcademicSummaryExpanded = !_isAcademicSummaryExpanded;
                        });
                      },
                      child: _buildAcademicSummary(),
                    ),
                    SizedBox(height: 2.h),

                    /// Action Buttons
                    Row(
                      children: [
                        /// Documents Button
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              // Navigate to documents screen
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => DocumentsScreen(
                                    studentId: widget.studentId,
                                  ),
                                ),
                              );
                            },
                            icon: Icon(
                              Icons.description_outlined,
                              color: Colors.white,
                              size: 20.sp,
                            ),
                            label: Text(
                              "Documents",
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                color: Colors.white,
                                fontSize: 16.sp,
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              padding: EdgeInsets.symmetric(vertical: 1.5.h),
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10.sp),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(width: 3.w),

                        /// Offer Letter Button
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                            },
                            icon: Icon(
                              Icons.card_membership_outlined,
                              color: Colors.white,
                              size: 20.sp,
                            ),
                            label: Text(
                              "Offer Letter",
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                color: Colors.white,
                                fontSize: 16.sp,
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              padding: EdgeInsets.symmetric(vertical: 1.5.h),
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10.sp),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Expandable Section Widget
  Widget _buildExpandableSection({
    required String title,
    required bool isExpanded,
    required VoidCallback onTap,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(2.w),
        border: Border.all(
          color: AppColors.border.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(15.sp),
              bottom: isExpanded ? Radius.zero : Radius.circular(2.w),
            ),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 15.sp,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textDark,
                      letterSpacing: 0.1,
                    ),
                  ),
                  Icon(
                    isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                    color: AppColors.textGrey,
                    size: 20.sp,
                  ),
                ],
              ),
            ),
          ),
          if (isExpanded)
            Container(
              width: double.infinity,
              padding: EdgeInsets.fromLTRB(4.w, 0, 4.w, 2.h),
              child: child,
            ),
        ],
      ),
    );
  }

  /// Personal Information Content
  Widget _buildPersonalInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildInfoItem("Full Name", widget.studentName),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Date of Birth", "01/01/2010"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Gender", "Male"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Blood Group", "O+"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Address", "123 Main Street, City"),
      ],
    );
  }

  /// Guardian Information Content
  Widget _buildGuardianInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Father's Details Section
        Text(
          "Father's Details",
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 15.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
            letterSpacing: 0.1,
          ),
        ),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Name", "Rajesh Kumar"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Phone", "+91 98765 43210"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Email", "rajesh.kumar@email.com"),

        SizedBox(height: 2.h),

        // Mother's Details Section
        Text(
          "Mother's Details",
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 15.sp,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
            letterSpacing: 0.1,
          ),
        ),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Name", "Priya Kumar"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Phone", "+91 98765 43211"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Email", "priya.kumar@email.com"),
      ],
    );
  }

  /// Academic Summary Content
  Widget _buildAcademicSummary() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildInfoItem("Current Grade", grade),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Section", "A"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Roll Number", "101"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Admission Date", "15/04/2024"),
        SizedBox(height: 1.5.h),
        _buildInfoItem("Status", status),
      ],
    );
  }

  /// Info Item Widget - Title on top, value below
  Widget _buildInfoItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 13.sp,
            fontWeight: FontWeight.w500,
            color: AppColors.textGrey,
            letterSpacing: 0.1,
          ),
        ),
        SizedBox(height: 0.3.h),
        Text(
          value,
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 14.sp,
            fontWeight: FontWeight.w400,
            color: AppColors.textDark,
            letterSpacing: 0.1,
          ),
        ),
      ],
    );
  }
}