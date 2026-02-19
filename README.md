# Core API

A centralized, production-style RESTful backend service designed to power multiple independent frontend applications from a single scalable platform.

This API supports a full portfolio ecosystem including:

- Ecommerce applications
- Restaurant ordering systems
- Movie database platforms
- Digital library systems
- Social media applications
- Personal portfolio services

Built with Node.js, Express, and PostgreSQL, following real-world backend architecture and scalable system design principles.

---

## Purpose

Core API provides a unified backend platform where multiple client applications share authentication, database structures, and reusable domain logic.

By consolidating backend services into a single modular architecture, it enables:

- Secure user authentication and account management
- Generic catalog and content management system
- Reviews, ratings, and feedback handling
- Orders and transaction management
- Social media content management
- User avatars and media uploads

This approach reflects industry-standard backend design for multi-application support.

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt password hashing

---

## Supported Application Domains

### Ecommerce

Product catalog, ordering system, user reviews.

### Restaurant Platform

Menu management, food catalog, ratings, and customer feedback.

### Movie Database

Media catalog browsing, descriptions, and review system.

### Digital Library

Book catalog management and user-generated ratings.

### Social Media

User profiles, posts, comments, likes, and avatar images.

### Portfolio Services

Shared authentication and user profile infrastructure.

---

## Core Backend Modules

- `/auth` — authentication and session management
- `/users` — profile management and avatar handling
- `/items` — unified catalog for products, movies, books, menu items
- `/reviews` — ratings and feedback system
- `/orders` — ecommerce transactions
- `/posts` — social media content

---

## Media & Avatar Support

The API supports user-uploaded media such as:

- Profile avatars
- Item images
- Social media post images

Files are stored externally or in designated storage, with database maintaining only the file URLs, following production-grade storage practices.

---

## Architecture Principles

- **Centralized Backend**: One backend powering multiple frontend applications.
- **Domain-Based Routing**: Endpoints are structured by data domain, not by individual frontend projects.
- **Generic Catalog Model**: A unified item structure allows different applications to store and retrieve various types of content using a category-based system.
- **Scalable & Modular Design**: The architecture is intentionally modular so new applications can integrate without restructuring the backend.

---

## Development Status

Currently under active development as part of a professional full-stack engineering portfolio focused on real-world backend architecture.

---

## Project Goal

This project demonstrates:

- Production-grade backend structure
- Clean modular architecture
- Secure authentication and user management
- Relational database modeling
- Multi-application backend design
- Media upload handling

---

## Author

Developed to showcase professional full-stack engineering skills and scalable backend system design.
