# Instructor Attendance Management System

This is an API-based system for managing the check-in and check-out times of instructors, along with generating monthly reports. The system is built using Express.js with TypeScript and Node.js, and it utilizes a local SQL database with Sequelize as the ORM.

## Getting Started

To run the application locally, follow these steps:

1. Clone this repository to your local machine.
2. Run `npm install` to install the necessary dependencies.
3. Run `tsc` to compile TypeScript files into JavaScript.
4. Start the Express server by running `npm run dev`.

If you are using a Mac with an ARM architecture, you may need to perform additional steps to run SQLite. Execute the following commands:

```bash
npm uninstall sqlite3
npm install sqlite3 --build-from-source --target_arch=arm64 --fallback-to-build
```

## Usage

For more detailed documentation and examples, refer to the [Postman Documentation](https://documenter.getpostman.com/view/12517036/2sA2r9UhVf).


### Check-In/Out API

- The API accepts separate calls for check-in and check-out operations.
- Instructors must provide their unique ID along with the check-in/out time.
- The system validates the input to ensure the date and timings are valid, and slots do not overlap.

#### Check-In
**Endpoint:** `POST /v1/attendance/checkInAndOut`

**Request Body:**
```json
{
  "instructorId": "uniqueID",
  "type":"check-in | check-out"
}
```

#### Check-In

- This API computes and returns the total checked-in time for each instructor in a given month.
- The report is provided in JSON format.

**Endpoint:** `POST /v1/attendance/getMonthlyAnalytics`


## Testing
Unit tests are implemented to ensure the system works as expected in various scenarios. To run the tests and check the coverage, use the following command:
```
npm test
```
## Sequelize ORM

The system utilizes Sequelize, an Object-Relational Mapping (ORM) library for Node.js, to interact with the SQL database. Sequelize simplifies database operations by mapping database objects to JavaScript objects, making it easier to perform CRUD (Create, Read, Update, Delete) operations and manage relationships between different tables.

## Session-Based Approach

The system adopts a session-based approach to manage user authentication and authorization. When an instructor logs in, a session is created and stored, allowing the system to identify and authenticate the user for subsequent requests during the session. This approach ensures that only authenticated users can access and perform authorized actions within the system.

## Transaction Usage for Database Integrity

Transactions are utilized to maintain database integrity during operations that involve multiple database changes. When an instructor checks in or checks out, the system begins a transaction to ensure that all database changes related to the operation are completed successfully. If any part of the operation fails, the transaction is rolled back, reverting all changes made within the transaction to maintain database consistency. This ensures that the database remains in a consistent state even in the event of errors or failures during operations.


## Dependencies
- Express.js
- TypeScript
- Node.js
- Sequelize
- Validator
- Joi

## Contributing
Contributions are welcome! Please feel free to submit issues or pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.


