abstract class BirthState {}

class BirthInitial extends BirthState {}

class BirthFilePickedState extends BirthState {
  final String fileName;

  BirthFilePickedState(this.fileName);
}

class BirthErrorState extends BirthState {
  final String message;

  BirthErrorState(this.message);
}
