// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:student/core/theme/app_colours.dart';
//
// import '../../bloc/birth/birth_bloc.dart';
// import '../../bloc/birth/birth_event.dart';
// import '../../bloc/birth/birth_state.dart';
//
// class BirthScreen extends StatefulWidget {
//   const BirthScreen({super.key});
//
//   @override
//   State<BirthScreen> createState() => _BirthScreenState();
// }
//
// class _BirthScreenState extends State<BirthScreen> {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: AppBar(
//         title: const Padding(
//           padding: EdgeInsets.only(right: 200),
//           child: Text("Birth Certificate"),
//         ),
//         backgroundColor: Colors.blue,
//         actions: [
//           IconButton(onPressed: () {}, icon: const Icon(Icons.close_sharp))
//         ],
//       ),
//       body: SingleChildScrollView(
//         child: Column(
//           children: [
//             Center(
//               child: Padding(
//                 padding: const EdgeInsets.only(top: 30),
//                 child: Container(
//                   height: 550,
//                   width: 380,
//                   decoration: BoxDecoration(
//                     color: Colors.white,
//                     border: Border.all(color: Colors.grey),
//                     borderRadius: BorderRadius.circular(10),
//                   ),
//                   child: BlocBuilder<BirthBloc, BirthState>(
//                     builder: (context, state) {
//                       String fileName = "Birth Certificate";
//
//                       if (state is BirthFilePickedState) {
//                         fileName = state.fileName;
//                       }
//
//                       return Center(
//                         child: GestureDetector(
//                           onTap: () {
//                             context
//                                 .read<BirthBloc>()
//                                 .add(PickBirthCertificateEvent());
//                           },
//                           child: Container(
//                             // height: 200,
//                             // width: 160,
//                             // decoration: BoxDecoration(
//                             //   color: Colors.white,
//                             //   borderRadius: BorderRadius.circular(10),
//                             //   border:
//                             //   Border.all(color: Colors.blue, width: 2),
//                             // ),
//                             child: Column(
//                               mainAxisAlignment: MainAxisAlignment.center,
//                               children: [
//                                 const Icon(
//                                   Icons.description_outlined,
//                                   size: 130,
//                                   color: Colors.blue,
//                                 ),
//                                 const SizedBox(height: 10),
//
//                                 Text(
//                                   fileName,
//                                   textAlign: TextAlign.center,
//                                   style: const TextStyle(
//                                     fontSize: 14,
//                                     fontWeight: FontWeight.w600,
//                                   ),
//                                 ),
//                                 const SizedBox(height: 4),
//                                 const Text(
//                                   "Pdf",
//                                   style: TextStyle(
//                                     fontSize: 12,
//                                     color: Colors.grey,
//                                   ),
//                                 ),
//                               ],
//                             ),
//                           ),
//                         ),
//                       );
//                     },
//                   ),
//                 ),
//               ),
//             ),
//
//             const SizedBox(height: 20),
//
//             Row(
//               mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//               children: [
//                 const Padding(
//                   padding: EdgeInsets.only(right: 200),
//                   child: Text(
//                     "Status",
//                     style: TextStyle(
//                       fontSize: 14,
//                       fontWeight: FontWeight.w500,
//                     ),
//                   ),
//                 ),
//                 Container(
//                   padding:
//                   const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
//                   decoration: BoxDecoration(
//                     color: Colors.green.shade100,
//                     borderRadius: BorderRadius.circular(20),
//                   ),
//                   child: const Text(
//                     "Verified",
//                     style: TextStyle(
//                       fontSize: 12,
//                       color: Colors.green,
//                       fontWeight: FontWeight.w600,
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//
//             const SizedBox(height: 8),
//
//             Row(
//               mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//               children: const [
//                 Padding(
//                   padding: EdgeInsets.only(right: 130),
//                   child: Text(
//                     "Upload Date",
//                     style: TextStyle(
//                       fontSize: 14,
//                       fontWeight: FontWeight.w500,
//                     ),
//                   ),
//                 ),
//                 Padding(
//                   padding: EdgeInsets.only(left: 10),
//                   child: Text(
//                     "25 Dec 2025",
//                     style: TextStyle(
//                       fontSize: 14,
//                       color: Colors.black,
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//
//             const SizedBox(height: 20),
//
//             SizedBox(
//               width: 354,
//               height: 48,
//               child: ElevatedButton(
//                 onPressed: () {},
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: const Color(0xFF1593FF),
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(8),
//                   ),
//                 ),
//                 child: const Text(
//                   "Download Document",
//                   style:
//                   TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
//                 ),
//               ),
//             ),
//
//             const SizedBox(height: 12),
//
//             SizedBox(
//               width: 354,
//               height: 48,
//               child: ElevatedButton(
//                 onPressed: () {
//                   Navigator.pop(context);
//                 },
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: const Color(0xFF1593FF),
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(8),
//                   ),
//                 ),
//                 child: const Text(
//                   "Close",
//                   style:
//                   TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import '../../../../common/document_preview_widget.dart';
import '../../data/models/document_type.dart';

class BirthScreen extends StatelessWidget {
  const BirthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DocumentPreviewWidget(
      type: DocumentType.birth,
      statusText: "Verified",
      statusColor: Colors.green,
      uploadDate: "25 Dec 2025",
      onDownload: () {
        // download birth certificate
      },
      onClose: () {
        Navigator.pop(context);
      },
    );
  }
}

// birth screen