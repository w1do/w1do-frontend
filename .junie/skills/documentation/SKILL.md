---
name: documentation
description: "Apply this skill writing of documentations docs/symmary"
license: MIT
metadata:
  author: UNIQDEVELOPER
---

# Documentation Skill

## Overview
This skill mandates the logging and documentation of implemented features, components, and completed functionality. It ensures a transparent and chronological record of project development.

## Requirements

1. **Feature Logging (`docs/*.md`)**:
   - For every implemented feature, component, or completed piece of functionality, write or update a corresponding documentation file in the `docs/` directory.
   - Detail the steps completed, decisions made, and functionality added.

2. **Project Summary (`SUMMARY.md`)**:
   - Maintain a concise, high-level summary of the project in the `SUMMARY.md` file located at the project root.
   - Always update `SUMMARY.md` whenever significant progress is made to reflect the current state of the project.
   - Use this file for "vibe coding" information and general project context.

3. **Project README (`README.md`)**:
   - Maintain a "Project Functionality" (Функционал проекта) section in `README.md`.
   - For each major block in `docs/`, add a brief description and a link to the corresponding file.
   - Provide a link to `SUMMARY.md` with a short description (e.g., "Brief information on vibe coding").

4. **API Documentation (Swagger/OpenAPI)**:
   - For every new or modified API endpoint, update Swagger annotations in the corresponding Controller or Data classes.
   - Ensure all parameters, request bodies, and responses are accurately documented using `OpenApi\Attributes`.
   - Run `php artisan l5-swagger:generate` to verify the documentation compiles without errors.

## When to Apply
Activate this skill after successfully completing any implementation task (e.g., adding a new module, component, finalizing a feature, or changing an API). Do this before submitting the task.
