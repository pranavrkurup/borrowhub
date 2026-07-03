 # BorrowHub Database Schema Blueprint

## 1. Users Collection
- `_id`: ObjectId (Auto-generated unique identifier)
- `name`: String (Required, full name of student)
- `email`: String (Required, Unique, institutional email validation)
- `password`: String (Required, protected by secure hashing)
- `role`: String (Enum: 'Student', 'Admin', defaults to 'Student')
- `createdAt`: Date Timestamp

## 2. Items Collection
- `_id`: ObjectId (Auto-generated unique identifier)
- `ownerId`: ObjectId (Required, Reference mapping back to Users collection)
- `title`: String (Required, e.g., "Casio fx-991EX")
- `description`: String (Details about item condition/rules)
- `category`: String (Enum: 'Electronics', 'Books', 'Lab Equipment', 'Other')
- `status`: String (Enum: 'Available', 'Borrowed', defaults to 'Available')
- `createdAt`: Date Timestamp

## 3. BorrowRequests Collection
- `_id`: ObjectId (Auto-generated unique identifier)
- `itemId`: ObjectId (Required, Reference mapping to Items collection)
- `borrowerId`: ObjectId (Required, Reference mapping to borrowing User)
- `lenderId`: ObjectId (Required, Reference mapping to owning User)
- `status`: String (Enum: 'Pending', 'Approved', 'Rejected', 'Returned', defaults to 'Pending')
- `createdAt`: Date Timestamp
