I2TM H5C3 Framework & Applications Changelog
============================================
- Updated version to 0.7.1
- Updated dev.html & index.html (TEMPLATE) to proper HTML5 standard
- Removed gameClass and canvasID parameters from index.html
- Removed code from index.html <BODY>
- Added factory.entity.js - EntityFactory. All entities are created, obtained here.
- Added factory.sound.js - SoundFactory. All sounds are created, played here.
- Updated layout
- Touchpad now rendering properly - Input not getting to target object though?
[COMMITED]

- Updated version to 0.7.2
- Documented EntityFactory
- Swapped Name and Layer parameters on EntityFactory::use()
- Moved use() method into pc.EntityFactory base class
- Added safe function check for overridden create() method to EntityFactory::use()
- Added Remove() to EntityFactory to delete entities from Store
- Added Graceful script exit via:
- Added quit() to game base class
- Added onExit()
- Added code to hide toolbars, menubars,ect and redisplay them on exit
[COMMITED]

- updated version to 0.7.3
- changed pc.device.pcGameDiv() to reload() the page after exiting to force a reset.
- removed changelog.txt from template project
- cleaned up playcraft.js
- removed HTML.[MOBILE & STATIC] constants from device.js
- removed appendHTML() method from device.js
- added wrapperDiv and wrapperDivID to device.js for reference to pcGameDiv
- removed init() method from device.js
- updated pcGameDiv() in device.js since you cannot turn off address bar, ect in current window.
- Rewrote _calcScreenSize in device.js. Works perfectly!
[COMMITED]

- updated version to 0.7.4
- Added Dim variable to game, touchpad and banner classes
- removed old calcScreenSize() method
[COMMITED]

- updated version to 0.7.5
- Started bringing Kuiper Assault up to date with engine changes.
- Added factory.js - A General base class for creating any kind of object factory
- Rewrote SoundFactory (sound.js) & EntityFactory(entity.js) with common base Factory (factory.js) class.
- Updated SoundManger2 to latest & Added flash files
- Created console.js - Will be used across all browsers for unity.
[COMMITED]

- updated version to 0.7.6
- Update, Cleaning and Tweaking on Kuiper Assault
- Added Extended String class [lib\string.js]
- Added StringFactory [lib\string.js]
- Added Resources.xml. Prelude to auto loading/creating of resources
- Added Parsing to lib\device.js [xml to assoc array]
- Removed game.resources.js from game folder.
- Added lib\resources.js - Loads all resources via embedded XML data - no need to code it anymore.
- Updated template to use new resource loading features
[COMMITED]

- updated version to 0.7.7
- Added calls to _super() for Entity & Sound factories.
- Fixed several bugs and some incomplete work with factory and its descendents.
- Updated game.html & index.html to reflect changes
- updated Template source files to reflect changes.
- Added resources.js to production packing
- Added factory.js to production packing
- packed Engine v0.7.7 and template and uploaded to server.
[COMMITED]

- updated version to 0.7.8

Adding a tabbed log/console to engine. Will use FULL css3 for look and
feel. I'm thinking about making the debug panel and console in the same
div with tabs on top. You'll be able to enable/disable. This will allow
catching of errors across any browser or device.

- Added CSS rules for console
- Started device integration
- Added DIVs to HTML
[COMMITED]

- updated version to 0.7.9

Console/Log panel put on hold - Moving Scene Handling from game folder into Game Core. There
is no need for the developer to handle/code the loading scene, publisher, title, menu ect. scenes.
You can however still override it and do your own. Since you are extending, you can let the core
handle the basics and you can add more custom scenes.

- Moved initial loading scene/layer into Game Core class
- Moved SetScene() into Game Core Class
- Moved loadResources() from device.js to resources.js
- Tweaks to device.js dealing with Game Class Object Creation and parameters
[COMMITED]

- updated version to 0.8.0
- Updated SceneID. This definition is required and developer can add more to existing.
- Major Core changes preparing in preparation for moving allot of document code out of device.js and into a page.js file & object
- Moved game resources from global into Game Core Class
- Moved Base Factories (Entity, Sound) into Game Core Class
- Figured out why Loading Screen was not showing..Again. = Fixed.
- Completed template...Up and running again.
- This is a partial commit due to the amount of changes. This is 0.8.0 NOT complete.
[COMMITED]

- Completed version 0.8.0
- Renaming of projects. now have game type (arcade, casual, strategy, ect)
- created new game, Earth Defense, from scratch to see how long it took to get something going, 3 hrs including graphic works. not bad. no done, but it was much easier without having to write code for all the resource loading.
- Major work to engine is done at this time. Back to game programming.
[COMMITED]

