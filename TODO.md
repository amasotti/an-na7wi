# ToDos:

* [ ] Dual Interface Edit and Study
* [ ] Automatic translitteration
* [ ] Complete frontend features
* [ ] Mastering dashboard (how many words, texts, etc.)


## Technical / Utilities

* [ ] Cleanup job for deprecated versions of a text
* [ ] Clean TextService. Analyze functionality should be in another service
* [x] DB setup for tests or mocking DB conenction
* [x] Add tests for Services and Controllers
* [x] Add DTOs

## Prompts

We're in the process of implementing the requirements described here: docs/architecture/brainstorming-text-annotation-workflow.md. Sofar only the adjustments to the project (backend and frontend) were done. 
The DTOs were created and the API cleaned up. The frontend offers a way to create and edit texts. Now focus on adding functionality to load versions of a text and being able
to switch between them. The frontend should allow to select a version and display it. 
Only the current version of a text should be editable. Follow the code style and guidelines in CLAUDE.md
