import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:file_picker/file_picker.dart';

import 'birth_event.dart';
import 'birth_state.dart';

class BirthBloc extends Bloc<BirthEvent, BirthState> {
  BirthBloc() : super(BirthInitial()) {
    on<PickBirthCertificateEvent>(_onPickBirthCertificate);
  }

  Future<void> _onPickBirthCertificate(
      PickBirthCertificateEvent event,
      Emitter<BirthState> emit,
      ) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'jpg', 'png'],
      );

      if (result != null) {
        final fileName = result.files.single.name;
        emit(BirthFilePickedState(fileName));
      }
    } catch (e) {
      emit(BirthErrorState("Failed to pick file"));
    }
  }
}

