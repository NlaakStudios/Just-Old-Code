
/**
 * H5C3 Framework - Forked from Playcraft v0.5.6
 * Playcraft Engine - (C)2012 Playcraft Labs, Inc.
 * See licence.txt for details
 */

/**
 * @class  h5c3.Input
 * 
 * 
 * 
 * This class provides a way of binding and reacting to input in a convenient and device independent way. The
 * engine will automatically construct a single, global input class which is accessible via the global h5c3.device.input.
 * 
 * There are two kinds of inputs that can be handled, actions and states. An action is a single event that occurs
 * as a reaction to an input such as clicking the mouse or pressing a key. Typical actions are having a player jump, or
 * open a door. States are when an input is in an on/off state, such as turning a ship or firing a weapon.
 * 
 * <h5>Actions</h5>
 * Reacting to action involves 'binding' an action, such as 'open door' or 'jump' to an object in the game which will
 * trigger a call to the object's onAction method.
 * 
 * MyGame = h5c3.Game('MyGame',
 * {},
 * {
 *    onLoaded:function (loaded, errored)
 *    {
 *       // bind the jump action to the space key
 *       this.input.bindAction(this, 'jump', 'SPACE');
 *       // as well as a mouse click
 *       this.input.bindAction(this, 'jump', 'MOUSE_LEFT_CLICK');
 *    },
 *
 *    // this onAction method will be called when an action relating to
 *    // this object is triggered
 *    onAction:function(actionName)
 *    {
 *       if (actionName ==== 'jump')
 *       {
 *          // player.jump!
 *       }
 *    }
 *
 * });
 * (end)
 * 
 * <h5>States</h5>
 * States are used to indicate when a key or input control is currently active or not. Typically a state is used
 * when you want to react for the entire time an input is engaged, such as holding down a key to accelerate a car.
 * 
 * To use an input state, bind it to an object the same way you do an action. You will then need to separately check
 * if the state is on at the appropriate time for your game. Most commonly this is done in a process function. See
 * the <a href='h5c3.Game'>game</a>, <a href='h5c3.Layer'>layer</a> or <a href='h5c3.Scene'>scene</a> classes for more
 * information on overriding a process function.
 * 
 * // bind the state to an input and an object
 * this.input.bindState(this, 'moving left', 'LEFT');
 *
 * // check for the state being active in the game, layer or scene process
 * process:function ()
 * {
 *    if (h5c3.device.input.isInputState(this, 'moving left'))
 *       // move the player left
 * }
 * (end)
 * You can see an example of both input actions and states in the Asteroids sample game.
 * 
 * Rather than using this class directly, you can also use the <a href='h5c3.components.Input'>input component</a>
 * and <a href='h5c3.systems.Input'>system</a> which lets you bind input to an entity as a component.
 */