- Updated version to 0.8.1
- Updated Browser Support - Only Chrome is supported. All other browser support dropped. See Platforms.txt
- Renamed Engine to H5C3 Framework (HTM5 & CSS3 Framework)
- Moved Publisher & Framework Logo Screens into Engine (res folder)
- Moved i2tm.ogg in to res folder
- Added updated Publisher.png logo (s) HD now included
- Added new H5C3 Framework Logo(s) HD now Included
- Added index.html to all folders. Redirect Page [Security]
- Removed tsImageWidth & tsImageHeight from scene.js - Not being used.
- Removed cx & cy from pc.ImageTools::Rotate() - Not being used.
- Updated ext/Base64.js - _utf8_encode() & _utf8_decode() to latest
- Added gzip.exe (windows/DOS) to tools folder.
- Updated template to run with latest changes.
- Rewrote Publisher Scene. Includes I2TM, H5C3 and optional application splash with fades
- Moved Publisher (intro.js) scene into engine
- Added resources folder to engine. Engine splashes accessed through site directly.
- Completed update of template project. 100% functional.
[COMMITED]

- Updated version to 0.8.2
- Removed platforms.txt - now resides in readme.md
- Removed useragents.txt - not needed.
- Updated readme.md
- Fix bug where release/gz give an error -> Uncaught TypeError: Cannot read property 'active' of undefined 
- Moved touchpad system into engine
- Fixed bug where Resources were being loaded twice
- Worked out issue with Touchpad Button alignments
- Game now extends Main. Main has no States. Game no longer handles loading resources, main does. Main is used for Touchpad or custom applications with no state default state handler
[COMMITED]

- Updated version to 0.8.3
- Renamed game.html to debug.html for developer support - is loads the debug version of the engine with physics debug and console.
- Updated base::log() - no longer writes to browser console (if available) instead writes to integrated debug console.
- Removed debug/console code form release
- Created new pack scripts [pack-release.sh and pack-debug.sh] to both versions
- Rewrote Physics Debug Panel is an overlay
- Completed Console as an overlay with physics debug panel
- Removed packed.js and replaced with _debug.js and _release.js
- Updated debug & release pack scripts
- devMode now detected by pc.DISTRO instead of packed. pc DISTRO can be Production or Development
- Completed new class pc.Page which contains all the HTML document elements & control from pc.device
- Created new pc.Development class - wrapper for profiler, console and statistics
- Started Code cleanup, formatting and documentation
[COMMITED]

- Updated version to 0.8.4
- Continued Code cleanup, formatting and documentation
- Removed pc.ConsolePanel method attach() and moved code into init()
- Added send2Console() & toggleShow() methods to pc.Developer class.
- Completed Integrated Debugger Toolbar (Text for Now)
- Moved Device Orientation code from pc.Device class to pc.Page class
- Updated object creation order in boot() method
- Updated pc.Device.onReady() method.
- Added Try/Catch wrapper to pc.Entity.create() method - (Debug Stability)
- Removed some old doc info from game.js
- Fixed wrong size in PublisherLayer where the width & height of splash were 540 instead of 1080
- Updated pc.Main class methods onAction() & init() to incorporate the Debugger toolbar.
- Added more logging - (Debug Stability)
- Updated pc.Scene class...removed Throw() and added debug() logging - (Debug Stability)
- Started updating Earth Defense project with latest framework changes.
- Removed touchpad code from project(s) EntityFactory class
- Removed deactivating Loading and Publisher Scenes from project(s) main.
[COMMITED]

- Updated version to 0.8.4
- Continued Code cleanup, formatting and documentation
- Renamed PublisherScene to pc.Intro
- Created new pc.Plugin class - this is the first step in completeing the engine, but allowing expansion
- Added options for pc.Main to allow reacting to window focus and internet connection
- Changed namespace from pc to h5c3.
- Removed SoundManager2 - no need since we are focusing on just chrome. Lets save space.
- Added Device Orientation & Motion Support...However if its a false positive the engine will automatically unhook the event to save CPU
- Moved ORIENTATION object from global to h5c3 scope
- Moved SCREEN_CELLS from global to h5c3 scope
- Moved Touchpad System, Scene and Main from global to h5c3 scope
- Deleted zone.js (Zone Class) no longer needed. Page replaced it.
- Integrated Banner bar into Developer Window. When using Developer Version of engine Banner bar is the dev Toolbar, production version is ads.
- Updated CSS rules.
- More work on Integrated Developer Window
- Removed old pack.sh scripts and replaced with a new single smart publish.sh script
- Updated all sources to make sure debug calls are on single line for removal in release version.
[COMMITED]

