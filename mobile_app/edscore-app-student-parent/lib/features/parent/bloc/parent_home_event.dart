// lib/features/parent/bloc/parent_home_event.dart

abstract class ParentHomeEvent {}

class LoadParentHome extends ParentHomeEvent {}

class RefreshParentHome extends ParentHomeEvent {}

class SelectStudent extends ParentHomeEvent {
  final String studentId;
  SelectStudent(this.studentId);
}