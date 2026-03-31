# MorphoAid Route Mapping

This document maps the frontend routes to their corresponding components, layouts, and backend controllers.

| Router Path (Frontend) | Frontend View / Component | Frontend Layout | Backend Controller & API Path |
| :--- | :--- | :--- | :--- |
| `/login` | `Login.vue` | `PublicLayout.vue` | `AuthController.java` (`/auth/login`) |
| `/register/data-use` | `RegisterDataUse.vue` | `PublicLayout.vue` | `AuthController.java` (`/auth/register`) |
| `/admin/dashboard` | `AdminDashboard.vue` | `AdminLayout.vue` | `AdminUserController.java` |
| `/admin/users` | `UserManagement.vue` | `AdminLayout.vue` | `AdminUserController.java` (`/admin/users`) |
| `/admin/approvals` | `UserApprovals.vue` | `AdminLayout.vue` | `AdminUserController.java` (`/admin/users/pending`) |
| `/admin/activity-log` | `ActivityLog.vue` | `AdminLayout.vue` | `AdminActivityController.java` (`/admin/activities`) |
| `/data-use` | `TestHub.vue` | `DataUseLayout.vue` | `CaseController.java` (`/cases`) |
| `/data-use/cases` | `CaseListTest.vue` | `DataUseLayout.vue` | `CaseController.java` (`/cases`) |
| `/data-use/cases/:id` | `CaseDetailTest.vue` | `DataUseLayout.vue` | `CaseController.java` (`/cases/{id}`) |
| `/data-use/insights` | `Insight.vue` | `DataUseLayout.vue` | `VisualizationController.java` (`/visualization/*`) |

---

## File Details

### Frontend Files
**Path:** `MorphoAid-Frontend/frontend/src/`

- **Router:** `router/index.js`
- **Layouts:**
  - `layouts/PublicLayout.vue`
  - `layouts/AdminLayout.vue`
  - `layouts/DataUseLayout.vue`
- **Views:**
  - `features/auth/views/Login.vue`
  - `features/auth/views/RegisterDataUse.vue`
  - `features/admin/views/AdminDashboard.vue`
  - `features/admin/views/UserManagement.vue`
  - `features/admin/views/UserApprovals.vue`
  - `features/admin/views/ActivityLog.vue`
  - `features/case-management/views/TestHub.vue`
  - `features/case-management/views/CaseListTest.vue`
  - `features/case-management/views/CaseDetailTest.vue`
  - `features/visualization/views/Insight.vue`

### Backend Files
**Path:** `MorphoAid-Backend/src/main/java/com/morphoaid/backend/`

- **Controllers:**
  - `controller/AuthController.java`
  - `controller/AdminUserController.java`
  - `controller/AdminActivityController.java`
  - `controller/CaseController.java`
  - `controller/VisualizationController.java`
- **Services:**
  - `service/CaseService.java`
  - `service/ActivityService.java`
  - `service/VisualizationService.java`
- **Repositories:**
  - `repository/UserRepository.java`
  - `repository/CaseRepository.java`
  - `repository/ActivityRepository.java`
