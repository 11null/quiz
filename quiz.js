// Load previous failures
let failedQuestions = JSON.parse(sessionStorage.getItem("failedQuestions") || "[]");

// Count how many failed questions are included in this quiz
let quizFailedCount = 0;

window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".question").forEach(q => {
        let qid = parseInt(q.dataset.qid);
        if (failedQuestions.includes(qid)) {
            quizFailedCount++;
            q.classList.add("failed-previously");
            let label = document.createElement("span");
            label.className = "failed-label";
            label.textContent = "⚠ Failed previously";
            q.prepend(label);
        }
    });

    if (quizFailedCount > 0) {
        document.getElementById("previousFailsBox").textContent =
            quizFailedCount + " of these questions were failed previously.";
    }

    // Current errors counter should always start at 0
    document.getElementById("errorCount").innerText = 0;

    // Fix image URLs - force all image sources to "https://superexpress.es/"
    // Fix image URLs - force all image sources to "https://superexpress.es/"
    // Also remove/replace any "/quiz/" paths in the URL
    document.querySelectorAll("img").forEach(img => {
        let finalPath = "";
    
        try {
            let url = new URL(img.src);
    
            // Extract clean path without leading slash
            finalPath = url.pathname.replace(/^\/+/, "");
    
        } catch (e) {
            // If src is not a valid absolute URL, treat as relative
            finalPath = img.src.replace(/^\/+/, "");
        }
    
        // Remove any "/quiz/" in the path
        finalPath = finalPath.replace(/(^|\/)quiz\//g, '$1');
    
        // Force the correct domain + cleaned path
        img.src = "https://superexpress.es/" + finalPath;
    });


});

function selectAnswer(questionId, optionId, isCorrect) {
    let container = document.getElementById("question-" + questionId);

    // Disable buttons
    let buttons = container.querySelectorAll(".option-btn");
    buttons.forEach(btn => btn.classList.add("disabled"));

    // Show explanations
    container.querySelectorAll(".explanation").forEach(expl => {
        expl.style.display = "block";
    });

    // Mark chosen button
    let chosen = document.getElementById("btn-" + questionId + "-" + optionId);
    chosen.classList.add(isCorrect ? "correct" : "incorrect");

    // Show result
    let resultLabel = document.getElementById("result-" + questionId);
    resultLabel.innerText = isCorrect ? "✔ Correct!" : "✖ Incorrect!";

    // Highlight correct option ALWAYS
    buttons.forEach(btn => {
        if (btn.dataset.correct === "true") {
            btn.classList.add("correct");
        }
    });

    // Count only new errors (not previously failed)
    if (!isCorrect && !failedQuestions.includes(questionId)) {
        failedQuestions.push(questionId);
        sessionStorage.setItem("failedQuestions", JSON.stringify(failedQuestions));

        let ec = document.getElementById("errorCount");
        ec.innerText = parseInt(ec.innerText) + 1;

        container.classList.add("failed-previously");
    }
}
