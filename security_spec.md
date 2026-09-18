# Virasat Security Specification & Threat Model

## 1. Data Invariants
- **Identity Invariant**: Users can only create, read, update, and delete their own user profile (`/users/{userId}`) where `request.auth.uid == userId`.
- **Relational Invariant**: Saved trips (`/users/{userId}/trips/{tripId}`) and favorites (`/users/{userId}/favorites/{favoriteId}`) strictly belong to the parent user. Access requires `request.auth.uid == userId`.
- **Privilege Invariant**: Regular users cannot elevate their role to `admin` or change their `role` field on write. Only users with verified admin privileges (`abhibhavsinha82@gmail.com`) can perform administrative overrides.
- **Resource Limitation**: All string and array payloads have strict size limits to prevent Denial of Wallet and storage exhaustion attacks.
- **Immutability Invariant**: Identity and relational fields such as `id`, `userId`, `created_at` are immutable on update.

## 2. The Dirty Dozen Malicious Payloads
The following payloads are tested to ensure they are strictly rejected (`PERMISSION_DENIED`):

1. **Unauthenticated Read on User Profile**:
   `GET /users/user_123` with `request.auth == null`
2. **ID Spoofing on User Profile Create**:
   `POST /users/target_user_id` with `request.auth.uid == 'attacker_id'`, payload: `{"id": "target_user_id", "email": "target@example.com"}`
3. **Ghost Field Injection (Shadow Update)**:
   `PATCH /users/{uid}` with payload: `{"role": "admin", "isSuperAdmin": true}`
4. **Denial of Wallet String Injection**:
   `POST /users/{uid}/trips/trip_large` with `title` string length > 50,000 chars.
5. **Path Traversal / ID Poisoning**:
   `GET /users/../../system_config` or illegal regex chars in `{userId}`.
6. **Cross-User Trip Creation**:
   `POST /users/victim_user/trips/trip_1` where `request.auth.uid == 'attacker_user'`.
7. **Cross-User Trip Modification**:
   `PATCH /users/victim_user/trips/trip_1` by non-owner.
8. **Cross-User Favorite Deletion**:
   `DELETE /users/victim_user/favorites/fav_1` by non-owner.
9. **Email Spoofing without Verification**:
   `POST /users/{uid}` with unverified admin email.
10. **Immutable Field Tampering on Trip**:
    `PATCH /users/{uid}/trips/trip_1` with payload altering `userId: "other_user"`.
11. **Negative Numeric Values on Trip**:
    `POST /users/{uid}/trips/trip_2` with `duration_hours: -5` or `estimated_cost: -1000`.
12. **Catch-All Probe on Undefined Collections**:
    `GET /admin_secrets/passwords` or `POST /audit_internal` rejected by default-deny catch-all rule.
