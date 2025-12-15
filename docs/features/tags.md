# Bilingual Tagging System

## Overview
A robust system for organizing documents using tags that support both English and Hebrew. The system uses a specific relational database approach to manage translations and categories centrally, interacting seamlessly with the frontend via `vue-i18n`.

## Data Structures

### 1. Tags Table (Dictionary)
Central repository of all available system tags.
- `id`: PK
- `key`: Stable identifier (e.g., `PAY_SLIP`).
- `label_en`: "Pay Slip"
- `label_he`: "תלוש משכורת"
- `category`: "INCOME", "IDENTITY", "EXPENSE".
- `is_system`: Boolean (cannot be deleted by user).

### 2. DocumentTags Table (Junction)
Connects tags to documents with metadata.
- `document_id`: FK
- `tag_id`: FK
- `confidence`: Float (0.0 - 1.0) indicating AI certainty.
- `source`: `AI` or `USER`.

## API Integration

### GET /api/tags
Returns all available system tags for frontend filtering and manual selection.

### GET /api/documents/{id}
Returns document details including the localized tag structure.
```json
{
  "id": 123,
  "tags": [
    {
      "id": 1,
      "key": "PAY_SLIP",
      "labels": { "en": "Pay Slip", "he": "תלוש משכורת" },
      "category": "INCOME"
    }
  ]
}
```

## Frontend Implementation (Vue 3)
- **Framework**: Uses `vue-i18n` to detect active locale (`en` or `he`).
- **Logic**:
  - The component receives the tag object.
  - It resolves the display text via `tag.labels[locale]`.
  - Fallback to `en` if `he` is missing (though should not happen).

### Example Component
```vue
<template>
  <span class="tag-badge">
    {{ tag.labels[locale] }}
  </span>
</template>

<script setup>
const props = defineProps(['tag']);
const { locale } = useI18n();
</script>
```
