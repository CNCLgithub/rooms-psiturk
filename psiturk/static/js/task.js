/*
 * Requires:
 *     psiturk.js
 *     utils.js
 *     instrunctions.js
 *     static/data/condlist.json
 */


// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// Names of elements used in the experiment
var PROGRESS = "progress";
var FULL_CONTAINER= "full-container";
var PAGESIZE = 500;

// Define global experiment variables
var SCALE_COMPLETE = false; // users do not need to repeat scaling
var PROLIFIC_ID = "";
var N_TRIALS = 128;
var START_INSTRUCTION = 0;

// Debug Variables
var SKIP_INSTRUCTIONS = false;
var SKIP_QUIZ = false;
//var SKIP_INSTRUCTIONS = true;
//var SKIP_QUIZ = true;

// All pages to be loaded
var pages = [
    "page.html",
    "quiz.html",
    "restart.html",
    "postquestionnaire.html"
];

psiTurk.preloadPages(pages);


/****************
 * Prolific ID  *
 ****************/

var ProlificID = function(condlist) {
    while (true) {
        PROLIFIC_ID = prompt("Please enter Prolific ID to proceed:");
        // a small check on length
        if (PROLIFIC_ID.length == 24) {
            psiTurk.recordTrialData({
                'prolific_id': PROLIFIC_ID,
            });
            console.log("prolific_id recorded:", PROLIFIC_ID);
            InstructionRunner(condlist);
            return;
        }
        alert("Make sure you enter the Prolific ID correctly, please try again.");
    }
}


/****************
 * Instructions  *
 ****************/

var InstructionRunner = function(condlist) {
    psiTurk.showPage('page.html');

    var start_instruction_page = START_INSTRUCTION;
    var nTrials = condlist.length;
    var ninstruct = instructions.length;

    // Plays next instruction or exits.
    // If there is another page, it is reach via callback in `page.showPage`
    var show_instruction_page = function(i) {

        if (i < ninstruct) {
            // constructing Page using the the instructions.js
            var page = new Page(...instructions[i],
                                header_text = "Instructions");

            page.showPage(function() {
                // page.clearResponse();
                show_instruction_page(i + 1);
            });
        } else {
            end_instructions();
        }
    };

    var end_instructions = function() {
        psiTurk.finishInstructions();
        quiz(function() {
            InstructionRunner(condlist);
        },
            function() {
                currentview = new Experiment(condlist);
            })
    };
    if (SKIP_INSTRUCTIONS) {
        end_instructions();
    } else {
        // start the loop
        show_instruction_page(start_instruction_page);
    };
};


/*********
 * Quiz  *
 *********/

// Describes the comprehension check
var loop = 1;
var quiz = function(goBack, goNext) {
    function record_responses() {
        var allRight = true;
        $('select').each(function(i, val) {
            psiTurk.recordTrialData({
                'phase': "INSTRUCTQUIZ",
                'question': this.id,
                'answer': this.value
            });

            if (this.id === 'trueFalse1' && this.value != 'c') {
                allRight = false;
            } else if (this.id === 'trueFalse2' && this.value != 'a') {
                allRight = false;
            }

        });
        return allRight
    };
    if (SKIP_QUIZ) {
        goNext();
    } else {
        psiTurk.showPage('quiz.html')
        $('#continue').click(function() {
            if (record_responses()) {
                // Record that the user has finished the instructions and
                // moved on to the experiment. This changes their status code
                // in the database.
                psiTurk.recordUnstructuredData('instructionloops', loop);
                psiTurk.finishInstructions();
                //console.log('Finished instructions');
                // Move on to the experiment
                goNext();
            } else {
                // Otherwise, replay the instructions...
                loop++;
                psiTurk.showPage('restart.html');
                $('.continue').click(
                    function() {
                        goBack();
                        // psiTurk.doInstructions(instructionPages, goBack) TODO REMOVE?
                    });
            }
        });

    };
};

/**************
 * Experiment *
 **************/

var Experiment = function(condlist) {
    psiTurk.showPage('page.html');

    shuffle(condlist);

    var curidx = 0;
    var starttime = -1;

    // uses `Page` to show a single trial
    var runTrial = function(curIdx) {
        // We've reached the end of the experiment
        if (curIdx === condlist.length) {
            end_experiment();
        }
        
        var pg = new Page("", "movie", condlist[curIdx], true,
                         next_delay = 1.0);

        pg.showProgress(curIdx, condlist.length);
        // `Page` will record the subject responce when "next" is clicked
        // and go to the next trial

        starttime = new Date().getTime();

        pg.showPage(
            function() {
                register_response(pg, curIdx);
                // Clears slider from screen
                // pg.clearResponse();
                runTrial(curIdx + 1);
            }
        );
    };

    // Record the subject's response for a given trial.
    var register_response = function(trialPage, cIdx) {
        var rt = new Date().getTime() - starttime;
        var rep = trialPage.retrieveResponse();
        // you may wish to format `rep` appropriately
        psiTurk.recordTrialData(
            {
                'TrialOrder': cIdx,
                'ReactionTime': rt,
                'IsInstruction': false,
                'TrialName': condlist[cIdx],
                'Response' : rep,
            }
        );
    };

    var end_experiment = function() {
        psiTurk.saveData();
        new Questionnaire();
    };


    // Let's begin!
    runTrial(0);
};



/****************
 * Questionnaire *
 ****************/

var Questionnaire = function() {

    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    record_responses = function() {

        psiTurk.recordTrialData({
            'phase': 'postquestionnaire',
            'status': 'submit'
        });

        $('textarea').each(function(i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('select').each(function(i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });

    };

    prompt_resubmit = function() {
        document.body.innerHTML = error_message;
        $("#resubmit").click(resubmit);
    };

    resubmit = function() {
        document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
        reprompt = setTimeout(prompt_resubmit, 10000);

        psiTurk.saveData({
            success: function() {
                clearInterval(reprompt);
                psiTurk.computeBonus('compute_bonus', function() {
                    finish()
                });
            },
            error: prompt_resubmit
        });
    };

    // Load the questionnaire snippet
    psiTurk.showPage('postquestionnaire.html');
    psiTurk.recordTrialData({
        'phase': 'postquestionnaire',
        'status': 'begin'
    });

    $("#next").click(function() {
        record_responses();
        psiTurk.saveData({
            success: function() {
                psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                //window.location.replace(PROLIFIC_RETURN_URL); // redirecting back to Prolific
            },
            error: prompt_resubmit
        });
    });


};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/


// madness TODO fix
var dataset;

$(window).load(function() {
    
    function load_condlist() {
        $.ajax({
            dataType: 'json',
            url: "static/data/condlist.json",
            async: false,
            success: function(data) {
                console.log("condition", condition);
                condlist = data[condition];
                condlist = condlist.slice(0, N_TRIALS);
                console.log(condlist);
                ProlificID(condlist);
            },
            error: function() {
                setTimeout(500, do_load)
            },
            failure: function() {
                setTimeout(500, do_load)
            }
        });

    };
  
    if (isMobileTablet()){
        console.log("mobile browser detected");
        alert(`Sorry, but mobile or tablet browsers are not supported. Please switch to a desktop browser or return the hit.`);
        return;
    }

    load_condlist();
});
