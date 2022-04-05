// each instruction is an array of 4 elements
// 1: The text to be shown (if any)
// 2: The type of format (image, movie, text, scale)
// 3: Any media needed (can be an empty string)
// 4: Whether to show the response div and what to show (false/"td"/"pr")
// 5: Any delay added to progression

var EXP_DURATION = 20;
var N_TRIALS = 120;

var instructions = [
    [
        "Hi! This experiment requires you to be using a <b>desktop browser</b>. The program should have automatically detected whether you are using a phone or a tablet. If you are using a phone or tablet and it has still allowed you to continue, please reopen the experiment in a desktop browser now. " +
        "If you can only use a tablet or a phone, and are unable to switch to a desktop browser, please quit the experiment and return the HIT.<br>" +
        "If you are on a desktop browser -- great! Click <b>Next</b> to continue.",
        "", "", false, 5
    ],
    [
        "Thank you for volunteering to help out with our study.<br>" +
        "<ul>" +
        "<li>Please take a moment to adjust your seating so that you can comfortably watch the monitor and use the keyboard/mouse." +
        "<li>Feel free to dim the lights as well." +
        "<li>Close the door or do whatever is necessary to minimize disturbance during the experiment." +
        "<li>Please also take a moment to silence your phone so that you are not interrupted by any messages mid-experiment." +
        "</ul><br>" +
        "Click <b>Next</b> when you are ready to continue.",
        "", "", false, 8
    ],
    [
        "This experiment requires you to be in <b>full screen</b> mode. The experiment will switch to full screen mode when you press the button below.<br>" +
        "Don't worry, we will return your browser to its normal size later. If you do need to leave in the middle, you can press the ESC key -- but please avoid this. Your responses are only useful to us if you stay in this mode until the end of the experiment.<br>"+
        "Click <b>Switch to full screen</b> and then <b>Next</b> to continue.",
        "fullscreen", "", false, 0
    ],
    [
        "The study is designed to be <i>challenging</i>. Sometimes, you'll be certain about what you saw. Other times, you won't be -- and this is okay! Just give your best guess each time.",
        "", "", false, 3
    ],
    [
        `I know it is also difficult to stay focused for so long, especially when you are doing the same thing over and over. But remember, the experiment will be all over in less than ${EXP_DURATION} minutes. Please do your best to remain focused! Your responses will only be useful to me if you remain focused.`,
        "", "", false, 3
    ],
    [
        "<b>Before we begin, follow the instructions below to setup your display.</b><br><hr />" +
        "<p>Please sit comfortably in front of you monitor and outstretch your arm holding a credit card (or a similary sized ID card). <br>" +
        "<p>Adjust the size of the image using the slider until its <strong>width</strong> matches the width of your credit card (or ID card).",
        "scale", "generic_cc.png", false, 1
    ],
    //[
        //"Please adjust contrast with the slider below so that you can see 7 rectangles as well as possible.",
        //"contrast", "contrast.png", false, 0
    //],
    // image with target labels (blue)
    [
        "At the beginning of each instance of the task, you will briefly see two images of rooms, with a white flash in between.<br> "+
            "Your task is to determine wether the two scene images where identical or different in any way.<br>" +
            "Click <b>Next</b> to see an example video.",
        "image", "1.png", false, 3
    ],
    [
        "", "movie", "1_1_1.mp4", false, 0
    ],
    [
        "At the end of each instance of the task, please record your response with your key board.<br>" +
            "You will not be able to progress untill you make a selection.<br>" +
            "Click <b>Next</b> to give it a try.",
        "", "", false, 3
    ],
    [
        "",
        "movie", "1_1_1.mp4", true, 0
    ],
    [
        `Please maintain this arm-length distance from your monitor for the duration of this experiment (${EXP_DURATION} minutes).` +
            "<br> Also, please keep your hands near the <b>f and j</b> keys for comfort and accuracy.",
        "", "", false, 2
    ],
    [
        "After a short check to make sure that you have understood the instructions, " +
        "you will have to make your judgments about " + N_TRIALS + " instances of the task.<br>",
        "", "", false, 2
    ],
];