- Updated version to 0.8.5
- Continued Code cleanup, formatting and documentation
- Moved VERSION and DISTO into h5c3 object
- Dropping Touchpad seperate canvas support...moving to single canvas for fullscreen support.
- Major improvements to Developer Window.
- Added screenful.js to EXT (fullscreen wrapper API)
- Removed WebApp splash from intro.js. Splash is now the 1/4 HD image clicked on to run WebApp from website.
- Fixed bug where Statistics in Integrated debugger where not readable
- Created new device::loadFile() method to dynamically load files after app is running
- cleaned up app default.css, moved debug css into its own file @ i2tm resources
- default.css is now loaded via i2tm resources
- created Form Plugin - This will skin all form elements for the web app
- added debugger buttons to i2tm resources
- moved touchpad buttons to i2tm resources
- fixed Pause and Resume on focus
[COMMITED]

- Updated version to 0.8.6
- Bug fixes and changes to building library
- Bug fixes and changes to generating documention
- Fixed a few bugs preventing minimized version from running correctly
- Major changes to Engine, Debugger, Developer tools
- Added launcher.html (only for develolpers)
- Added DOM helper function that greatly lower the most popular function calls.
- Changed filesystem structure - moving towards moving components out of engine and into plugins (component/system pairs)
- Removed borders and scrollbars from document
- moved box2dweb from internal to a plugin called Physics
- moved sprintf string library from internal to a plugin called Strings
- moved spin.js from internal to a plugin called Spin.js
- reduced intro splash display times from 5 seconds to 2 seconds
- complete re-write of base document and h5c3 main include (going for simplicity and reduced size)
- removed h5c3.js ... replaced with following:
- added h5c3_debug.js -> included when using local.html (in house only) & debug.html (from server) and i used in building h5c3-debug.js.gz
- added h5c3_release.js -> included when using index.html and i used in building h5c3-release.js.gz
[COMMITED]

- Updated version to 0.8.7
- Added plugins array to webapp config object [h5c3.Bootstrap.go({files:['game.min.js'],plugins:['physics.js']});]
- Added LOCATION to the h5c3 base object, url to h5c3 on server.
- Continued work on handling config object, loading plaugins and scripts.
[COMMITED]

- Updated version to 0.8.8
- Moved input.js from framework back into engine.
- fixes to main include files.
- fixed issues with new build.sh
[COMMITED]

- Updated version to 0.9.0
- h5c3.tools.assert() replaced with $AST()
- h5c3.tools.valid() replaced with $VLD()
- h5c3.tools.checked() replaced with $CHK()
- All systems with thier respected components moved into plugins
- h5c3.systems, h5c3.systems.System, h5c3.systems.EntitySystem moved into framework
- h5c3.components & h5c3.components.Component moved into framework
- h5c3.SystemManager & h5c3.EntityManager moved into framework
- Integrated Debugger moved into plugin debugger.js
- Playcraft gameCore.js source removed from being embeded to 3rd Party folder and built indipendently..uses minimized file.
- Media.js moved to Engine folder
- Entity type now forced to lowercase
- Added Game Project Solwelker, a combination of Solitaire, Bejeweled & Poker
- h5c3.component - Ensure components are set active on creation
- Fixed scaling with canvas.
[COMMITED]

- Updated version to 0.9.1
- Fixed bug with Sound & SoundFactory properly configuring audio and playing.
- Removed SoundManager2 from HTML document credits resource section.
- Removed screenfull.js from ext folder, replaced with internal handling.
- Removed gamecore.min.js from ext folder, it is now included at top of HTML document before h5c3 library is loaded. Totally seperate now.
- Removed base2.js from ext folder, will not be used.
- Created XML catalog for plugins
- Updated h5c3.plugin to support new features
- Changed plugin folder structure
- Cleanup - JSLint on lib/engine source files [accutimer,dataresource,device,input and loader]
[COMMITED]

- Updated version to 0.9.2
- I have no idea what i did! Look at DIFF, i improved it more ;)
[COMMITED]

0.9.3 Update - Plugin system rollback/change
- Had issue with loading a plugins individual files after creating plugin object. Until i get a good solid dynamic script loading system I just included all files for a plugin into a single file.
[COMMITED]

