# Changelog

## Version 1.1.0 (2024) - Nov 28 authored by Shaurya Bisht (ssbdragonfly)

### Added
- Upgraded to Gemini 1.5 Flash API for faster and more accurate responses
- Implemented RAG (Retrieval Augmented Generation) for subreddit recommendations
- Added curated subreddit database with detailed descriptions
- New API endpoint configuration for Gemini 1.5 Flash

### Changed
- Updated subreddit recommendation logic to use RAG approach
- Improved error handling for subreddit data loading
- Modified prompt engineering to be more specific and context-aware

### Technical Notes
- The extension now requires both API key access to Gemini 1.5 Flash
- Added new dependency: subreddit_data.json
- Updated API endpoint to use gemini-1.5-flash model