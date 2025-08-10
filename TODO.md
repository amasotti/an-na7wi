# ToDos:

* [x] Dual Interface Edit and Study
* [x] Automatic translitteration
* [x] Complete frontend features
* [ ] Mastering dashboard (how many words, texts, etc.)
* [x] Root functionalities
* [ ] active-tag search and tags endpoints for texts

## Technical / Utilities

* [ ] Cleanup job for deprecated versions of a text
* [x] Clean TextService. Analyze functionality should be in another service
* [x] DB setup for tests or mocking DB conenction
* [x] Add tests for Services and Controllers
* [x] Add DTOs
* S3 Bucket for backup of db



## Prompts

This project is a full stack application for learning Arabic, focusing on text analysis, vocabulary management, and annotations. 
It includes a Kotlin/Quarkus backend, Vue.js 3/TypeScript frontend, and PostgreSQL database.
We now want to add the learn word functionality to the frontend, which will allow users to learn new words (or expressions, the concept is the same).
They're a separate entity in the backend and have in principle no relation to the text. 
* Add learn word functionality to the frontend (view already there but empty)
* We can do simple CRUD operations for learn words
* Each word has following properties:
    - `id`: unique identifier (UUID)
    - `word`: the word or expression itself
    - `definition`: a short definition or meaning / translation of the word
    - `translitteration`: the word in transliteration (optional)
    - `example`: an example sentence using the word
    - `root`: the root of the word (if applicable)
    - `notes`: any additional notes or context
    - `difficulty`: a difficulty level (following the Difficulty Enum)
    - `mastery_level`: a mastery level (following the MasteryLevel Enum)
    - `dialect`: a dialect (following the Dialect Enum)
    - Link to dictionary (third party WEB, can be multiple, e.g. Almaany, ArabicStudentDictionary, Wiktionary)
    - Link to pronunciation
    - links to possible other words (e.g. synonyms, antonyms)

Review backend and frontend code for learn words, and implement the features above in a nice user friendly way.
If needed remove from the backend unused entity fields and add those missing. 
