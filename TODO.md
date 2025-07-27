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
The DTOs were created and the API cleaned up. The frontend offers a way to create texts. Now focus on adding functionality to remove or edit an existing text.
Work as senior engineer, avoid verbosity and focus on the task at hand. Take care of modularity and clean readable code. The types in the frontend are all in one
directory, so also the api calls and services and store. The backend should already offer the needed api endpoints, but check them. 
Modifying a text should produce a new version, not overwrite the existing one. Later we will add the functionality to diff
between versions or restore a previous version. Avoid bombing the database and be clever as for the logic.
