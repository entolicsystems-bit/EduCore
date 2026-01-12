// lib/features/parent/bloc/parent_home_bloc.dart

import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../../data/services/token_refresh_service.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/errors/auth_exception.dart';
import '../domain/entities/parent_home.dart';
import 'parent_home_event.dart';
import 'parent_home_state.dart';

class ParentHomeBloc extends Bloc<ParentHomeEvent, ParentHomeState> {
  final TokenRefreshService _tokenService = TokenRefreshService();

  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  ParentHomeBloc() : super(const ParentHomeState()) {
    on<LoadParentHome>(_onLoadParentHome);
    on<RefreshParentHome>(_onRefreshParentHome);
  }

  Future<void> _onLoadParentHome(
      LoadParentHome event,
      Emitter<ParentHomeState> emit,
      ) async {
    emit(state.copyWith(isLoading: true, isError: false));

    try {
      // Parent email from storage (unchanged)
      final parentEmail = await _storage.read(key: 'parent_email');

      // ✅ ONLY correct token call (auto refresh handled internally)
      final accessToken =
      await _tokenService.getValidParentAccessToken();

      if (accessToken == null) {
        throw AuthException('Session expired. Please login again.');
      }

      // API call (unchanged)
      final response = await http.get(
        Uri.parse(
          '${ApiConstants.baseUrl}${ApiConstants.parentDashboard}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final homeData = _parseHomeData(data, parentEmail);

        emit(state.copyWith(
          isLoading: false,
          homeData: homeData,
        ));
        return;
      }

      // Unauthorized or other failure
      emit(state.copyWith(
        isLoading: false,
        isError: true,
        errorMessage: 'Failed to load dashboard data.',
      ));
    } catch (e) {
      String errorMsg =
          'Network error. Please check your connection.';

      if (e is AuthException) {
        errorMsg = e.message;
      } else if (e.toString().contains('SocketException') ||
          e.toString().contains('Failed host lookup')) {
        errorMsg =
        'Unable to connect. Please check your internet connection.';
      } else if (e.toString().contains('TimeoutException')) {
        errorMsg = 'Connection timeout. Please try again.';
      }

      emit(state.copyWith(
        isLoading: false,
        isError: true,
        errorMessage: errorMsg,
      ));
    }
  }

  Future<void> _onRefreshParentHome(
      RefreshParentHome event,
      Emitter<ParentHomeState> emit,
      ) async {
    // Existing behaviour preserved
    emit(state.copyWith(isLoading: true, isError: false));
    add(LoadParentHome());
  }

  // ================= PARSING (UNCHANGED) =================

  ParentHomeData _parseHomeData(
      Map<String, dynamic> data,
      String? parentEmail,
      ) {
    final List<StudentInfo> students = [];

    if (data['students'] != null && data['students'] is List) {
      for (var student in data['students']) {
        students.add(
          StudentInfo(
            id: student['id']?.toString() ?? '',
            name:
            student['name'] ??
                student['firstName'] ??
                'Student',
            grade:
            student['grade'] ??
                student['class'] ??
                'Grade',
            enrollmentStatus:
            student['enrollmentStatus'] ??
                student['status'] ??
                'Enrolled',
            profileImage:
            student['profileImage'] ?? student['avatar'],
          ),
        );
      }
    }

    String parentName = 'Parent';
    if (data['parentName'] != null) {
      parentName = data['parentName'];
    } else if (data['name'] != null) {
      parentName = data['name'];
    } else if (data['firstName'] != null) {
      parentName = data['firstName'];
    } else if (parentEmail != null) {
      parentName = parentEmail.split('@')[0];
    }

    return ParentHomeData(
      parentName: parentName,
      students: students,
    );
  }
}
