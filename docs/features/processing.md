# Document Processing (OCR & Auto-Tagging)

## Overview
The processing engine handles the asynchronous extraction of text from uploaded files and assigns relevant tags based on content analysis, automating the categorization process.

## Architecture

### 1. Worker Service
- **Type**: Asynchronous Background Worker.
- **Trigger**: Listens for `DocumentUploaded` event or checks queue.
- **Responsibility**: Heavy computational tasks (OCR) separate from Main API.

### 2. Processing Workflow
1. **Text Extraction (OCR)**:
   - **Engine**: Tesseract.js (local) or Cloud Vision API (production).
   - **Input**: PDF, JPEG, PNG.
   - **Output**: Raw text string.
   - **Note**: For DOCX, parses XML content directly.
2. **Sanitization**:
   - Removes special characters.
   - Normalizes text (lowercase, trimming).
3. **Keyword Matching Algorithm**:
   - Loads all `System Tags` from DB.
   - Checks document text against defined keywords for each tag (e.g., `key="FORM_106"` looks for "106", "טופס 106", "אישור מעסיק").
   - Calculates **Confidence Score**:
     - > 0.8: High certainty (Exact match).
     - 0.5 - 0.8: Medium (Partial match).
4. **Database Update**:
   - Inserts records into `DocumentTags`.
   - Updates `Documents.status` to `READY`.

## Status Transitions
- `UPLOADED`: Initial state. processing pending.
- `PROCESSING`: Worker active.
- `READY`: Analysis done, tags assigned.
- `FAILED`: File corrupted or OCR failed.

## Scalability
- **Queues**: Using a message queue (e.g., BullMQ, RabbitMQ) allows multiple workers to scale horizontally.
