# Changelog

## 1.0.1 - 2023-10-30

### Sprint Learnings

During this sprint, I achieved the following goals:

- Became familiar with Express, MongoDB, and Mongoose.
- Set up the basic project configuration.
- Established a connection to the database.
- Obtained a JWT secret key.
- Implemented admin login functionality.
- Understood and created a schema with Mongoose.

### Added

In this sprint, the following new features and components were added:

- Connected to Mongo Atlas for database hosting.
- Implemented JWT secret key functionality.
- Created an admin user for making requests.
- Added admin authentication.
- Developed the users schema.
- Implemented users controllers.
- Created all necessary user endpoints.

### Changed

- Updated the database connection to use Mongo Atlas.

### Fixed

- Corrected the endpoint in routes/auth.js to /login instead of /auth.

### Removed

- Eliminated the connect.js file since the database connection was established through Mongo Atlas.

### Commit Log

- Set up, created user schema, created admin, added login
- Added JWT key and added /login
- Added endpoint for user creation
- Added end point to get user by id
- Endpoint to delete users by id
- Added endpoint to patch users info
- Fixed password hash and login
- Added product schema and controllers

<!-- git log --since="1 week ago" --reverse --pretty=format:"%h %an %ad %s" -->