- Updated version to 0.9.4
- Removed: h5c3_*.js - old plugin code that had been commented out.
- added: engine/device.js - onExit() event method now properly shuts down the framework.
- bug fix: helper function $VLD(p) was not testing for undefined correctly.
- bug fix: framework/page.js - proper Game object is now being created.
- updated: engine = changes to debug logging messages.
- updated: h5c3/tools/build.sh - Some wierd problem with permissions on windows 7 professional install. Just added attrib calls
- updated: h5c3/lib/* - several calls to h5c3.devMode changed to h5c3.devMode===VALUE
- updated: h5c3/resources/images/logos*.png - now smaller size
- changed: h5c3/lib/framework/intro.js - dropped intro delay from 2 seconds to 1 second
[COMMITED]

- Updated version to 0.9.5
- Moved debugger into its own project folder and converted to an actual project
- combined h5c3_debug.js and h5c3_release.js into a single h5c3.js file
- build.sh: updated to ignore (remove) all lines of code with debug for production version
- h5c3.js: Removed backwards compatability code -> Function.prototype.bind
- h5c3.js: Removed backwards compatability code -> Array.prototype.indexOf
- plugins/compatability.js: added new file to plugins folder with backwards compatabiity.
- code cleanup /  config jslint -  strict
[COMMITED]

- Updated version to 0.9.6
- Added naitive Google Analytics and adSense
- Rewrote application configuration - no more embeded XML - now an object at top of main application file
- Rewrote Engine/Framework start up
- Added completely new Responsive template system
- Main app configuration is now included in <script> tag of document (last one)
- Added HTML (document) Variable support by adding a class called variable int he HTML element
- Rewrote Bootstrap - much more efficient, alot more options and increased peformance.
- All old projects that I (WANT) to do have been removed from the this repository
- Removed all project tools folders - You will be able to do it all online
- Alot of housekeeping getting ready for Alpha Testing
- Consolidated all external resources at http://h5c3.i2tmlabs.com/
- Updated GitHub README.md - Sorry i went into Info Commercial Mode LOL
- Added property appMode to H5C3 core class. This allows the system to be used for for just webpages, webapps or full blown 2D/3D CloudApps.
- Note: This version is live on i2tmlabs.com for last week internal testing, it is stable.
[COMMITED]

- Updated version to 0.9.7-RC1
- Ended up being an interm commit (LOTS of changes)
[COMMITED]

- Updated version to 0.9.8
- Another Interm Commit; Dropped RC, Now Stabilizing all new features
- Added New Throttling Feature
- Added R2WL (Rich Responsive Web Layer) System
- Upgraded Factory, Add(ing) Worker Class
- Entire new stucture, now setup in Layers, Core->Engine->R2WL->Application->Framework->Plugins
- Completed Google adSense & Analytics intgration
- Cloud Application & Applets are up and working
- New Ajax2, LZW Compression/Decompression
- Updated StackTrace.js
- Created a slew of new Applets for the release / demo site
- Created Compiler for Applications & Applets
- Created Security & Authentication with UUID's
- Assets are now controlled automatically, loaded/unloaded as needed via Throttler & AJAX2
- Seamless web browsing experience, never wait on a page load again!
- Too many more to list, lets just say a butt load.
[COMMITED]

- Updated version to 0.9.9
- Added new SDAL $GQS($dataName,$dataValue) . Its a Shortcut to document.querySelector, but allows you to also give Name and Value to select
- added objToString() method to String.prototype for converting objects into strings (single or multiple line)
- added pad() to String.prototype for padding strings to a given length
- Upgraded Google Integration to detect when google API does not load/or is super slow and get it online automatically
- Added h5c3.BUILT constant. This tells you the last time this current Engine was built.
- Updated Brand Class to display new BUILT feature
- devZONE: created applets Terms of Service, Privacy Policy and added under development to welcome page top
- devZONE: created You are Running applet for branding
- devZONE: added Social Applet
- devZONE: Completed Welcome page with new Up to date info
- devZONE: Completed Introduction-> About H5C3
- Major structure changes to R2WL Layer to support changes to layout & styling
- Added LocalStorage class which handles H5C3 Global options & Files along with Options and Files for individual Applications
- Completed Layout class. Now supports full Absolute layout dynamically. Will also dynamically handle sidebars based on device window size.

TODO: 
	AppletFactory::parse fails on header when there is a Comment or anything before it.
	Applet inside an applet is loaded and validated but not embeded. Fix it.

	Create a Test page with all Elements (grouped) to design typography and skins from
	Create Wizard to walk through typograpy
	Create Wizard to walk through skin

NOTES:
	In H5C3 terminology, Typography is specifing font characteristics via a series of properties such as font (family, size, weight, etc). Properties such as padding,margins are handled automatically by the R2WL Layer of the Engine but can be overridden by the elements class.
	
	A CloudApps appearance can be set by defining it's typography and skin (colors) or by a theme which is a preset typography and skin. But
	
	