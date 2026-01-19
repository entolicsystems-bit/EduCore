import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';


import '../../../../core/theme/app_colours.dart';

class OfferLetterScreen extends StatefulWidget {
  const OfferLetterScreen({super.key});

  @override
  State<OfferLetterScreen> createState() => _OfferLetterScreenState();
}

class _OfferLetterScreenState extends State<OfferLetterScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // ======= HEADER =======
          Container(
            height: 110,
            padding: const EdgeInsets.only(top: 40, left: 12, right: 12),
            decoration: const BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: const Icon(
                    Icons.arrow_back,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Offer Letter",
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "Your Child’s Offer Letter !!",
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 10),

          // ======= BODY =======
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              child: Center(
                child: Container(
                  width: 350,
                  decoration: BoxDecoration(
                    color: AppColors.cardBg,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: const [
                      BoxShadow(
                        color: AppColors.shadow,
                        blurRadius: 6,
                        offset: Offset(0, 2),
                      )
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // LOGO
                        Container(
                          height: 80,
                          width: 80,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            color: AppColors.primary,
                          ),
                          child: Center(
                            child: Text(
                              "Z",
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontSize: 50,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 10),

                        // SCHOOL NAME
                        Text(
                          "Zp school pune",
                          style: GoogleFonts.poppins(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textDark,
                          ),
                        ),

                        const SizedBox(height: 4),

                        // ADDRESS
                        Text(
                          "Chartrapati shivaji maharaj\nchowk, Hinjvadi, pune",
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            color: AppColors.textGrey,
                          ),
                        ),

                        const SizedBox(height: 15),

                        Divider(
                          color: AppColors.border,
                          thickness: 1.5,
                        ),

                        const SizedBox(height: 10),

                        // SUBJECT
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "Subject: Admission Offer for Grade 10-A",
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),

                        const SizedBox(height: 10),

                        // DATE
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "Date: 20 December 2024",
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),

                        const SizedBox(height: 10),

                        // TO ADDRESS
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "To,\nMr. Rajesh Kumar\n123, MG Road,\nKorangamala, Bangalore – 560034",
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),

                        const SizedBox(height: 10),

                        // BODY TEXT
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            "Dear Mr. Rajesh Kumar,\n\n"
                                "We are pleased to inform you that your child, Aarav Kumar, has been selected for admission to Grade 9-A for the academic year 2024–2025 at EntoCrm International School.\n\n"
                                "This admission offer is based on Aarav’s performance during the admission process and the successful review of the submitted documents.\n\n"
                                "We look forward to welcoming Aarav to our school community.",
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),

                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
