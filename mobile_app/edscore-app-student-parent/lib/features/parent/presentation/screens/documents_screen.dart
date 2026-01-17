import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';
import '../../../../core/theme/app_colours.dart';

class DocumentsScreen extends StatelessWidget {
  final String studentId;

  const DocumentsScreen({
    Key? key,
    required this.studentId,
  }) : super(key: key);

  /// ---------------- DUMMY DOCUMENT DATA ----------------
  List<Map<String, String>> get documents => [
    {
      "title": "Birth Certificate",
      "date": "Uploaded On 29 december 2025",
      "status": "verified",
    },
    {
      "title": "Aadhar Card",
      "date": "Uploaded On 29 december 2025",
      "status": "verified",
    },
    {
      "title": "Previous School Tc",
      "date": "Uploaded On 29 december 2025",
      "status": "verified",
    },
    {
      "title": "Medical Certificate",
      "date": "Uploaded On 29 december 2025",
      "status": "uploaded",
    },
    {
      "title": "Passport Photo",
      "date": "Uploaded On 29 december 2025",
      "status": "verified",
    },
    {
      "title": "Previous Marksheet",
      "date": "Uploaded On 29 december 2025",
      "status": "pending",
    },
  ];

  int get total => documents.length;
  int get verified =>
      documents.where((d) => d["status"] == "verified").length;
  int get uploaded =>
      documents.where((d) => d["status"] == "uploaded").length;
  int get pending =>
      documents.where((d) => d["status"] == "pending").length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,

      /// ---------------- APP BAR ----------------
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        toolbarHeight: 7.h,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white, size: 24.sp),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Documents",
          style: TextStyle(
            fontFamily: 'Poppins',
            color: Colors.white,
            fontSize: 18.sp,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      /// ---------------- BODY (SCROLLABLE) ----------------
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: EdgeInsets.only(bottom: 3.h),
        child: Column(
          children: [
            SizedBox(height: 2.h),

            /// Stats Card
            Container(
              margin: EdgeInsets.symmetric(horizontal: 4.w),
              padding: EdgeInsets.all(4.w),
              decoration: BoxDecoration(
                color: AppColors.cardBg,
                borderRadius: BorderRadius.circular(4.w),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildStat("Total", total.toString(), AppColors.primary),
                  _verticalDivider(),
                  _buildStat("Verified", verified.toString(), AppColors.success),
                  _verticalDivider(),
                  _buildStat("Uploaded", uploaded.toString(), const Color(0xFF3B82F6)),
                  _verticalDivider(),
                  _buildStat("Pending", pending.toString(), AppColors.error),
                ],
              ),
            ),

            SizedBox(height: 2.h),

            /// Documents List
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 4.w),
              child: Column(
                children: documents.map((doc) {
                  return _buildDocumentCard(
                    doc["title"]!,
                    doc["date"]!,
                    doc["status"]!,
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// ---------------- UI HELPERS ----------------

  Widget _buildStat(String label, String count, Color color) {
    return Column(
      children: [
        Text(
          count,
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 12.px,
            fontWeight: FontWeight.bold,
            color: AppColors.textGrey,
          ),
        ),
        SizedBox(height: 0.3.h),
        Text(
          label,
          style: TextStyle(
            fontFamily: 'Poppins',
            color: color,
            fontWeight: FontWeight.w500,
            fontSize: 12.px
          ),
        ),
      ],
    );
  }

  Widget _verticalDivider() {
    return Container(
      height: 5.h,
      width: 0.3.w,
      color: AppColors.border.withOpacity(0.3),
    );
  }

  Widget _buildDocumentCard(String title, String date, String status) {
    Color statusColor;
    Color statusBg;
    String statusText;

    switch (status) {
      case "verified":
        statusColor = AppColors.success;
        statusBg = const Color(0xFFD1FAE5);
        statusText = "Verified";
        break;
      case "uploaded":
        statusColor = const Color(0xFF3B82F6);
        statusBg = const Color(0xFFDBEAFE);
        statusText = "Uploaded";
        break;
      case "pending":
        statusColor = AppColors.error;
        statusBg = const Color(0xFFFEF3C7);
        statusText = "Pending";
        break;
      default:
        statusColor = AppColors.textGrey;
        statusBg = AppColors.border.withOpacity(0.2);
        statusText = "Unknown";
    }

    return Container(
      margin: EdgeInsets.only(bottom: 2.h),
      padding: EdgeInsets.all(4.w),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(3.w),
        border: Border.all(
          color: AppColors.border.withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// Document Icon
          Container(
            padding: EdgeInsets.all(3.w),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(2.w),
            ),
            child: Icon(
              Icons.description_outlined,
              color: AppColors.primary,
              size: 24.sp,
            ),
          ),
          SizedBox(width: 3.w),

          /// Document Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 15.sp,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
                SizedBox(height: 0.3.h),
                Text(
                  date,
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12.sp,
                    color: AppColors.textGrey,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                SizedBox(height: 1.h),
                Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: 3.w,
                    vertical: 0.5.h,
                  ),
                  decoration: BoxDecoration(
                    color: statusBg,
                    borderRadius: BorderRadius.circular(2.w),
                  ),
                  child: Text(
                    statusText,
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 11.sp,
                      fontWeight: FontWeight.w600,
                      color: statusColor,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
//document screen