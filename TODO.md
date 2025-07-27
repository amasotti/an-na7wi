# ToDos:

* [ ] Dual Interface Edit and Study
* [ ] Automatic translitteration
* [ ] Complete frontend features
* [ ] Mastering dashboard (how many words, texts, etc.)


## Technical / Utilities

* [ ] Cleanup job for deprecated versions of a text
* [ ] Clean TextService. Analyze functionality should be in another service
* [ ] DB setup for tests or mocking DB conenction

"
TextControllerErrorTest > should return 400 for invalid pageSize parameter() FAILED
java.lang.RuntimeException at QuarkusTestExtension.java:668
Caused by: java.lang.RuntimeException at null:-1
Caused by: org.flywaydb.core.internal.exception.sqlExceptions.FlywaySqlUnableToConnectToDbException at JdbcUtils.java:70
Caused by: org.postgresql.util.PSQLException at ConnectionFactoryImpl.java:373
Caused by: java.net.ConnectException at Net.java:-2
"


## Prompts

We're in the process of implementing the requirements described here: docs/architecture/brainstorming-text-annotation-workflow.md. Sofar only the basic adjustments to the project (backend and frontend) were done. Take
this just as background. let's focus for now on simplification of the current endpoints, services, frontend. In particular 1) the annotation still contain the info about the position start and position end, but we
decided in that requirement document that they're only related to a text and loosely coupled, so we can simplify a lot.
