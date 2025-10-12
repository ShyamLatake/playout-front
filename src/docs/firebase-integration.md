# Firebase Integration Documentation

## Registration Flow with Firebase ID

When a user registers, the following data is sent to the backend:

### Registration Payload Structure

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "userType": "normal_user",
  "sports": [],
  "rating": 0,
  "firebaseId": "firebase_uid_here",
  "emailVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastSignIn": "2024-01-01T00:00:00.000Z",
  "idToken": "firebase_id_token_here"
}
```

### Backend Expected Behavior

1. **Verify Firebase ID Token**: Use Firebase Admin SDK to verify the `idToken`
2. **Extract Firebase UID**: Use the `firebaseId` field to link the user account
3. **Store User Data**: Save user information with Firebase UID as reference
4. **Return User Object**: Return the created user object with database ID

### Example Backend Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "database_generated_id",
      "firebaseId": "firebase_uid_here",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "userType": "normal_user",
      "sports": [],
      "rating": 0,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Security Considerations

1. **Token Verification**: Always verify the Firebase ID token on the backend
2. **UID Matching**: Ensure the Firebase UID in the token matches the `firebaseId` field
3. **Email Verification**: Consider requiring email verification for sensitive operations
4. **Rate Limiting**: Implement rate limiting for registration endpoints

### Error Handling

If backend registration fails after Firebase user creation:
- The frontend automatically deletes the Firebase user
- This prevents orphaned Firebase accounts
- User can retry registration with the same email

### Login Flow

For login, only the Firebase ID token is sent:

```json
{
  "idToken": "firebase_id_token_here"
}
```

The backend should:
1. Verify the token
2. Extract the Firebase UID
3. Find the user by `firebaseId`
4. Return user data