h5c3.Input = h5c3.Base.extend('h5c3.Input',
    /** Interface: h5c3.Input */
    {
		_CLASSNAME: 'Input',
		_CLASSVERSION:'0.1.0',
        _eventPos: null, // cached for speed

        /**
         * Extracts the position from an event (in a cross-browser way),and then sets the passed in pos
         * @param  Object e Event to extract the position from
         * @param  {h5c3.Point} [pos] Position object to set. Leave out to have a new (pooled) point returned
         */
        getEventPosition:function(e, pos)
        {
            if (this._eventPos === null) {
                this._eventPos = h5c3.Point.create(0,0);
			}

            var r = pos;
            if (!VLD(pos)) {
                r = this._eventPos;
			}

            if (e.pageX || e.pageY)
            {
                r.x = e.pageX;
                r.y = e.pageY;
            } else
            {
                r.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                r.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            return r;
        }

    },
    /** Interface: h5c3.Input.prototype */
    {
        /** Current state bindings */
        stateBindings:null,
        /** Currently active states */
        states:null,
        /** Action bindings */
        actionBindings:null,
        /** Current position of the mouse on-screen, updated continuously */
        mousePos: null,
        /** indicates if the left mouse button is currently down */
        mouseLeftButtonDown: false,
        /** indicates if the right mouse button is currently down */
        mouseRightButtonDown: false,
        /** indicates if the middle mouse button is currently down */
        mouseMiddleButtonDown: false,

        init:function ()
        {
            this._super();
            this.stateBindings = new h5c3.Hashtable();
            this.states = new h5c3.Hashtable();
            this.actionBindings = new h5c3.Hashtable();
            this.mousePos = h5c3.Point.create(0,0);
        },

        /**
         * Binds an input state to an object, such as 'turning left' or 'firing' to an input code.
         * You can bind an input to any object, however typically it's to a layer, scene or game. The input will not
         * trigger if the object is not presently active.
         * If you specify a UIElement (optional), the state is only triggered if the event occurs inside
         * the bounds of the element (typically a positional event like a touch start or mouse move)
         * @param  Object obj An object to bind the state to
         * @param  String stateName The name of the state, e.g. "turning left"
         * @param  String input The name of the input, i.e. 'LEFT' (see h5c3.InputType)
         * @param  Object [uiTarget] Optional UI object to bind the input to
         */
        bindState:function (obj, stateName, input, uiTarget)
        {
            if (obj.uniqueId === null) {
                throw "Oops, you can't bind a state to an object if it doesn't have a uniqueId function";
			}

            input = input.toUpperCase();
            // There can be many bindings associated with a particular input, so we see
            // if there is already one, and then append this to the array, otherwise
            // we create the array
            var binding = { stateName:stateName, object:obj, input:input, state:{on:false, event:null}, uiTarget:uiTarget },
				bindingSet = this.stateBindings.get(input);
            if (bindingSet === null) {
                this.stateBindings.put(input, [ binding ]);
			} else {
                // otherwise append a new binding
                bindingSet.push(binding);
			}
            // now setup a state for this object/input combination
            this.states.put(obj.uniqueId + '\\\\' + stateName, {on: false, event: null});

            // if this is a positional type binding, add it to the positional tracking array
            if (h5c3.InputType.isPositional(h5c3.InputType.getCode(input))) {
                this._positionals.push(binding);
			}
        },


        /**
         * Clears any on states related to an object.
         * @param  Object obj The object to clear states for
         */
        clearStates:function (obj)
        {
            var b,i,binding,state,bindingSet,bindings = this.stateBindings.entries();

            for (b=0; b < bindings.length; b++)
            {
                bindingSet = bindings[b];
                for (i = 0; i < bindingSet.length; i++)
                {
                    binding = bindingSet[i];
                    if (binding.object === obj)
                    {
                        state = this.states.get(next.object.uniqueId + '\\\\' + next.stateName);
                        state.on = false;
                        state.event = null;
                        if (h5c3.InputType.isPositional(binding.input)) {
                            h5c3.tools.arrayRemove(this._positionals, binding);
						}
                    }
                }
            }
        },

        /**
         * Returns true if the named state is currently active. If you need anything more than the state boolean
         * use getInputState, which includes the actual event.
         * @param  Object obj Object to check the binding against
         * @param  String stateName A string representing a previously setup state, i.e. 'turning left'
         * @return  Boolean true if the state is currently on (such as a key being down)
         */
        isInputState:function (obj, stateName)
        {
            // lookup is very slow; have to find the state for a certain stateName and object
            // TODO: oops this is creating strings for every check (usually every frame)-- get rid of it
            // add a state property to the bound object and update it when the state changes
            var state = this.states.get(obj.uniqueId + '\\\\' + stateName);
            if (state === null) { throw 'Ooops, unknown state ' + stateName; }
            return state.on;
        },

        /**
         * Gets the present input state object (which includes the event data).
         * @param  Object obj Object to check against (such as a layer, scene or game)
         * @param  String stateName Name of the state to check for
         * @return Object state object containing the state.state and state.event data
         */
        getInputState:function (obj, stateName)
        {
            return this.states.get(obj.uniqueId + '\\\\' + stateName);
        },

        /**
         * Binds an input event to an action and object; e.g. bindAction(playerShip, 'fire', 'CTRL')
         * will trigger an action callback on the playerShip entity when the CTRL key is pressed down.
         * You can bind an input to a layer, scene or entity. The input will not trigger if the object
         * is not presently active.
         * 
         * For positional events (such as a mouse or touch input) the action will only fire if the position
         * of the event is within the bounds of the object (based on a call to getScreenRect). You can optionally
         * provide a uiTarget object to provide a different bounding rectangle. If the object provides no getScreenRect
         * method, then no bounding check will be carried out.
         * 
         * For (start code)
         * var menuLayer = new Layer();                     // a menu layer
         * var menuOption = new TextElement('New Game');    // a menu item
         *
         * // trigger the 'new game' action for the menuLayer, when a mouse click occurs within the menuOption element
         * h5c3.device.input.bindAction(menuLayer, 'new game', 'MOUSE_LEFT_BUTTON', menuOption);
         * (end)
         * Note: If the uiTarget element is not provided, the bounding rectangle of the obj is used (as long as
         * the object provides a getScreenRect() method, otherwise there is no checking
         *
         * @param  {h5c3.Base} obj The entity, layer or scene to bind this action to (must implement onAction)
         * @param  String actionName The name of the action, e.g. 'FIRE' or 'JUMP'
         * @param  String input The input code as a string
         * @param  {h5c3.Base} [uiTarget] An optional element to limit the input to only within the bounds of the element (must
         * implement getScreenRect)
         */
        bindAction:function (obj, actionName, input, uiTarget)
        {
            // There can be many bindings associated with a particular input event, so we see
            // if there is already one, and then append this to the array, otherwise
            // we create the array
            input = input.toUpperCase();

            var bindingSet = this.actionBindings.get(input);
            if (bindingSet === null) {
                this.actionBindings.put(input, [
                    { actionName:actionName, object:obj, input:input, uiTarget:uiTarget }
                ]);
			} else {
                // otherwise append a new binding
                bindingSet.push({ actionName:actionName, input:input, object:obj, uiTarget:uiTarget });
			}
        },

        /**
         * Triggers an action to be fired. Typically this will be fired in response to an input, but it can
         * also be used to simulate an event.
         * @param  Number eventCode event code
         * @param  {Event} event An event object
         */
        fireAction:function (eventCode, event)
        {
            var i,binding,obj,pos,er,bindingSet = this.actionBindings.get(h5c3.InputType.getName(eventCode));
            if (bindingSet === null) { return false; }

            // cycle through all the bindings against this input type and fire the object callbacks
            for (i = 0; i < bindingSet.length; i++)
            {
                binding = bindingSet[i];
                obj = bindingSet[i].object;
                if (!obj.isActive || obj.isActive())
                {
                    // if it's a positional event type (like a mouse down or move, then we only
                    // fire events to objects where the event is within its spatial bounds
                    if (h5c3.InputType.isPositional(eventCode))
                    {
                        pos = this.Class.getEventPosition(event);
                        er = null;
                        if (VLD(binding.uiTarget)) {
                            er = binding.uiTarget.getScreenRect();
						} else {
                            er = obj.getScreenRect ? obj.getScreenRect() : null;
						}

                        if (er && er.containsPoint(pos)) {
                            obj.onAction(binding.actionName, event, pos, binding.uiTarget);
						}
                    } else {
                        obj.onAction(binding.actionName);
					}
                }
            }
            return true;
        },

        /*** INTERNALS **/
        
        _onReady:function ()
        {
			_DBG_("onReady Event.",this.Class);
			/**
			if (h5c3.device.useTouch) {
				h5c3.device.game.canvas.addEventListener('touchstart', this._touchStart.bind(this), true);
				h5c3.device.game.canvas.addEventListener('touchend', this._touchEnd.bind(this), true);
				h5c3.device.game.canvas.addEventListener('touchmove', this._touchMove.bind(this), true);

				h5c3.device.touchpad.canvas.addEventListener('touchstart', this._touchStart.bind(this), true);
				h5c3.device.touchpad.canvas.addEventListener('touchend', this._touchEnd.bind(this), true);
				h5c3.device.touchpad.canvas.addEventListener('touchmove', this._touchMove.bind(this), true);
			} else {		
				// mouse input	
				//fixes a problem where double clicking causes text to get selected on the canvas
				h5c3.device.game.canvas.addEventListener('selectstart', function(event) { event.preventDefault(); return false; }, false);		
				h5c3.device.game.canvas.addEventListener('mouseup', this._mouseUp.bind(this), true);
				h5c3.device.game.canvas.addEventListener('mousedown', this._mouseDown.bind(this), true);
				h5c3.device.game.canvas.addEventListener('mousemove', this._mouseMove.bind(this), true);
				h5c3.device.game.canvas.addEventListener('mousewheel', this._mouseWheel.bind(this), true);
				h5c3.device.game.canvas.addEventListener('contextmenu', this._contextMenu.bind(this), true);
			}
			**/
			h5c3.device.game.obj.attachTouchEvents(this);
            // key input
            window.addEventListener('keydown', this._keyDown.bind(this), true);
            window.addEventListener('keyup', this._keyUp.bind(this), true);
        },

        _positionals: [], // array of bindings that need to be checked against positional events like mouse move and touch

        // Checks the positional event to see if it's a new event INSIDE an on-screen rectangle that has been
        // bound to a state. This is so when a positional event, like a mouse move, 'slides' over an element
        // we can turn the state on, as well as detecting when it slides out of the area of the uiTarget

        _checkPositional: function(moveEvent)
        {
			var i,binding,er,state,state2;
            // check existing tracked states -- did we move out of an element
            for (i=0; i < this._positionals.length; i++)
            {
                binding = this._positionals[i];

                if (moveEvent.type === 'mousemove' && h5c3.InputType.isTouch(h5c3.InputType.getCode(binding.input))) {
                    continue;
				}

                if (moveEvent.type === 'touchmove' && !h5c3.InputType.isTouch(h5c3.InputType.getCode(binding.input))) {
                    continue;
				}

                if (h5c3.InputType.getCode(binding.input) === h5c3.InputType.MOUSE_BUTTON_LEFT_UP ||
                    h5c3.InputType.getCode(binding.input) === h5c3.InputType.MOUSE_BUTTON_LEFT_DOWN ||
                    h5c3.InputType.getCode(binding.input) === h5c3.InputType.MOUSE_BUTTON_RIGHT_UP ||
                    h5c3.InputType.getCode(binding.input) === h5c3.InputType.MOUSE_BUTTON_RIGHT_DOWN ||
                    h5c3.InputType.getCode(binding.input) === h5c3.InputType.MOUSE_BUTTON_MIDDLE_UP ||
                    h5c3.InputType.getCode(binding.input) === h5c3.InputType.MOUSE_BUTTON_MIDDLE_DOWN ||
                    h5c3.InputType.getCode(binding.input) === h5c3.InputType.MOUSE_CLICK
                    ) {
                    continue;
				}

                er = null;
                if (VLD(binding.uiTarget)) {
                    er = binding.uiTarget.getScreenRect();
                } else {
                    er = binding.object.getScreenRect ? binding.object.getScreenRect() : null;
				}

                if (er)
                {
                    if (!er.containsPoint( this.Class.getEventPosition(moveEvent) ))
                    {
                        // no longer in the right position, turn state off
                        state = this.states.get(binding.object.uniqueId + '\\\\' + binding.stateName);
                        state.on = false;
                        state.event = moveEvent;
                    } else {
                        // moved into position, turn back on
                        state2 = this.states.get(binding.object.uniqueId + '\\\\' + binding.stateName);
                        state2.on = true;
                        state2.event = moveEvent;
                    }
                }
            }
        },

        _changeState:function (eventCode, stateOn, event)
        {
            // grab all the bindings to this event code
            var i,bindingSet,binding,pos,er,state,keyName = h5c3.InputType.getName(eventCode);
            if (keyName === null)
            {
                this.warn("Unknown keycode = " + eventCode);
                return false;
            }

            bindingSet = this.stateBindings.get(keyName);
            //this.debug('change state = ' + this.inputType.getName(event.keyCode,+ ' bindings=' + bindingSet));
            if (bindingSet === null) { return false; }

            // cycle through all the bindings against this input type and change the state
            for (i = 0; i < bindingSet.length; i++)
            {
                binding = bindingSet[i];
                if (!binding.object.isActive || binding.object.isActive())
                {
                    if (h5c3.InputType.isPositional(eventCode))
                    {
                        // if binding has a uiElement, then make sure the event hit is within the on-screen
                        // rectangle
                        pos = this.Class.getEventPosition(event);
                        er = null;

                        if (VLD(binding.uiTarget)) {
                            er = binding.uiTarget.getScreenRect();
                        } else {
                            er = binding.object.getScreenRect ? binding.object.getScreenRect() : null;
						}

                        if (er)
                        {
                            if (er.containsPoint(pos))
                            {
                                state = this.states.get(binding.object.uniqueId + '\\\\' + binding.stateName);
                                state.on = stateOn;
                                state.event = event;
                            }
                        } else
                        {
                            // positional, but no uiTarget
                            state = this.states.get(binding.object.uniqueId + '\\\\' + binding.stateName);
                            state.on = stateOn;
                            state.event = event;
                        }
                    }
                    else
                    {
                        state = this.states.get(binding.object.uniqueId + '\\\\' + binding.stateName);
                        state.on = stateOn;
                        state.event = event;
                    }
                }
            }
            return true;
        },

        _lastMouseMove: null,

        /**
         * Called by the h5c3.device main loop to process any move events received. We only handle events
         * here so they are processed once per cycle, not every time we get them (i.e. stop handling
         * a flood of mouse move or touch events
         */
        process: function()
        {
            if (this._lastMouseMove)
            {
                this._checkPositional(this._lastMouseMove);
                this.fireAction(h5c3.InputType.MOUSE_MOVE, this._lastMouseMove);
                this.Class.getEventPosition(this._lastMouseMove, this.mousePos);
                this._lastMouseMove = null;
            }
        },

        ///////////////////////////////////////////////////////////////////////////////////
        //
        //  EVENT HANDLERS
        //
        ///////////////////////////////////////////////////////////////////////////////////

        _keyDown:function (event)
        {
            if (this._changeState(event.keyCode, true, event)) {
                event.preventDefault();
			}

            if (this.fireAction(event.keyCode, event)) {
                event.preventDefault();
			}
        },

        _keyUp:function (event)
        {
            if (this._changeState(event.keyCode, false, event)) {
                event.preventDefault();
			}
        },

        _touchStart:function (event)
        {
			var i;
            for(i=0, len=event.touches.length; i < len; i++)
            {
                this._changeState(h5c3.InputType.TOUCH, true, event.touches[i]);
                this.fireAction(h5c3.InputType.TOUCH, event.touches[i]);
            }
            event.preventDefault();
        },

        _touchEnd:function (event)
        {
			var i;
            for(i=0, len=event.changedTouches.length; i < len; i++) {
                this._changeState(h5c3.InputType.TOUCH, false, event.changedTouches[i]);
			}
            event.preventDefault();
        },

        _touchMove:function (event)
        {
			var i;
            for(i=0, len=event.touches.length; i < len; i++) {
                this._checkPositional(event.touches[i]);
			}
            event.preventDefault();
        },

		_mouseButton:function (event, down) 
		{
           switch (event.button) 
		   {
                case 0: //Left Button
                    this._changeState(h5c3.InputType.MOUSE_BUTTON_LEFT_DOWN, down, event);
                    this._changeState(h5c3.InputType.MOUSE_BUTTON_LEFT_UP, !down, event);
                    this.fireAction(h5c3.InputType.MOUSE_BUTTON_LEFT_DOWN, event);
                    this.mouseLeftButtonDown = true;
                break;
                case 1: //Middle Button
                    this._changeState(h5c3.InputType.MOUSE_BUTTON_MIDDLE_DOWN, down, event);
                    this._changeState(h5c3.InputType.MOUSE_BUTTON_MIDDLE_UP, !down, event);
                    this.fireAction(h5c3.InputType.MOUSE_BUTTON_MIDDLE_DOWN, event);
                    this.mouseMiddleButtonDown = true;
                break;
                case 2: //Right Button
                    this._changeState(h5c3.InputType.MOUSE_BUTTON_RIGHT_DOWN, down, event);
                    this._changeState(h5c3.InputType.MOUSE_BUTTON_RIGHT_UP, !down, event);
                    this.fireAction(h5c3.InputType.MOUSE_BUTTON_RIGHT_DOWN, event);
                    this.mouseRightButtonDown = true;
                break;         
            }

            this.fireAction(h5c3.InputType.MOUSE_CLICK, event);
            // turn off specific states
            event.preventDefault();
		},
		
        _mouseUp:function (event)
        {
			this._mouseButton(event,false);
        },

        _mouseDown:function (event)
        {
			this._mouseButton(event,true);
        },

        _mouseMove:function (event)
        {
            this._lastMouseMove = event;
            event.preventDefault();
        },
				
        _contextMenu: function(event)
        {
            this._changeState(h5c3.InputType.MOUSE_BUTTON_RIGHT_UP, true, event);
            this.fireAction(h5c3.InputType.MOUSE_BUTTON_RIGHT_DOWN, event);
        },

        _mouseWheel:function (event)
        {
            if (event.wheelDelta > 0) {
                this.fireAction(h5c3.InputType.MOUSE_WHEEL_UP, event);
            } else {
                this.fireAction(h5c3.InputType.MOUSE_WHEEL_DOWN, event);
			}	
            event.preventDefault();
        }
    });

h5c3.InputType = h5c3.Base.extend('h5c3.InputType',
    {
        // STATICS
        nameToCode:null,
        codeToName:null,

        POSITIONAL_EVENT_START:     1000,
        MOUSE_MOVE:                 1100, // Basic mouse movement
		MOUSE_CLICK:				1110,
        MOUSE_BUTTON_LEFT_UP:       1200,
        MOUSE_BUTTON_LEFT_DOWN:     1201,
        MOUSE_BUTTON_RIGHT_UP:      1220,
        MOUSE_BUTTON_RIGHT_DOWN:    1221,
        MOUSE_BUTTON_MIDDLE_UP:     1230,
        MOUSE_BUTTON_MIDDLE_DOWN:   1231,
        MOUSE_WHEEL_UP:             1300,
        MOUSE_WHEEL_DOWN:           1301,
		
        TOUCH:                      1000,
        TOUCH_MOVE:                 1001,
        TOUCH_START:                1002,
        TOUCH_END:                  1003,
        TOUCH_CANCEL:               1004,
        TOUCH_LEAVE:                1005,

        init:function ()
        {
			var c,ch;
            this.nameToCode = new h5c3.Hashtable();
            this.codeToName = new h5c3.Hashtable();

            this.addInput(8, 'BACKSPACE');
            this.addInput(9, 'TAB');
            this.addInput(13, 'ENTER');
            this.addInput(16, 'SHIFT');
            this.addInput(17, 'CTRL');
            this.addInput(18, 'ALT');
            this.addInput(19, 'PAUSE');
            this.addInput(20, 'CAPS');
            this.addInput(27, 'ESC');
            this.addInput(32, 'SPACE');
            this.addInput(33, 'PAGE_UP');
            this.addInput(34, 'PAGE_DOWN');
            this.addInput(35, 'END');
            this.addInput(36, 'HOME');
            this.addInput(37, 'LEFT');
            this.addInput(38, 'UP');
            this.addInput(39, 'RIGHT');
            this.addInput(40, 'DOWN');
            this.addInput(45, 'INSERT');
            this.addInput(46, 'DELETE');

            // add alphanumierics
            for (c=48; c < 91; c++)
            {
                ch = String.fromCharCode(c);
                this.addInput(c, ch);
            }

            this.addInput(91, 'WINDOW_LEFT');
            this.addInput(92, 'WINDOW_RIGHT');
            this.addInput(93, 'SELECT');
            this.addInput(96, 'NUM_0');
            this.addInput(97, 'NUM_1');
            this.addInput(98, 'NUM_2');
            this.addInput(99, 'NUM_3');
            this.addInput(100, 'NUM_4');
            this.addInput(101, 'NUM_5');
            this.addInput(102, 'NUM_6');
            this.addInput(103, 'NUM_7');
            this.addInput(104, 'NUM_8');
            this.addInput(105, 'NUM_9');
            this.addInput(106, '*');
            this.addInput(107, '+');
            this.addInput(109, '-');
            this.addInput(110, '.');
            this.addInput(111, '/');
            this.addInput(112, 'F1');
            this.addInput(113, 'F2');
            this.addInput(114, 'F3');
            this.addInput(115, 'F4');
            this.addInput(116, 'F5');
            this.addInput(117, 'F6');
            this.addInput(118, 'F7');
            this.addInput(119, 'F8');
            this.addInput(120, 'F9');
            this.addInput(121, 'F10');
            this.addInput(122, 'F11');
            this.addInput(123, 'F12');
            this.addInput(144, 'NUM_LOCK');
            this.addInput(145, 'SCROLL_LOCK');
            this.addInput(186, ';');
            this.addInput(187, '=');
            this.addInput(188, ',');
            this.addInput(189, '-');
            this.addInput(190, '.');
            this.addInput(191, '/');
            this.addInput(192, '`');
            this.addInput(219, '[');
            this.addInput(220, '\\');
            this.addInput(221, ']');
            this.addInput(222, '\'');

            this.addInput(this.TOUCH, 'TOUCH');
//            this.addInput(this.TOUCH_MOVE, 'touchmove');
//            this.addInput(this.TOUCH_START, 'touchstart'); 
//            this.addInput(this.TOUCH_END, 'touchend');
//            this.addInput(this.TOUCH_CANCEL, 'touchcancel'); 
//            this.addInput(this.TOUCH_LEAVE, 'touchleave'); 

            this.addInput(this.MOUSE_BUTTON_LEFT_DOWN, 'MOUSE_BUTTON_LEFT_DOWN');
            this.addInput(this.MOUSE_BUTTON_LEFT_UP, 'MOUSE_BUTTON_LEFT_UP');
            this.addInput(this.MOUSE_BUTTON_RIGHT_DOWN, 'MOUSE_BUTTON_RIGHT_DOWN');
            this.addInput(this.MOUSE_BUTTON_RIGHT_UP, 'MOUSE_BUTTON_RIGHT_UP');
            this.addInput(this.MOUSE_BUTTON_MIDDLE_DOWN, 'MOUSE_BUTTON_MIDDLE_DOWN');
            this.addInput(this.MOUSE_BUTTON_MIDDLE_UP, 'MOUSE_BUTTON_MIDDLE_UP');
            this.addInput(this.MOUSE_WHEEL_UP, 'MOUSE_WHEEL_UP');
            this.addInput(this.MOUSE_WHEEL_DOWN, 'MOUSE_WHEEL_DOWN');
            this.addInput(this.MOUSE_MOVE, 'MOUSE_MOVE');
            this.addInput(this.MOUSE_CLICK, 'MOUSE_CLICK');
        },

        isTouch:function(inputCode)
        {
            return inputCode === this.TOUCH;
        },

        isPositional:function (inputCode)
        {
            return inputCode >= this.POSITIONAL_EVENT_START;
        },

        /**
         * Private utility method used by the constructor to add the input codes and lookup
         * names to both indexes/hash tables
         * @param  inputCode event input code (i.e. event.keyCode)
         * @param  inputName the human name of the input
         */
        addInput:function (inputCode, inputName)
        {
            this.codeToName.put(inputCode, inputName);
            this.nameToCode.put(inputName, inputCode);
        },

        /**
         * Returns the name of an input based on the event code
         * @param  inputCode
         */
        getName:function (inputCode)
        {
            return this.codeToName.get(inputCode);
        },

        /**
         * Returns the code of an input based on the input name
         * @param  inputName
         */
        getCode:function (inputName)
        {
            return this.nameToCode.get(inputName);
        }

    },
    {}
);
