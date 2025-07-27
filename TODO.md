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

We're in the process of implementing the requirements described here: docs/architecture/brainstorming-text-annotation-workflow.md. Sofar only the basic adjustments to the project (backend and frontend) were done. Take
this just as background. let's focus for now on simplification of the current endpoints, services, frontend. In particular 1) the annotation still contain the info about the position start and position end, but we
decided in that requirement document that they're only related to a text and loosely coupled, so we can simplify a lot.
