import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:student/core/theme/app_colours.dart';


import '../../../../core/utils/status_mapper.dart';
import '../../bloc/document/document_bloc.dart';
import '../../bloc/document/document_event.dart';
import '../../bloc/document/document_state.dart';
import '../widget/document_preview_card.dart';

class DocumentPreviewScreen extends StatelessWidget {
  const DocumentPreviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: BlocProvider(
        create: (_) => DocumentBloc()..add(LoadDocumentsEvent()),
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

                  return DocumentPreviewCard(
                    title: doc.name,
                    status: getStatus(doc.status),
                    uploadDate: doc.uploadDate,
                    index: index,
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
}