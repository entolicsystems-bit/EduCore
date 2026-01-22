import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student/core/theme/app_colours.dart';

import '../../../../core/services/document_api_service.dart';
import '../../../../core/utils/status_mapper.dart';

import '../../bloc/document/document_bloc.dart';
import '../../bloc/document/document_event.dart';
import '../../bloc/document/document_state.dart';
import '../widget/document_preview_card.dart';

class DocumentPreviewScreen extends StatelessWidget {
  final String jwtToken;
  final String applicationId;

  const DocumentPreviewScreen({
    super.key,
    required this.jwtToken,
    required this.applicationId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: BlocProvider(
        create: (_) => DocumentBloc(
          apiService: DocumentApiService(token: jwtToken),
        )..add(LoadDocumentsEvent()),
        child: BlocBuilder<DocumentBloc, DocumentState>(
          builder: (context, state) {
            if (state is DocumentLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (state is DocumentLoaded) {
              return PageView.builder(
                scrollDirection: Axis.vertical,
                itemCount: state.documents.length,
                itemBuilder: (context, index) {
                  final doc = state.documents[index];

                  // Map document names to document types
                  String documentType = _getDocumentType(doc.name);

                  return DocumentPreviewCard(
                    title: doc.name,
                    status: getStatus(doc.status),
                    uploadDate: doc.uploadDate,
                    index: index,
                    applicationId: applicationId,
                    documentType: documentType,
                  );
                },
              );
            }

            if (state is DocumentError) {
              return Center(child: Text(state.message));
            }

            return const SizedBox();
          },
        ),
      ),
    );
  }

  String _getDocumentType(String documentName) {
    // Map document names to API document types
    final mapping = {
      'Birth Certificate': 'BIRTH_CERTIFICATE',
      'Medical Certificate': 'MEDICAL_CERTIFICATE',
      'Previous Marksheet': 'MARKSHEET',
      'ID Proof': 'ID_PROOF',
      'Address Proof': 'ADDRESS_PROOF',
    };

    return mapping[documentName] ?? 'OTHER';
  }
}