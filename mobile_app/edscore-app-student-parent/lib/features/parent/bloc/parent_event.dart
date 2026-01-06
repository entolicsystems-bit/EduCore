abstract class ParentEvent {}

class ParentEmailChanged extends ParentEvent {
  final String email;
  ParentEmailChanged(this.email);
}

class ParentPasswordChanged extends ParentEvent {
  final String password;
  ParentPasswordChanged(this.password);
}

class ParentTogglePasswordVisibility extends ParentEvent {}

class ParentLoginSubmitted extends ParentEvent {}

class ParentCheckAuthStatus extends ParentEvent {}

class ParentLogoutRequested extends ParentEvent {}