# Talepreter in Web

created with Angular CLI, took project sample from https://github.com/nitin27may/mean-docker and then built my own over it

the main reason for the app is to learn Angular, there is already a desktop UI which will be used more than this (due to internal requirements that a web app cannot do => work directly with filesystem).

the look and feel might be very weird but it is done on purpose to match the WPF application which shares very identical view.

## Techstack

MEAN stack as much as possible. database is MongoDB which is not part of this project (neither generating data nor model itself).
Angular and typescript at frontend, Nodejs/Javascript at backend api.
Project lacks some basic functionality but skipped on purpose (like login/register and some issues listed below as TODO). Project will **not** compile, I stripped code that is relevant to me, mainly the domain of Talepreter and modeling. Talepreter Web is not pure-public.

Project is not complete, Anecdote view is still in progress but it will come soon and TODO below will be completed. for now it is checked in and made public. 

## Concepts

**Backend**: this is not UI backend. the model (the real data) is processed by multiple services and data is pushed to MongoDB. the data is processed and generated there. it is a bunch of C# services and not part of this repo
**UI Backend:** this is about a backend for UI, similar to BFF concept. it is "api" folder in repo, nodejs part
**UI:** the browser UI, the "frontend" folder in repo, angular part
**WPF UI:** this is a web UI and there is a WPF built UI too (it is the main UI of Talepreter, not this). the main reason why it is main is because of file system limitations. app must access to filesystem directly and it can be done with WPF for now

## TODO

- **Tale List:** TP backend does not store tale list, user must know tale id. this means TP Web also does not know tale list but it is designed to show any tale. due to this the tale list is hardcoded for now
- **API Results:** all api calls use a special pattern of Message + Data. message is generally 'success' or something else and Data is the result. I do not use/check message for now. so task is to make use of it
- **JWT:** enabling JWT has serious issues. first is about compile, system simply does not compile when enabled. also we lack a login structure. it is single user system so out of requirements but for fun purpose can be added
- **Table Sorting:** table sorting is not implemented as it is just a plain html table but since the data is kept inside component even without paging, we can actually sort easily, it would just be data remapping after a sort.
- **Frozen Time:** (SAME ISSUE IN TP-WPF) some persons like Ingrid has problem about their age category. problem source is the frozen days. the age category does not take that into consideration. best fix is to make age category to calculate that too so both WPF and Web will be able to show it properly
- **Day Calculations in DB:** person model expected to die is always in days. in both WPF/Web we calculate through years but the stored information is in days. this means we cannot run a function to convert that to real date to fetch year and then operate on year. there will be some mismatches. only potential fix is to put year info into model
- **Frontend Dotenv:** frontend does not use dotenv (no idea why, definitely forgotten). it must be enabled so env vars can pass to docker container easily than in build process
- **Messy Model Decorators:** (SAME ISSUE IN TP-WPF) many model decorator functions are very messy. for example we take Actor object but then decorate it a lot to show to UI because of picking stuff from here and there. model itself is designed for backend processing, not for UI itself so this makes the objects on UI (also in WPF). to ease that there are many functions that decorate but then the API result object itself is not same type object. the data returned from API is a very identical object that matches UI model but not entirely same. functions are not on that prototype. so required solution is to somehow attach the functions designed to that identical class. the WPF issue can be ignored here, it is how system is designed (for backend friendly)
- **Mismatching Model/View:** due to various views, db model is needed to be processed to show to UI. this is problem from various perspectives. group and actor stuff is so merged into each other that getting one for one UI means it is very identical for another UI view but also very different in some aspects. this leads to multiple very similar but different models in UI. same model cannot be used due to summarization patterns. right now the heavy processing is done at browser UI (not UI backend). decision is taken arbitrarily, to learn more about angular and typescript, but it could be done at UI backend too. regardless of decision, the models and views mismatch even though they originate from same model data. it is difficult to merge and optimization is done at DB query level (to bring only upmost needed, no unnecessary data) because the merged data queries can really reach sized of 50kb or more. it is wasty if only a small portion is shown. same issue exists at WPF UI as well. db model cannot be changed due to Orleans use and also how system takes artifacts in commands (commands target single entities but in view these entities are merged so it means there is relational data in MongoDB that has to be aggregated all the time). the DB model is friendly to backend and generating data, but not for UI or showing it properly.
- **Teleportation:** this is a new concept and there is no data sample to test (not even in old tales, so it is set as TODO for now)
- **Expander ShadowDom:** expander is a special component, it is a CSS-only component (as much as possible). it has a big issue with the CSS-only requirement: recursion. in actor view and also especially in anecdote view expanders will be nested inside each other. CSS-only messes up because the style makes all elements collapsed/expanded. an isolatin is needed. to "simply" achieve that the ShadowDom is used in expander component. it works for now but there might be some stuff broken about it
