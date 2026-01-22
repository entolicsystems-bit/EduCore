// // lib/features/parent/presentation/pages/student_profile_screen.dart
//
// import 'package:flutter/material.dart';
// import 'package:sizer/sizer.dart';
// import '../../../../core/theme/app_colours.dart';
// import 'documents_screen.dart';
//
// class StudentProfileScreen extends StatefulWidget {
//   final String studentId;
//   final String studentName;
//
//   const StudentProfileScreen({
//     Key? key,
//     required this.studentId,
//     required this.studentName,
//   }) : super(key: key);
//
//   @override
//   State<StudentProfileScreen> createState() => _StudentProfileScreenState();
// }
//
// class _StudentProfileScreenState extends State<StudentProfileScreen> {
//   // Dummy data
//   final String grade = "Grade 10-A";
//   final String status = "Enrolled";
//
//   // Track expanded state for each section - ALL CLOSED BY DEFAULT
//   bool _isPersonalInfoExpanded = false;
//   bool _isGuardianInfoExpanded = false; // Changed from true to false
//   bool _isAcademicSummaryExpanded = false;
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       body: Column(
//         children: [
//           /// Header Section with Student Info
//           Container(
//             width: double.infinity,
//             decoration: BoxDecoration(
//               color: AppColors.primary,
//             ),
//             child: SafeArea(
//               bottom: false,
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   /// Back Button Row
//                   Padding(
//                     padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.5.h),
//                     child: GestureDetector(
//                       onTap: () => Navigator.pop(context),
//                       child: Icon(
//                         Icons.arrow_back,
//                         color: Colors.white,
//                         size: 24.sp,
//                       ),
//                     ),
//                   ),
//
//                   /// Student Profile Info
//                   Padding(
//                     padding: EdgeInsets.fromLTRB(4.w, 0, 4.w, 3.h),
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Row(
//                           crossAxisAlignment: CrossAxisAlignment.center,
//                           children: [
//                             /// Avatar
//                             Padding(
//                               padding: const EdgeInsets.only(left: 35),
//                               child: CircleAvatar(
//                                 radius: 9.w,
//                                 backgroundColor: Colors.white,
//                                 child: Text(
//                                   widget.studentName.isNotEmpty
//                                       ? widget.studentName[0].toUpperCase()
//                                       : 'S',
//                                   style: TextStyle(
//                                     fontFamily: 'Poppins',
//                                     color: AppColors.primary,
//                                     fontSize: 26.sp,
//                                     fontWeight: FontWeight.w600,
//                                   ),
//                                 ),
//                               ),
//                             ),
//                             SizedBox(width: 3.w),
//
//                             /// Name and Grade Column
//                             Expanded(
//                               child: Column(
//                                 crossAxisAlignment: CrossAxisAlignment.start,
//                                 children: [
//                                   /// Student Name
//                                   Text(
//                                     widget.studentName,
//                                     style: TextStyle(
//                                       fontFamily: 'Poppins',
//                                       color: Colors.white,
//                                       fontSize: 24.sp,
//                                       fontWeight: FontWeight.w600,
//                                       letterSpacing: 0.0,
//                                     ),
//                                   ),
//                                   SizedBox(height: 0.3.h),
//
//                                   /// Grade
//                                   Text(
//                                     grade,
//                                     style: TextStyle(
//                                       fontFamily: 'Poppins',
//                                       color: Colors.white.withOpacity(0.95),
//                                       fontSize: 16.sp,
//                                       fontWeight: FontWeight.w400,
//                                       letterSpacing: 0.0,
//                                     ),
//                                   ),
//                                 ],
//                               ),
//                             ),
//                           ],
//                         ),
//                         SizedBox(height: 1.5.h),
//
//                         /// Status Badge - Left Aligned
//                         Padding(
//                           padding: const EdgeInsets.only(left: 115),
//                           child: Container(
//                             padding: EdgeInsets.symmetric(
//                               horizontal: 7.w,
//                               vertical: 0.5.h,
//                             ),
//                             decoration: BoxDecoration(
//                               color: Colors.white,
//                               borderRadius: BorderRadius.circular(20.w),
//                             ),
//                             child: Text(
//                               status,
//                               style: TextStyle(
//                                 fontFamily: 'Poppins',
//                                 color: AppColors.success,
//                                 fontSize: 14.sp,
//                                 fontWeight: FontWeight.w600,
//                               ),
//                             ),
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//
//           /// Content Section
//           Expanded(
//             child: SingleChildScrollView(
//               physics: const AlwaysScrollableScrollPhysics(),
//               child: Padding(
//                 padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
//                 child: Column(
//                   children: [
//                     /// Personal Information Section
//                     _buildExpandableSection(
//                       title: "Personal Information",
//                       isExpanded: _isPersonalInfoExpanded,
//                       onTap: () {
//                         setState(() {
//                           _isPersonalInfoExpanded = !_isPersonalInfoExpanded;
//                         });
//                       },
//                       child: _buildPersonalInfo(),
//                     ),
//                     SizedBox(height: 1.5.h),
//
//                     /// Guardian Information Section
//                     _buildExpandableSection(
//                       title: "Guardian Information",
//                       isExpanded: _isGuardianInfoExpanded,
//                       onTap: () {
//                         setState(() {
//                           _isGuardianInfoExpanded = !_isGuardianInfoExpanded;
//                         });
//                       },
//                       child: _buildGuardianInfo(),
//                     ),
//                     SizedBox(height: 1.5.h),
//
//                     /// Academic Summary Section
//                     _buildExpandableSection(
//                       title: "Academic Summary",
//                       isExpanded: _isAcademicSummaryExpanded,
//                       onTap: () {
//                         setState(() {
//                           _isAcademicSummaryExpanded = !_isAcademicSummaryExpanded;
//                         });
//                       },
//                       child: _buildAcademicSummary(),
//                     ),
//                     SizedBox(height: 2.h),
//
//                     /// Action Buttons
//                     Row(
//                       children: [
//                         /// Documents Button
//                         Expanded(
//                           child: ElevatedButton.icon(
//                             onPressed: () {
//                               // Navigate to documents screen
//                               Navigator.push(
//                                 context,
//                                 MaterialPageRoute(
//                                   builder: (_) => DocumentsScreen(
//                                     studentId: widget.studentId,
//                                   ),
//                                 ),
//                               );
//                             },
//                             icon: Icon(
//                               Icons.description_outlined,
//                               color: Colors.white,
//                               size: 20.sp,
//                             ),
//                             label: Text(
//                               "Documents",
//                               style: TextStyle(
//                                 fontFamily: 'Poppins',
//                                 color: Colors.white,
//                                 fontSize: 16.sp,
//                                 fontWeight: FontWeight.w400,
//                               ),
//                             ),
//                             style: ElevatedButton.styleFrom(
//                               backgroundColor: AppColors.primary,
//                               padding: EdgeInsets.symmetric(vertical: 1.5.h),
//                               elevation: 0,
//                               shape: RoundedRectangleBorder(
//                                 borderRadius: BorderRadius.circular(10.sp),
//                               ),
//                             ),
//                           ),
//                         ),
//                         SizedBox(width: 3.w),
//
//                         /// Offer Letter Button
//                         Expanded(
//                           child: ElevatedButton.icon(
//                             onPressed: () {
//                             },
//                             icon: Icon(
//                               Icons.card_membership_outlined,
//                               color: Colors.white,
//                               size: 20.sp,
//                             ),
//                             label: Text(
//                               "Offer Letter",
//                               style: TextStyle(
//                                 fontFamily: 'Poppins',
//                                 color: Colors.white,
//                                 fontSize: 16.sp,
//                                 fontWeight: FontWeight.w400,
//                               ),
//                             ),
//                             style: ElevatedButton.styleFrom(
//                               backgroundColor: AppColors.primary,
//                               padding: EdgeInsets.symmetric(vertical: 1.5.h),
//                               elevation: 0,
//                               shape: RoundedRectangleBorder(
//                                 borderRadius: BorderRadius.circular(10.sp),
//                               ),
//                             ),
//                           ),
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
//
//   /// Expandable Section Widget
//   Widget _buildExpandableSection({
//     required String title,
//     required bool isExpanded,
//     required VoidCallback onTap,
//     required Widget child,
//   }) {
//     return Container(
//       width: double.infinity,
//       decoration: BoxDecoration(
//         color: AppColors.cardBg,
//         borderRadius: BorderRadius.circular(2.w),
//         border: Border.all(
//           color: AppColors.border.withOpacity(0.3),
//           width: 1,
//         ),
//       ),
//       child: Column(
//         children: [
//           InkWell(
//             onTap: onTap,
//             borderRadius: BorderRadius.vertical(
//               top: Radius.circular(15.sp),
//               bottom: isExpanded ? Radius.zero : Radius.circular(2.w),
//             ),
//             child: Padding(
//               padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
//               child: Row(
//                 mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                 children: [
//                   Text(
//                     title,
//                     style: TextStyle(
//                       fontFamily: 'Poppins',
//                       fontSize: 15.sp,
//                       fontWeight: FontWeight.w600,
//                       color: AppColors.textDark,
//                       letterSpacing: 0.1,
//                     ),
//                   ),
//                   Icon(
//                     isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
//                     color: AppColors.textGrey,
//                     size: 20.sp,
//                   ),
//                 ],
//               ),
//             ),
//           ),
//           if (isExpanded)
//             Container(
//               width: double.infinity,
//               padding: EdgeInsets.fromLTRB(4.w, 0, 4.w, 2.h),
//               child: child,
//             ),
//         ],
//       ),
//     );
//   }
//
//   /// Personal Information Content
//   Widget _buildPersonalInfo() {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         _buildInfoItem("Full Name", widget.studentName),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Date of Birth", "01/01/2010"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Gender", "Male"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Blood Group", "O+"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Address", "123 Main Street, City"),
//       ],
//     );
//   }
//
//   /// Guardian Information Content
//   Widget _buildGuardianInfo() {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         // Father's Details Section
//         Text(
//           "Father's Details",
//           style: TextStyle(
//             fontFamily: 'Poppins',
//             fontSize: 15.sp,
//             fontWeight: FontWeight.w600,
//             color: AppColors.textDark,
//             letterSpacing: 0.1,
//           ),
//         ),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Name", "Rajesh Kumar"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Phone", "+91 98765 43210"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Email", "rajesh.kumar@email.com"),
//
//         SizedBox(height: 2.h),
//
//         // Mother's Details Section
//         Text(
//           "Mother's Details",
//           style: TextStyle(
//             fontFamily: 'Poppins',
//             fontSize: 15.sp,
//             fontWeight: FontWeight.w600,
//             color: AppColors.textDark,
//             letterSpacing: 0.1,
//           ),
//         ),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Name", "Priya Kumar"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Phone", "+91 98765 43211"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Email", "priya.kumar@email.com"),
//       ],
//     );
//   }
//
//   /// Academic Summary Content
//   Widget _buildAcademicSummary() {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         _buildInfoItem("Current Grade", grade),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Section", "A"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Roll Number", "101"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Admission Date", "15/04/2024"),
//         SizedBox(height: 1.5.h),
//         _buildInfoItem("Status", status),
//       ],
//     );
//   }
//
//   /// Info Item Widget - Title on top, value below
//   Widget _buildInfoItem(String label, String value) {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Text(
//           label,
//           style: TextStyle(
//             fontFamily: 'Poppins',
//             fontSize: 13.sp,
//             fontWeight: FontWeight.w500,
//             color: AppColors.textGrey,
//             letterSpacing: 0.1,
//           ),
//         ),
//         SizedBox(height: 0.3.h),
//         Text(
//           value,
//           style: TextStyle(
//             fontFamily: 'Poppins',
//             fontSize: 14.sp,
//             fontWeight: FontWeight.w400,
//             color: AppColors.textDark,
//             letterSpacing: 0.1,
//           ),
//         ),
//       ],
//     );
//   }
// }
// //student profile screen
// lib/features/parent/presentation/pages/student_profile_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:sizer/sizer.dart';

import '../../../../core/theme/app_colours.dart';
import '../../bloc/student_profile/student_profile_bloc.dart';
import '../../bloc/student_profile/student_profile_event.dart';
import '../../bloc/student_profile/student_profile_state.dart';
import '../../data/models/student_profile_model.dart';

class StudentProfileScreen extends StatefulWidget {
  final String studentId;
  final String token;
  final String? studentName; // Made optional

  const StudentProfileScreen({
    super.key,
    required this.studentId,
    required this.token,
    this.studentName, // Optional fallback name
  });

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen> {
  bool _isPersonalInfoExpanded = false;
  bool _isGuardianInfoExpanded = false;
  bool _isAcademicSummaryExpanded = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  void _loadProfile() {
    context.read<StudentProfileBloc>().add(
      FetchStudentProfile(
        studentId: widget.studentId,
        token: widget.token,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocListener<StudentProfileBloc, StudentProfileState>(
        listener: (context, state) {
          // Handle session expiry
          if (state.isSessionExpired) {
            _handleSessionExpiry();
          }
        },
        child: BlocBuilder<StudentProfileBloc, StudentProfileState>(
          builder: (context, state) {
            if (state.isLoading && state.profile == null) {
              return _buildLoadingSkeleton();
            }

            if (state.error != null && state.profile == null) {
              return _buildErrorState(state.error!);
            }

            if (state.profile == null) {
              return _buildNoDataState();
            }

            final StudentProfile profile = state.profile!;

            return RefreshIndicator(
              onRefresh: () async {
                _loadProfile();
                await Future.delayed(const Duration(milliseconds: 500));
              },
              child: Column(
                children: [
                  _buildHeader(profile),
                  Expanded(
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: EdgeInsets.all(4.w),
                      child: Column(
                        children: [
                          _buildExpandableSection(
                            title: "Personal Information",
                            isExpanded: _isPersonalInfoExpanded,
                            onTap: () => setState(
                                  () => _isPersonalInfoExpanded = !_isPersonalInfoExpanded,
                            ),
                            child: _buildPersonalInfo(profile),
                          ),
                          SizedBox(height: 1.5.h),
                          _buildExpandableSection(
                            title: "Guardian Information",
                            isExpanded: _isGuardianInfoExpanded,
                            onTap: () => setState(
                                  () => _isGuardianInfoExpanded = !_isGuardianInfoExpanded,
                            ),
                            child: _buildGuardianInfo(profile),
                          ),
                          SizedBox(height: 1.5.h),
                          _buildExpandableSection(
                            title: "Academic Summary",
                            isExpanded: _isAcademicSummaryExpanded,
                            onTap: () => setState(
                                  () => _isAcademicSummaryExpanded = !_isAcademicSummaryExpanded,
                            ),
                            child: _buildAcademicSummary(profile),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  /// ================= HEADER =================
  Widget _buildHeader(StudentProfile profile) {
    return Container(
      width: double.infinity,
      color: AppColors.primary,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: EdgeInsets.fromLTRB(4.w, 1.5.h, 4.w, 3.h),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                  size: 24.sp,
                ),
              ),
              SizedBox(height: 2.h),
              Row(
                children: [
                  CircleAvatar(
                    radius: 9.w,
                    backgroundColor: Colors.white,
                    child: Text(
                      profile.fullName.isNotEmpty
                          ? profile.fullName[0].toUpperCase()
                          : "S",
                      style: TextStyle(
                        color: AppColors.primary,
                        fontSize: 26.sp,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  SizedBox(width: 4.w),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          profile.fullName,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22.sp,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 0.5.h),
                        Text(
                          profile.grade,
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 16.sp,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 1.5.h),
              Container(
                padding: EdgeInsets.symmetric(
                  horizontal: 6.w,
                  vertical: 0.6.h,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20.w),
                ),
                child: Text(
                  profile.status,
                  style: TextStyle(
                    color: _getStatusColor(profile.status),
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
      case 'enrolled':
        return AppColors.success;
      case 'pending':
        return Colors.orange;
      case 'inactive':
        return Colors.red;
      default:
        return AppColors.textGrey;
    }
  }

  /// ================= LOADING SKELETON =================
  Widget _buildLoadingSkeleton() {
    return Column(
      children: [
        Container(
          width: double.infinity,
          color: AppColors.primary,
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: EdgeInsets.fromLTRB(4.w, 1.5.h, 4.w, 3.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.arrow_back, color: Colors.white, size: 24.sp),
                  SizedBox(height: 2.h),
                  Row(
                    children: [
                      Container(
                        width: 18.w,
                        height: 18.w,
                        decoration: const BoxDecoration(
                          color: Colors.white24,
                          shape: BoxShape.circle,
                        ),
                      ),
                      SizedBox(width: 4.w),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 40.w,
                            height: 2.h,
                            color: Colors.white24,
                          ),
                          SizedBox(height: 0.5.h),
                          Container(
                            width: 20.w,
                            height: 1.5.h,
                            color: Colors.white24,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
        Expanded(
          child: Padding(
            padding: EdgeInsets.all(4.w),
            child: Column(
              children: List.generate(
                3,
                    (index) => Padding(
                  padding: EdgeInsets.only(bottom: 1.5.h),
                  child: Container(
                    height: 8.h,
                    decoration: BoxDecoration(
                      color: AppColors.cardBg,
                      borderRadius: BorderRadius.circular(2.w),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  /// ================= ERROR STATE =================
  Widget _buildErrorState(String error) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(4.w),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 60.sp,
              color: Colors.red.shade300,
            ),
            SizedBox(height: 2.h),
            Text(
              _getUserFriendlyError(error),
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16.sp,
                color: AppColors.textDark,
              ),
            ),
            SizedBox(height: 3.h),
            ElevatedButton.icon(
              onPressed: _loadProfile,
              icon: const Icon(Icons.refresh),
              label: const Text("Retry"),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 1.5.h),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// ================= NO DATA STATE =================
  Widget _buildNoDataState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.person_off_outlined,
            size: 60.sp,
            color: AppColors.textGrey,
          ),
          SizedBox(height: 2.h),
          Text(
            "No profile data found",
            style: TextStyle(
              fontSize: 16.sp,
              color: AppColors.textDark,
            ),
          ),
        ],
      ),
    );
  }

  /// ================= EXPANDABLE SECTION =================
  Widget _buildExpandableSection({
    required String title,
    required bool isExpanded,
    required VoidCallback onTap,
    required Widget child,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(2.w),
        border: Border.all(color: AppColors.border.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.vertical(top: Radius.circular(2.w)),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 15.sp,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Icon(
                    isExpanded
                        ? Icons.keyboard_arrow_up
                        : Icons.keyboard_arrow_down,
                  ),
                ],
              ),
            ),
          ),
          if (isExpanded)
            Padding(
              padding: EdgeInsets.fromLTRB(4.w, 0, 4.w, 2.h),
              child: child,
            ),
        ],
      ),
    );
  }

  /// ================= SECTIONS =================
  Widget _buildPersonalInfo(StudentProfile profile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildInfoItem("Full Name", profile.fullName),
        _buildInfoItem("Date of Birth", profile.dob),
        _buildInfoItem("Gender", profile.gender),
        _buildInfoItem("Blood Group", profile.bloodGroup),
        _buildInfoItem("Address", profile.address),
      ],
    );
  }

  Widget _buildGuardianInfo(StudentProfile profile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Father's Details",
          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14.sp),
        ),
        SizedBox(height: 1.h),
        _buildInfoItem("Name", profile.father.name),
        _buildInfoItem("Phone", profile.father.phone),
        _buildInfoItem("Email", profile.father.email),
        SizedBox(height: 2.h),
        Text(
          "Mother's Details",
          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14.sp),
        ),
        SizedBox(height: 1.h),
        _buildInfoItem("Name", profile.mother.name),
        _buildInfoItem("Phone", profile.mother.phone),
        _buildInfoItem("Email", profile.mother.email),
      ],
    );
  }

  Widget _buildAcademicSummary(StudentProfile profile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildInfoItem("Grade", profile.grade),
        _buildInfoItem("Section", profile.section),
        _buildInfoItem("Roll Number", profile.rollNumber),
        _buildInfoItem("Admission Date", profile.admissionDate),
        _buildInfoItem("Status", profile.status),
      ],
    );
  }

  /// ================= INFO ITEM =================
  Widget _buildInfoItem(String label, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 1.5.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 13.sp,
              color: AppColors.textGrey,
            ),
          ),
          SizedBox(height: 0.4.h),
          Text(
            value.isEmpty ? "N/A" : value,
            style: TextStyle(
              fontSize: 14.sp,
              color: AppColors.textDark,
            ),
          ),
        ],
      ),
    );
  }

  /// ================= HELPERS =================
  String _getUserFriendlyError(String error) {
    if (error.contains('Failed to load')) {
      return 'Unable to load student profile.\nPlease check your connection and try again.';
    }
    if (error.contains('Unauthorized') || error.contains('401')) {
      return 'Session expired. Please login again.';
    }
    if (error.contains('Network')) {
      return 'Network error. Please check your internet connection.';
    }
    return 'Something went wrong. Please try again.';
  }

  void _handleSessionExpiry() {
    Navigator.of(context).pushNamedAndRemoveUntil(
      '/login',
          (route) => false,
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Session expired. Please login again.'),
        backgroundColor: Colors.red,
      ),
    );
  }
}