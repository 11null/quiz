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

    // Fix image URLs
    document.querySelectorAll("img").forEach(img => {
        if (!img.src.startsWith("https://superexpress.es/")) {
            img.src = "https://superexpress.es/" + img.src.replace(/^\/+/, "");
        }
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
