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
  "type":"check-in" / "check-out" 
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


