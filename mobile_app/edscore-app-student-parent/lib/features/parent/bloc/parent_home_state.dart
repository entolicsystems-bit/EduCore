// lib/features/parent/bloc/parent_home_state.dart

import '../domain/entities/parent_home.dart';

class ParentHomeState {
  final bool isLoading;
  final bool isError;
  final String? errorMessage;
  final ParentHomeData? homeData;

  const ParentHomeState({
    this.isLoading = false,
    this.isError = false,
    this.errorMessage,
    this.homeData,
  });

  ParentHomeState copyWith({
    bool? isLoading,
    bool? isError,
    String? errorMessage,
    ParentHomeData? homeData,
  }) {
    return ParentHomeState(
      isLoading: isLoading ?? this.isLoading,
      isError: isError ?? this.isError,
      errorMessage: errorMessage,
      homeData: homeData ?? this.homeData,
    );
  }
}