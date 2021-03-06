(function(){


yepnope({
    load: 'plugins/arduino.css'
});

    // This file depends on the runtime extensions, which should probably be moved into this namespace rather than made global

    // remove UI we don't use (Maybe JS plugin should *add* this?)
    $('.goto_stage, .runScripts, .tab_bar_2, .stage').remove();
    
// expose these globally so the Block/Label methods can find them
window.choiceLists = {
    /*keys: 'abcdefghijklmnopqrstuvwxyz0123456789*+-./'
        .split('').concat(['up', 'down', 'left', 'right',
        'backspace', 'tab', 'return', 'shift', 'ctrl', 'alt', 
        'pause', 'capslock', 'esc', 'space', 'pageup', 'pagedown', 
        'end', 'home', 'insert', 'del', 'numlock', 'scroll', 'meta']),*/
    highlow: ['HIGH', 'LOW'],
    inoutput: ['INPUT', 'OUTPUT'],
    onoff: ['ON', 'OFF'],
    logic: ['true', 'false'],
    digitalpins: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,'A0','A1','A2','A3','A4','A5'],
    analoginpins: ['A0','A1','A2','A3','A4','A5'],
    pwmpins: [3, 5, 6, 9, 10, 11],
    baud:[9600, 300, 1200, 2400, 4800, 14400, 19200, 28800, 38400, 57600, 115200],
    analogrefs:['DEFAULT', 'INTERNAL', 'INTERNAL1V1', 'INTERNAL2V56', 'EXTERNAL']
};

window.setDefaultScript = function(script){
    window.defaultscript = script; 
};

window.loadDefaultScript = function(script){
    if (typeof window.defaultscript != 'undefined'){
        loadScriptsFromObject(window.defaultscript);
    }
};

window.updateScriptsView = function(){
    var blocks = $('.workspace:visible .scripts_workspace > .wrapper');
    var view = $('.workspace:visible .scripts_text_view');
    blocks.writeScript(view);
};

jQuery.fn.extend({
  wrapScript: function(){
      // wrap the top-level script to prevent leaking into globals
      var script = this.map(function(){return $(this).extract_script();}).get().join('\n\n');
      return script;
  },
  writeScript: function(view){
      view.html('<code><pre class="script_view">' + this.wrapScript() +  '</pre></code>');
  }
});

function clearScripts(event, force){
    if (force || confirm('Throw out the current script?')){
        $('.workspace:visible > *').empty();
        $('.stage').replaceWith('<div class="stage"></div>');
    }
}

function clearScriptsDefault(event, force){
  clearScripts(event, force);
  loadDefaultScript();  
}


$('.clearScripts').click(clearScriptsDefault);


    menu('Control', [
        {
            blocktype: 'eventhandler',
            labels: ['Setup - When program starts'], 
            script: 'void setup()\n{\n[[1]]\n}\n',
            help: 'Start scripts when program starts'
        },
        {
            blocktype: 'eventhandler',
            labels: ['Main loop'], 
            script: 'void loop()\n{\n[[1]]\n}\n',
            help: 'Trigger for main loop'
        },
        {
            blocktype: 'eventhandler',
            labels: ['Global Settings'], 
            script: '/*Global Settings*/\n\n[[1]]\n\n',
            help: 'Trigger for blocks in global setup'
        },
        //unique id?
        {
            blocktype: 'step',
            label: 'broadcast [string:ack] message', 
            script: '{{1}}();',
            help: 'Send a message to all listeners'
        },
        {
            blocktype: 'eventhandler',
            labels: ['when I receive [string:ack] message'], 
            script: 'function {{1}}(){\n[[next]]\n}',
            help: 'Trigger for blocks to run when message is received'
        },
        {
            blocktype: 'context',
            labels: ['forever if [boolean:false]'], 
            script: 'while({{1}}){\n[[1]]\n}',
            help: 'loop until condition fails'
        },
        {
            blocktype: 'context',
            labels: ['if [boolean]'], 
            script: 'if({{1}}){\n[[1]]\n}',
            help: 'only run blocks if condition is true'
        },
        {
            blocktype: 'context',
            labels: ['if [boolean]', 'else'], 
            script: 'if({{1}}){\n[[1]]\n}else{\n[[2]]\n}',
            help: 'run first set of blocks if condition is true, second set otherwise'
        },
        {
            blocktype: 'context',
            labels: ['repeat until [boolean]'],
            script: 'while(!({{1}})){\n[[1]]\n}',
            help: 'loop until condition is true'
        }
    ], false);
    
    
    menu('Timing', [
        {
            blocktype: 'step',
            label: 'wait [int:1] secs', 
            script: 'delay(1000*{{1}});',
            help: 'pause before running subsequent blocks'
        },
        {
            blocktype: 'expression',
            label: 'Milliseconds since program started', 
            type: 'int', 
            script: '(millis())',
            help: 'int value of time elapsed'
        },
        {
            blocktype: 'expression',
            label: 'Seconds since program started', 
            type: 'int', 
            script: '(int(millis()/1000))',
            help: 'int value of time elapsed'
        }
        
    ]);
    
    menu('Electronic Interface', [
        {
            blocktype: 'step',
            label: 'Create digital_output## on Pin [choice:digitalpins]', 
            script: 'digital_output## = "{{1}}"; pinMode(digital_output##, OUTPUT);',
            help: 'Create a named pin set to output',
            returns: {
                blocktype: 'expression',
                label: 'digital_output##',
                script: 'digital_output##',
                type: 'string'
            }
        },
        /*
        {
            blocktype: 'step',
          	label: 'Set Digital Pin [string] [choice:highlow]', 
          	script: 'digitalWrite({{1}}, {{2}});',
          	help: 'Write a value to given pin'
        },
        */
        {
            blocktype: 'step',
          	label: 'Digital Pin [string] ON if [boolean]', 
          	script: 'if({{2}} == HIGH)\n{\ndigitalWrite({{1}}, HIGH);\n}\nelse\n{\ndigitalWrite({{1}}, LOW);\n}\n',
          	help: 'Write a boolean value to given pin'
        },
        
        {
            blocktype: 'step',
            label: 'Create digital_input## on Pin [choice:digitalpins]', 
            script: 'digital_input## = "{{1}}"; pinMode(digital_input##, INPUT);',
            help: 'Create a named pin set to input',
            returns: {
                blocktype: 'expression',
                label: 'digital_input##',
                script: 'digital_input##',
                type: 'string'
            }
        },
        
        {
            blocktype: 'expression',
            label: 'Digital Pin [string]',
            //label: 'Is Pin [string] HIGH',
            type: 'boolean', 
            script: '(digitalRead({{1}}) == HIGH)',
            help: 'Is the digital input pin ON'
        },
        
        
        {
            blocktype: 'step',
            label: 'Create analog_input## on Pin [choice:analoginpins]', 
            script: 'analog_input## = "{{1}}"; pinMode(analog_input##, INPUT);',
            help: 'Create a named pin set to input',
            returns: {
                blocktype: 'expression',
                label: 'analog_input##',
                script: 'analog_input##',
                type: 'string'
            }
        },
        
        {
            blocktype: 'expression',
            label: 'Analog Pin [string]', 
            type: 'int', 
            script: '(analogRead({{1}}))',
            help: 'Value of analog pin'
        },
        
        {
            blocktype: 'step',
            label: 'Create analog_output## on Pin [choice:pwmpins]', 
            script: 'analog_output## = "{{1}}"; pinMode(analog_output##, OUTPUT);',
            help: 'Create a named pin set to output',
            returns: {
                blocktype: 'expression',
                label: 'analog_output##',
                script: 'analog_output##',
                type: 'string'
            }
        },
        
        {
            blocktype: 'step',
          	label: 'Analog [string] outputs [int:255]', 
          	script: 'analogWrite({{1}}, {{2}});',
          	help: 'Set value of a pwm pin'
        }
    ]);
    
    menu('Variables', [
        {
            blocktype: 'step',
          	label:'Create [string:var] set to [string]',
          	script: "String {{1}} = '{{2}}';",
          	help: 'Create a string variable'
        },
        {
            blocktype: 'step',
          	label:'[string:var] = [string]',
          	script: "{{1}} = '{{2}}';",
          	help: 'Change the value of an already created string variable'
        },
        {
            blocktype: 'expression',
          	label:'value of [string:var]',
          	type : 'string',
          	script: "{{1}}",
          	help: 'Get the value of a string variable'
        },
        {
            blocktype: 'step',
          	label:'Create [string:var] set to [int:0]',
          	script: "int {{1}} = {{2}}'",
          	help: 'Create an integer variable'
        },
        {
            blocktype: 'step',
          	label:'[string:var] = [int:0]',
          	script: "{{1}} = {{2}};",
          	help: 'Change the value of an already created integer variable'
        },
        {
            blocktype: 'expression',
          	label:'value of [string:var]',
          	type : 'int',
          	script: "{{1}}",
          	help: 'Get the value of an integer variable'
        },
        
        {
            blocktype: 'step',
          	label:'Create [string:var] set to [float:0.0]',
          	script: "float {{1}} = {{2}}",
          	help: 'Create a decimal variable'
        },
        {
            blocktype: 'step',
          	label:'[string:var] = [float:0.0]',
          	script: "{{1}} = {{2}};",
          	help: 'Change the value of an already created deciaml variable'
        },
        {
            blocktype: 'expression',
          	label:'value of [string:var]',
          	type : 'float',
          	script: "{{1}}",
          	help: 'Get the value of a decimal variable'
        },
        {
            blocktype: 'step',
         	label:'Create [string:var] set to [boolean:false]',
         	script: "int {{1}} = {{2}};",
          	help: 'Create a new true or false variable'
        },
        {
            blocktype: 'step',
          	label:'[string:var] = [boolean:false]',
         	script: "{{1}} = {{2}};",
          	help: 'Change the value of an already created true or false variable'
        },
        {
            blocktype: 'expression',
          	label:'value of [string:var]',
          	type : 'boolean',
          	script: "{{1}}",
          	help: 'Get the value of a true or false variable'
        }
      ]);
      
    menu('Operators', [
        {
            blocktype: 'expression',
            label: '[number:0] + [number:0]', 
            type: 'number', 
            script: "({{1}} + {{2}})",
            help: 'Add two numbers'
        },
        {
            blocktype: 'expression',
            label: '[number:0] - [number:0]', 
            type: 'number', 
            script: "({{1}} - {{2}})",
            help: 'Subtract two numbers'
        },
        {
            blocktype: 'expression',
            label: '[number:0] * [number:0]', 
            type: 'number', 
            script: "({{1}} * {{2}})",
            help: 'Multiply two numbers'
        },
        {
            blocktype: 'expression',
            label: '[number:0] / [number:0]',
            type: 'number', 
            script: "({{1}} / {{2}})",
            help: 'Divide two numbers'
        },
        {
            blocktype: 'expression',
            label: 'pick random [number:1] to [number:10]', 
            type: 'number', 
            script: "(random({{1}}, {{2}}))",
            help: 'Generate a random number between two other numbers'
        },
        {
            blocktype: 'step',
            label: 'set seed for random numbers to [number:1]', 
            script: "(randomSeed({{1}}))",
            help: ''
        },
        {
            blocktype: 'expression',
            label: '[number:0] < [number:0]', 
            type: 'boolean', 
            script: "({{1}} < {{2}})",
            help: 'Check if one number is less than another'
        },
        {
            blocktype: 'expression',
            label: '[number:0] = [number:0]', 
            type: 'boolean', 
            script: "({{1}} == {{2}})",
            help: 'Check if one number is equal to another'
        },
        
        {
            blocktype: 'expression',
            label: '[number:0] > [number:0]', 
            type: 'boolean', 
            script: "({{1}} > {{2}})",
            help: 'Check if one number is greater than another'
        },
        {
            blocktype: 'expression',
            label: '[boolean] and [boolean]', 
            type: 'boolean', 
            script: "({{1}} && {{2}})",
            help: 'Check if both are true'
        },
        {
            blocktype: 'expression',
            label: '[boolean] or [boolean]', 
            type: 'boolean', 
            script: "({{1}} || {{2}})",
            help: 'Check if one is true'
        },
        {
            blocktype: 'expression',
            label: 'not [boolean]', 
            type: 'boolean', 
            script: "(! {{1}})",
            help: 'Not true is false and Not false is true'
        },
        {
            blocktype: 'expression',
            label: '[number:0] mod [number:0]', 
            type: 'number', 
            script: "({{1}} % {{2}})",
            help: 'Gives the remainder from the division of these two number'
        },
        
        {
            blocktype: 'expression',
            label: 'round [number:0]', 
            type: 'int', 
            script: "(int({{1}}))",
            help: 'Gives the whole number, without the decimal part'
        },
        {
            blocktype: 'expression',
            label: 'absolute of [number:10]', 
            type: 'number', 
            script: "(abs({{1}}))",
            help: 'Gives the positive of the number'
        },
        {
            blocktype: 'expression',
            label: 'cosine of [number:10] degrees', 
            type: 'float', 
            script: '(cos((180 / {{1}})/ 3.14159))',
            help: 'Gives the cosine of the angle'
        },
        {
            blocktype: 'expression',
            label: 'sine of [number:10] degrees', 
            type: 'float', 
            script: '(sin((180 / {{1}})/ 3.14159))',
            help: 'Gives the sine of the angle'
        },
        {
            blocktype: 'expression',
            label: 'tangent of [number:10] degrees', 
            type: 'float', 
            script: '(tan((180 / {{1}})/ 3.14159))',
            help: 'Gives the tangent of the angle given'
        },
        {
            blocktype: 'expression',
            label: '[number:10] to the power of [number:2]', 
            type: 'number', 
            script: '(pow({{1}}, {{2}}))',
            help: 'Gives the first number multiplied by itself the second number of times'
        },
        {
            blocktype: 'expression',
            label: 'square root of [number:10]', 
            type: 'float', 
            script: '(sqrt({{1}}))',
            help: 'Gives the two numbers that if multiplied will be equal to the number input'
        },
        {
            blocktype: 'expression',
            label: '[number:10] as string', 
            type: 'string', 
            script: '{{1}}',
            help: 'Allows you to use a numeric result as a string'
        },
        {
            blocktype: 'expression',
          	label: 'Map [number] from Analog in to Analog out',
          	type: 'number',
          	script: 'map({{1}}, 0, 1023, 0, 255)',
          	help: ''
        },
        {
            blocktype: 'expression',
          	label: 'Map [number] from [number:0]-[number:1023] to [number:0]-[number:255] ',
          	type: 'number',
          	script: 'map({{1}}, 0, 1023, 0, 255)',
            help: ''
        }
    ]);
    
    menu('Serial', [
        {
            blocktype: 'step',
          	label: 'Setup serial communication at [choice:baud]', 
          	script: "Serial.begin({{1}});",
            help: 'Eanble serial communications at a chosen speed'
        },
        {
            blocktype: 'step',
          	label: 'Send [any:Message] as a line', 
          	script: "Serial.println({{1}});",
            help: 'Send a message over the serial connection followed by a line return'
        },
        {
            blocktype: 'step',
          	label: 'Send [any:Message]', 
          	script: "Serial.print({{1}});",
            help: 'Send a message over the serial connection'
        },
        {
            blocktype: 'expression',
          	label: 'Message Value', 
          	type: 'string',
          	script: "Serial.read()",
          	help: 'Read a message from the serial connection'
        },
        {
            blocktype: 'step',
          	label: 'End serial communication', 
            script: "Serial.end();",
          	help: 'Disable serial communications'
        }
    ]);


var defaultscript=[{"klass":"control","label":"Global Settings","script":"/*Global Settings*/\u000a\u000a[[next]]\u000a\u000a","containers":0,"trigger":true,"sockets":[],"contained":[],"next":""},{"klass":"control","label":"Setup - When program starts","script":"void setup()\u000a{\u000a[[next]]\u000a}\u000a","containers":0,"trigger":true,"sockets":[],"contained":[],"next":""},{"klass":"control","label":"Main loop","script":"void loop()\u000a{\u000a[[1]]\u000a}\u000a","containers":1,"trigger":true,"sockets":[],"contained":[""],"next":""}];
setDefaultScript(defaultscript);

var demos = [
    {
      title:"AnalogInOutSerial",
      description:"first example in Arduino IDE",
      scripts:[{"klass":"control","label":"Global Settings","script":"/*Global Settings*/\u000a\u000a[[next]]\u000a\u000a","containers":0,"trigger":true,"sockets":[],"contained":[],"next":{"klass":"variables","label":"Create [string:var] set to [string]","script":"String {{1}} = '{{2}}';","containers":0,"sockets":["analogInPin","0"],"contained":[],"next":{"klass":"variables","label":"Create [string:var] set to [string]","script":"String {{1}} = '{{2}}';","containers":0,"sockets":["analogOutPin","9"],"contained":[],"next":{"klass":"variables","label":"Create [string:var] set to [int:0]","script":"int {{1}} = {{2}}'","containers":0,"sockets":["sensorValue","0"],"contained":[],"next":{"klass":"variables","label":"Create [string:var] set to [int:0]","script":"int {{1}} = {{2}}'","containers":0,"sockets":["outputValue","0"],"contained":[],"next":""}}}}},{"klass":"control","label":"Setup - When program starts","script":"void setup()\u000a{\u000a[[next]]\u000a}\u000a","containers":0,"trigger":true,"sockets":[],"contained":[],"next":{"klass":"serial","label":"Setup serial communication at [choice:baud]","script":"Serial.begin({{1}});","containers":0,"sockets":["9600"],"contained":[],"next":""}},{"klass":"control","label":"Main loop","script":"void loop()\u000a{\u000a[[1]]\u000a}\u000a","containers":1,"trigger":true,"sockets":[],"contained":[{"klass":"variables","label":"[string:var] = [int:0]","script":"{{1}} = {{2}};","containers":0,"sockets":["sensorValue",{"klass":"io","label":"Analog Input [string:0]","script":"(analogRead({{1}}))","containers":0,"type":"int","sockets":[{"klass":"variables","label":"value of [string:var]","script":"{{1}}","containers":0,"type":"string","sockets":["analogInPin"],"contained":[],"next":""}],"contained":[],"next":""}],"contained":[],"next":{"klass":"variables","label":"[string:var] = [int:0]","script":"{{1}} = {{2}};","containers":0,"sockets":["outputValue",{"klass":"operators","label":"round [number:10]","script":"(int({{1}}))","containers":0,"type":"int","sockets":[{"klass":"operators","label":"Map [number] from Analog in to Analog out","script":"map({{1}}, 0, 1023, 0, 255)","containers":0,"type":"number","sockets":[{"klass":"variables","label":"value of [string:var]","script":"{{1}}","containers":0,"type":"int","sockets":["sensorValue"],"contained":[],"next":""}],"contained":[],"next":""}],"contained":[],"next":""}],"contained":[],"next":{"klass":"serial","label":"Send [any:Message] as a line","script":"Serial.println({{1}});","containers":0,"sockets":[{"klass":"variables","label":"value of [string:var]","script":"{{1}}","containers":0,"type":"int","sockets":["outputValue"],"contained":[],"next":""}],"contained":[],"next":""}}}],"next":""}]
    }
];
populateDemosDialog(demos);

})();
