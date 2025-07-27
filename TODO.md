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
The DTOs were created and the API cleaned up. Let's now move forward implementing the first important piece of functionality: being able to create
a text in the frontend. Focus on this only, work in a clean solid way, avoid e.g. profileration of tailwind classes in the frontend, use the existing styles and components
and create meaningful names for the style classes.
There is already a button in the TextView in the frontend but not doing anything. 
